"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * PEBB-203: client-side PostHog init for the onboarding funnel.
 *
 * Lives in the root layout so every page can fire client events without
 * importing posthog-js directly. The provider:
 *   1. Initializes posthog-js once on mount, no-ops if NEXT_PUBLIC_POSTHOG_KEY
 *      is unset (preview deploys without secrets, local dev).
 *   2. Lets posthog auto-capture page views — those events are NOT in the
 *      named funnel but give us extra context (referrer, utm params).
 *   3. The named funnel events (intake_started, projects_viewed, etc.)
 *      are fired explicitly by the components that own each step. Server-
 *      side events use `lib/analytics.ts` instead.
 *
 * Distinct id stitching: posthog-js generates its own visitor id at first
 * load (anonymous). When `/api/start/begin` mints the onboarding session
 * id, the StartForm calls `posthog.identify(sessionId)` to alias the
 * anonymous visitor onto the session id — so `intake_started` (fired
 * before the session existed) stitches into the same funnel as the
 * server-side `intake_submitted` and beyond.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    if (posthog.__loaded) return;
    posthog.init(key, {
      api_host:
        process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      // Defer first capture until we're sure the user opted past the
      // landing page. Empty string = no auto-pageview on init; we let
      // posthog's `capture_pageview: true` default handle subsequent
      // navigation.
      capture_pageview: true,
      // We don't need session recording for the funnel; can be toggled
      // on later from the PostHog UI per-project.
      disable_session_recording: true,
      // Respect Do Not Track in browsers.
      respect_dnt: true,
    });
  }, []);
  return <>{children}</>;
}
