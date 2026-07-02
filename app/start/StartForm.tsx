"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import posthog from "posthog-js";
import type { PebbleProject } from "@/lib/anthropic";

/**
 * PEBB-199: replaces the prior blocking server-action submit. Now:
 *   1. POST /api/start/begin to validate, scrape, and create the session row
 *      (returns in ~1-3s).
 *   2. Open an EventSource to /api/start/pebbles/stream which streams pebbles
 *      as the model assembles them.
 *   3. Render 3 skeleton cards immediately; each one fills in as its pebble
 *      event arrives. On `event: complete`, redirect to /projects.
 *   4. On `event: error`, surface a regenerate button and keep any partial
 *      pebbles visible.
 *
 * The form fields stay controlled (this used to be uncontrolled with
 * `useActionState`'s server-side state) so we can preserve the operator's
 * input across error/retry without making a server round-trip.
 */
export function StartForm() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [email, setEmail] = useState("");
  // Once the operator edits the email themselves, stop auto-filling it from
  // the website field so we never clobber what they typed.
  const [emailEdited, setEmailEdited] = useState(false);
  const [bottleneck, setBottleneck] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [phase, setPhase] = useState<"idle" | "begin" | "streaming" | "done" | "error">("idle");
  const [pebbles, setPebbles] = useState<PebbleProject[]>([]);

  // PEBB-203: `intake_started` fires once when the operator lands on /start.
  // PostHog uses its own anonymous visitor id here; after submit succeeds we
  // call `posthog.identify(...)` with the onboarding session id so this
  // event stitches into the same funnel as the server-side events.
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture("intake_started");
    }
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setPebbles([]);
    setPhase("begin");

    // 1. Validate + create session row.
    let begin: Response;
    try {
      begin = await fetch("/api/start/begin", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url, email, bottleneck }),
      });
    } catch {
      setError("We couldn't reach the server. Please try again.");
      setPhase("error");
      return;
    }
    if (!begin.ok) {
      const data = (await begin.json().catch(() => null)) as
        | { error?: string }
        | null;
      setError(data?.error ?? "Please check your inputs and try again.");
      setPhase("error");
      return;
    }

    // PEBB-203: alias the anonymous PostHog visitor onto the onboarding
    // session id so the pre-submit `intake_started` event stitches into
    // the same funnel as the events that follow.
    // PEBB-218: also fire `intake_submitted` here (was server-side via
    // posthog-node) so the event picks up the recording's `$session_id`
    // and PostHog can filter recordings on this funnel step. The server
    // response carries the precomputed properties so we don't duplicate
    // the domain-hash logic in the client bundle.
    try {
      const body = (await begin.clone().json()) as
        | {
            ok: true;
            sessionId: string;
            analytics?: {
              bottleneck_length: number;
              url_domain_hash: string | null;
              scrape_ok: boolean;
            };
          }
        | { ok: false };
      if (body.ok && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
        posthog.identify(body.sessionId);
        if (body.analytics) {
          posthog.capture("intake_submitted", body.analytics);
        }
      }
    } catch {
      // ignore — analytics never blocks the funnel
    }

    // 2. Open the stream.
    setPhase("streaming");
    const source = new EventSource("/api/start/pebbles/stream");

    source.onmessage = (ev) => {
      try {
        const parsed = JSON.parse(ev.data) as
          | { type: "pebble"; pebble: PebbleProject }
          | { type: "complete" };
        if (parsed.type === "pebble") {
          setPebbles((prev) => [...prev, parsed.pebble]);
        }
      } catch {
        // Bad payload — ignore the chunk, the stream's `complete` or
        // `error` event will resolve the phase.
      }
    };

    source.addEventListener("complete", () => {
      source.close();
      setPhase("done");
      router.push("/projects");
    });

    source.addEventListener("error", (ev) => {
      // Two error shapes hit this listener: explicit server-sent `event:
      // error` (which arrives as a MessageEvent with JSON data), and
      // transport-level disconnects (which arrive as a generic Event with
      // no data). Read defensively.
      const data =
        ev instanceof MessageEvent && typeof ev.data === "string"
          ? safeJson(ev.data)
          : null;
      const message =
        (data && typeof (data as { message?: string }).message === "string"
          ? (data as { message: string }).message
          : null) ?? "The stream ended unexpectedly. Try again in a minute.";
      source.close();
      setError(message);
      setPhase("error");
    });
  }

  const submitting = phase === "begin" || phase === "streaming";
  const showSkeletons = phase === "streaming";
  const showPebbles = pebbles.length > 0;

  // PEBB-215: status line that gives the operator concrete signal of
  // what's happening during the ~10–15s stream. Synced to real stream
  // state (pebbles.length, phase) where possible, with a soft pre-pebble
  // cycle for the warmup window before any pebble has arrived. Voice
  // stays restrained — no spinner copy, no "AI magic" cuteness.
  const statusMessage = useStatusMessage({
    phase,
    pebbleCount: pebbles.length,
    url,
  });
  const showStatus =
    phase === "begin" || phase === "streaming" || phase === "done";
  const totalPebbles = 3;
  const progressPct = Math.min(
    100,
    Math.round((pebbles.length / totalPebbles) * 100),
  );

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label htmlFor="url" className="block text-sm text-ink-2 mb-2">
            Your website
          </label>
          <input
            id="url"
            name="url"
            type="text"
            required
            value={url}
            onChange={(e) => {
              const next = e.target.value;
              setUrl(next);
              // Prefill the email with "@domain" so the operator only has
              // to type the part before the @. Skip once they've edited the
              // email themselves.
              if (!emailEdited) {
                const domain = prettyDomain(next);
                setEmail(domain ? `@${domain}` : "");
              }
            }}
            disabled={submitting}
            placeholder="yourbusiness.com"
            className="w-full px-4 py-3 bg-cream-2 border border-ink/15 rounded-lg text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy-deep transition-colors disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm text-ink-2 mb-2">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailEdited(true);
            }}
            onFocus={(e) => {
              // When only the auto-filled "@domain" is present, put the
              // cursor at the very start so typing lands before the @.
              if (e.currentTarget.value.startsWith("@")) {
                e.currentTarget.setSelectionRange(0, 0);
              }
            }}
            disabled={submitting}
            placeholder="you@yourbusiness.com"
            className="w-full px-4 py-3 bg-cream-2 border border-ink/15 rounded-lg text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy-deep transition-colors disabled:opacity-60"
          />
          <p className="text-xs text-ink-muted mt-2">
            Where to send your project recap. We won&rsquo;t email you otherwise.
          </p>
        </div>
        <div>
          <label htmlFor="bottleneck" className="block text-sm text-ink-2 mb-2">
            What&rsquo;s the biggest bottleneck in your business right now?
          </label>
          <textarea
            id="bottleneck"
            name="bottleneck"
            required
            minLength={10}
            rows={6}
            value={bottleneck}
            onChange={(e) => setBottleneck(e.target.value)}
            disabled={submitting}
            placeholder="Be specific. The more you say, the sharper the ideas."
            className="w-full px-4 py-3 bg-cream-2 border border-ink/15 rounded-lg text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy-deep transition-colors resize-none disabled:opacity-60"
          />
        </div>
        {error && (
          <div className="text-sm text-burgundy-deep border border-burgundy/30 bg-burgundy-pale rounded-lg px-4 py-3 space-y-1">
            <p>{error}</p>
            <p className="text-ink-2">
              Your answers are still here — tweak if you&rsquo;d like, then try again.
            </p>
          </div>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-7 py-4 rounded-full bg-burgundy-deep text-cream-0 hover:bg-burgundy-darkest disabled:opacity-60 disabled:cursor-not-allowed transition-colors text-base font-medium"
        >
          {phase === "idle" && (error ? "Try again" : "Show me what to build")}
          {phase === "begin" && "Reading your site…"}
          {phase === "streaming" && "Generating…"}
          {phase === "done" && "Done — redirecting…"}
          {phase === "error" && "Try again"}
        </button>
        <p className="text-xs text-ink-muted">
          We&rsquo;ll briefly read your homepage so the suggestions match what you actually do.
        </p>
      </form>

      {showStatus && (
        <div className="pt-2 space-y-3">
          <div className="flex items-center justify-between gap-4 text-sm">
            <span className="text-ink-2">{statusMessage}</span>
            <span className="text-xs font-mono text-ink-muted shrink-0">
              {pebbles.length} / {totalPebbles}
            </span>
          </div>
          <div className="h-1 bg-ink/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-burgundy-deep transition-all duration-500 ease-out"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      {(showSkeletons || showPebbles) && (
        <div className="space-y-3 pt-2">
          {/* Render 3 slots; fill from `pebbles`, fall back to skeleton */}
          {[0, 1, 2].map((i) => {
            const p = pebbles[i];
            if (p) {
              return <PebbleCard key={i} index={i} pebble={p} />;
            }
            return showSkeletons ? (
              <PebbleSkeleton key={i} index={i} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

/**
 * PEBB-215: derive a status message from the stream state. For the
 * pre-first-pebble window we cycle a soft sequence on a timer so the
 * operator sees motion even before the SSE feed has anything to show.
 * Once pebbles start arriving the message snaps to the real count.
 */
function useStatusMessage({
  phase,
  pebbleCount,
  url,
}: {
  phase: "idle" | "begin" | "streaming" | "done" | "error";
  pebbleCount: number;
  url: string;
}): string {
  const [warmupIdx, setWarmupIdx] = useState(0);

  useEffect(() => {
    if (phase !== "streaming" || pebbleCount > 0) return;
    const id = setInterval(() => setWarmupIdx((i) => i + 1), 2500);
    return () => clearInterval(id);
  }, [phase, pebbleCount]);

  // Reset warmup cycle when a new submit starts
  useEffect(() => {
    if (phase === "begin") setWarmupIdx(0);
  }, [phase]);

  if (phase === "begin") {
    const domain = prettyDomain(url);
    return domain ? `Reading ${domain}…` : "Reading your site…";
  }

  if (phase === "done") {
    return "All three ready — opening your list…";
  }

  if (phase === "streaming") {
    if (pebbleCount === 0) {
      const warmup = [
        "Looking for the slowest parts of your week…",
        "Mapping what your bottleneck actually feeds into…",
        "Sketching the first idea…",
      ];
      return warmup[warmupIdx % warmup.length];
    }
    if (pebbleCount === 1) return "Idea 1 ready — drafting the next one…";
    if (pebbleCount === 2) return "Idea 2 ready — wrapping the last one…";
    return "Almost there…";
  }

  return "";
}

function prettyDomain(url: string): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function PebbleCard({
  index,
  pebble,
}: {
  index: number;
  pebble: PebbleProject;
}) {
  return (
    <div className="border border-ink/15 bg-cream-1 rounded-lg p-4 space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="serif text-lg text-ink m-0">
          <span className="text-xs font-mono text-ink-muted uppercase tracking-wider mr-2">
            Idea {index + 1}
          </span>
          {pebble.title}
        </h3>
        <span className="text-xs font-mono text-ink-muted uppercase tracking-wider">
          {pebble.category}
        </span>
      </div>
      <p className="text-sm text-ink-2 leading-relaxed m-0">
        {pebble.what_it_does}
      </p>
      <div className="flex items-baseline justify-between gap-3 pt-1">
        <span className="text-xs text-ink-muted">
          Effort: {pebble.effort}
        </span>
        <span className="text-xs text-ink-2">{pebble.expected_impact}</span>
      </div>
    </div>
  );
}

function PebbleSkeleton({ index }: { index: number }) {
  return (
    <div className="border border-ink/15 bg-cream-1 rounded-lg p-4 space-y-2 animate-pulse">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-mono text-ink-muted/60 uppercase tracking-wider">
          Idea {index + 1}
        </span>
        <div className="h-4 w-2/5 bg-ink/10 rounded" />
      </div>
      <div className="h-3 w-full bg-ink/10 rounded" />
      <div className="h-3 w-11/12 bg-ink/10 rounded" />
      <div className="h-3 w-3/4 bg-ink/10 rounded" />
    </div>
  );
}

function safeJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
