import Anthropic from "@anthropic-ai/sdk";
import { streamPebbles, type PebbleProject } from "@/lib/anthropic";
import { upsertOnboardingSession } from "@/lib/onboarding/db";
import { scrapeSite } from "@/lib/scrape";
import { readSessionWithId } from "@/lib/session";

/**
 * PEBB-200: classify a thrown error into an operator-facing message + a
 * decision about whether to retry. Anthropic exports typed error subclasses
 * from `@anthropic-ai/sdk` so the matching is structural, not string-based.
 *
 * Retryable:
 * - RateLimitError (429) — server-side burst protection, usually clears in
 *   seconds. Operator did nothing wrong.
 * - APIError with status 529 — "overloaded." Same family as 429.
 * - APIError with status >= 500 — generic upstream failure. Worth one retry.
 *
 * NOT retryable:
 * - APIConnectionTimeoutError — we already waited; retrying just doubles
 *   the wait without changing the outcome most of the time.
 * - Validation / auth / missing-key errors — caller's problem.
 * - Anything else.
 */
function classifyError(err: unknown): {
  message: string;
  retryable: boolean;
} {
  if (err instanceof Anthropic.RateLimitError) {
    return {
      message:
        "Our AI provider is throttling right now — give it a minute and click Try again.",
      retryable: true,
    };
  }
  if (err instanceof Anthropic.APIConnectionTimeoutError) {
    return {
      message: "The model is taking longer than usual — please try again.",
      retryable: false,
    };
  }
  if (err instanceof Anthropic.APIError) {
    if (err.status === 529) {
      return {
        message:
          "Anthropic is overloaded right now — please try again in a minute.",
        retryable: true,
      };
    }
    if (err.status !== null && err.status >= 500) {
      return {
        message: "The AI provider hit a temporary error — please try again.",
        retryable: true,
      };
    }
  }
  return {
    message: "We couldn't generate pebbles just now. Try again in a minute.",
    retryable: false,
  };
}

/**
 * PEBB-200: wrap a call in exponential-backoff retry for the specific
 * Anthropic failure modes (RateLimitError, 529, 5xx). Two retries total
 * with 2s and 5s delays — caps at ~7s extra wait before surfacing. Burst
 * limiter usually clears within that window.
 *
 * Restriction: only retries while NO pebbles have emitted yet — the caller
 * passes `hasEmittedRef` so we can bail out of retry once the stream is
 * mid-flight. In practice the 429 fires on initial `messages.stream()`
 * setup, well before the first pebble; the guard is defensive.
 */
async function withInitialRetry<T>(
  fn: () => Promise<T>,
  hasEmittedRef: { current: boolean },
  attempts = 3,
): Promise<T> {
  const delays = [2000, 5000];
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (hasEmittedRef.current) throw err;
      const { retryable } = classifyError(err);
      if (!retryable || i === attempts - 1) throw err;
      const delayMs = delays[i] ?? delays[delays.length - 1];
      console.warn(
        `[start/stream] retry ${i + 1}/${attempts - 1} after ${delayMs}ms (${err instanceof Error ? err.message : String(err)})`,
      );
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw lastErr;
}

/**
 * PEBB-199: Server-Sent Events endpoint that streams the LLM-generated
 * pebble suggestions as they're assembled.
 *
 * Flow:
 *   1. Read the cookie to find the session created by /api/start/begin.
 *   2. Scrape the site (1-3s — couldn't be done in `begin` without a
 *      transient body-text column; doing it here keeps the schema clean).
 *   3. Run `streamPebbles` against Claude Haiku 4.5. Emit each completed
 *      pebble as an SSE `data:` event so the UI can render incrementally.
 *   4. On completion, persist the final pebbles array back to the session
 *      row and emit an `event: complete` so the client knows to redirect.
 *
 * Event shape over the wire:
 *   data: { "type": "pebble", "pebble": {…} }    one per pebble
 *   event: complete
 *   data: { "type": "complete" }                  end-of-stream
 *
 *   event: error
 *   data: { "type": "error", "message": "…" }    fatal — partial pebbles
 *                                                 already sent stay
 *                                                 surfaced on the client.
 *
 * Resume policy (out of scope for v1): a mid-stream refresh restarts
 * generation. With cap-3 + Haiku the total stream is ~10-15s so the cost
 * is small. PEBB-199's spec called for resume; a follow-up ticket will
 * persist partial pebbles inline as they emit, so a refresh skips the
 * already-emitted ones.
 *
 * PEBB-200: handle Anthropic 429s / 529s / 5xxs by retrying the initial
 * stream open up to twice (2s + 5s backoff). On final failure the operator
 * sees a specific message naming the cause instead of the previous
 * generic "Try again in a minute." Retry only fires before the first
 * pebble has emitted — guarded by `hasEmittedRef` so a mid-stream failure
 * can't double-emit pebbles.
 */

