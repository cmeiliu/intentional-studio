import { NextResponse } from "next/server";
import { z } from "zod";
import { scrapeSite } from "@/lib/scrape";
import { writeSession } from "@/lib/session";

/**
 * PEBB-203: hash the URL's host so we can answer "what fraction of intakes
 * come from a previously-seen domain" without storing the raw domain in
 * PostHog. Avoids leaking lead identity through analytics while still
 * supporting funnel-by-domain breakdowns later.
 */
async function hashDomain(rawUrl: string): Promise<string | null> {
  try {
    const host = new URL(
      rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`,
    ).host.replace(/^www\./, "");
    const data = new TextEncoder().encode(host);
    const digest = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(digest).slice(0, 8))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return null;
  }
}

/**
 * PEBB-199: split the onboarding submit into two halves so the heavy LLM
 * call can stream into the UI instead of blocking it.
 *
 * /api/start/begin (this route):
 *   - validate the form
 *   - scrape the site (synchronous, takes 1-3s)
 *   - write an EMPTY onboarding session row (`projects: []`) and the cookie
 *   - return success
 *
 * /api/start/pebbles/stream:
 *   - read the cookie → load the empty session
 *   - run `streamPebbles` and emit each completed pebble over SSE
 *   - persist the full array to the session row on completion
 *
 * Client (StartForm.tsx) calls begin first, then opens an EventSource on
 * the stream route.
 */

const InputSchema = z.object({
  url: z.string().min(2).max(200),
  email: z.string().email().max(200),
  bottleneck: z.string().min(10).max(2000),
});

/**
 * PEBB-218: response carries the precomputed `intake_submitted` event
 * properties so the client can fire the event via posthog-js (which
 * auto-attaches the `$session_id` PostHog needs to link the event to
 * the session recording). Computing them on the server keeps the
 * domain-hash logic in one place and avoids duplicating
 * Web-Crypto-SubtleCrypto code into a Client Component.
 */
export type StartBeginResponse =
  | {
      ok: true;
      sessionId: string;
      analytics: {
        bottleneck_length: number;
        url_domain_hash: string | null;
        scrape_ok: boolean;
      };
    }
  | { ok: false; error: string };

export async function POST(request: Request): Promise<NextResponse<StartBeginResponse>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const parsed = InputSchema.safeParse(body);
  if (!parsed.success) {
    const emailIssue = parsed.error.issues.find((i) =>
      i.path.includes("email"),
    );
    const error = emailIssue
      ? "Please enter a valid email address."
      : "Please enter a valid website and a bottleneck (10+ chars).";
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  let site;
  try {
    site = await scrapeSite(parsed.data.url);
  } catch {
    site = {
      url: parsed.data.url.startsWith("http")
        ? parsed.data.url
        : `https://${parsed.data.url}`,
      title: "",
      description: "",
      bodyText: "",
    };
  }

  let sessionId: string;
  try {
    // Empty `projects: []` row is the marker that the streaming endpoint
    // should produce pebbles and persist them. The cookie set by
    // writeSession is what `/api/start/pebbles/stream` reads to find this
    // row again.
    sessionId = await writeSession({
      url: site.url,
      bottleneck: parsed.data.bottleneck,
      email: parsed.data.email,
      projects: [],
      createdAt: Date.now(),
    });
  } catch (err) {
    console.error("[start/begin] session persistence failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your session. Please try again in a minute.",
      },
      { status: 500 },
    );
  }

  // PEBB-218: precompute the event properties + return them. The client
  // fires `intake_submitted` via posthog-js so the event picks up the
  // recording's `$session_id`.
  const domainHash = await hashDomain(parsed.data.url);

  return NextResponse.json({
    ok: true,
    sessionId,
    analytics: {
      bottleneck_length: parsed.data.bottleneck.length,
      url_domain_hash: domainHash,
      scrape_ok: site.bodyText.length > 0,
    },
  });
}
