"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

/**
 * PEBB-218: fire-once-on-mount client-side event capture.
 *
 * Lets a server component trigger a posthog-js event with computed
 * properties:
 *
 *   <AnalyticsTrigger
 *     event="projects_viewed"
 *     properties={{ project_count: 3, has_prior_priorities: false }}
 *   />
 *
 * Why this exists: server-captured events (posthog-node) don't carry
 * `$session_id`, so PostHog can't link them to session recordings.
 * posthog-js sets `$session_id` automatically. Routing the funnel
 * events through posthog-js means recordings become filterable by any
 * of them.
 *
 * Stable identity guarantee: fires exactly once on mount per (event,
 * stringified-properties) pair. Re-rendering the parent with the same
 * props won't double-fire; navigating away and back is a fresh mount =
 * one new event (which matches the funnel's "per visit" semantics).
 *
 * Silent no-op when NEXT_PUBLIC_POSTHOG_KEY is unset.
 */
export function AnalyticsTrigger({
  event,
  properties,
}: {
  event: string;
  properties?: Record<string, unknown>;
}) {
  const key = JSON.stringify(properties ?? {});
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
    posthog.capture(event, properties);
    // `key` is included in deps so logically the effect re-fires on
    // prop changes; in practice each page mounts a fresh component so
    // re-fires don't happen on a single page lifecycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key]);
  return null;
}