// Prevent Next.js from caching the SSE response.
export const dynamic = "force-dynamic";

function sse(event: string | null, data: unknown): string {
  const body = `data: ${JSON.stringify(data)}\n\n`;
  return event ? `event: ${event}\n${body}` : body;
}

export async function GET(): Promise<Response> {
  const session = await readSessionWithId();
  if (!session) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: "No onboarding session — submit the form first.",
      }),
      { status: 400, headers: { "content-type": "application/json" } },
    );
  }

  // Snapshot the inputs while we still have a sync context. The streaming
  // body below detaches into its own async generator, where the request
  // cookie store is no longer writable.
  const { id, url, bottleneck, email, createdAt } = session;

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (event: string | null, data: unknown): void => {
        controller.enqueue(encoder.encode(sse(event, data)));
      };

      const collected: PebbleProject[] = [];
      // PEBB-200: tracks whether onPebble has fired yet. The retry helper
      // refuses to re-enter streamPebbles once any pebble has emitted, so
      // we can't double-stream the same pebble even if a 429 somehow fired
      // mid-flight (unlikely — 429s are typically connection-time).
      const hasEmittedRef = { current: false };

      try {
        // Re-scrape inside the streaming context. 1-3s wall-clock before the
        // first SSE event, but the client renders 3 skeleton cards meanwhile.
        let site;
        try {
          site = await scrapeSite(url);
        } catch {
          // Tolerate scrape failures the same way the legacy server action
          // did — feed the LLM an empty body and let it work off the URL +
          // bottleneck alone.
          site = {
            url: url.startsWith("http") ? url : `https://${url}`,
            title: "",
            description: "",
            bodyText: "",
          };
        }

        const final = await withInitialRetry(
          () =>
            streamPebbles({ site, bottleneck }, async (pebble) => {
              hasEmittedRef.current = true;
              collected.push(pebble);
              emit(null, { type: "pebble", pebble });
            }),
          hasEmittedRef,
        );

        // Persist the final array back to the session row so subsequent
        // page loads (`/projects`) see the same data without re-generating.
        // Use `final` rather than `collected` to be defensive about any
        // pebbles surfaced via the end-of-stream tail emission.
        //
        // Write straight to the DB by session id rather than via
        // writeSession(): we're inside the ReadableStream body here, after
        // the SSE response headers are already committed, so mutating the
        // cookie store (which writeSession does) throws in Next.js and
        // aborts before `emit("complete")`. The cookie was already set by
        // /api/start/begin, so there's nothing to re-set.
        const now = Date.now();
        await upsertOnboardingSession({
          id,
          url,
          bottleneck,
          email: email ?? null,
          projects: final,
          prioritized: [],
          created_at: createdAt,
          updated_at: now,
        });

        emit("complete", { type: "complete", count: final.length });
      } catch (err) {
        // PEBB-200: classify Anthropic's typed errors into a specific
        // operator message instead of the previous generic "Try again."
        // Rate limits / 529s / 5xxs have already been retried twice by
        // withInitialRetry — if we're here, all retries exhausted.
        console.error("[start/stream] generation failed:", err);
        const { message } = classifyError(err);
        emit("error", {
          type: "error",
          message,
          partialCount: collected.length,
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      // Vercel routes SSE through its proxy; this hint disables buffering.
      "x-accel-buffering": "no",
    },
  });
}
