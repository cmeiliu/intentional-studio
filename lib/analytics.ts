import { PostHog } from "posthog-node";

/**
 * Server-side PostHog wrapper.
 *
 * PEBB-203: introduced for the funnel events.
 * PEBB-218: most funnel events moved to the client (via posthog-js)
 * because server-captured events lack `$session_id` — without that
 * property PostHog can't link the event to a session recording. This
 * module now serves only the events that originate server-side with no
 * browser involved, currently:
 *
 *   - `schedule_booked` — fired from the Cal.com webhook handler. Note:
 *     this event can't filter recordings (no `$session_id` source).
 *
 * Distinct_id: pass the onboarding session id. PostHog stitches the
 * funnel because every client-side event also uses that same id after
 * StartForm calls `posthog.identify(sessionId)` on submit.
 *
 * Graceful no-op when `POSTHOG_KEY` is unset.
 */

const FUNNEL_EVENTS = [
  "intake_started",
  "intake_submitted",
  "projects_viewed",
  "project_prioritized",
  "schedule_viewed",
  "schedule_booked",
  "presurvey_viewed",
  "presurvey_submitted",
] as const;

export type FunnelEvent = (typeof FUNNEL_EVENTS)[number];

let client: PostHog | null = null;
let warnedMissing = false;

function getClient(): PostHog | null {
  if (client) return client;
  const key = process.env.POSTHOG_KEY;
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  if (!key) {
    if (!warnedMissing) {
      warnedMissing = true;
      console.warn(
        "[analytics] POSTHOG_KEY unset — funnel events are no-ops. Set the env var to enable.",
      );
    }
    return null;
  }
  client = new PostHog(key, {
    host,
    // Flush on every call. Vercel serverless handlers are short-lived;
    // batching would lose events at function-exit. The volume is low
    // enough that per-event flushes are fine.
    flushAt: 1,
    flushInterval: 0,
  });
  return client;
}

/**
 * Fire a funnel event. Safe to call from any server context (route
 * handler, server component, server action). Awaits the PostHog flush
 * so the event lands before the serverless function exits.
 *
 * Errors are caught and logged — analytics failures must NEVER break
 * the funnel itself.
 */
export async function captureFunnelEvent(
  distinctId: string,
  event: FunnelEvent,
  properties?: Record<string, unknown>,
): Promise<void> {
  const ph = getClient();
  if (!ph) return;
  try {
    ph.capture({
      distinctId,
      event,
      properties: properties ?? {},
    });
    // posthog-node v5 returns a promise from flush().
    await ph.flush();
  } catch (err) {
    console.error(`[analytics] capture(${event}) failed:`, err);
  }
}
