"use client";

import Cal from "@calcom/embed-react";

// Cal.com owns the entire booking + $50 deposit flow via its own Stripe
// integration (event-type → Apps → Stripe → "Collect payment on booking").
// We just mount the inline embed; Cal handles slot selection, the card form,
// the charge, the confirmation screen, and refunds (per its event-type
// "Refund policy" — currently "If cancelled 5 business days before").
//
// PEBB-180: we pass two things into Cal's config so the booking can be
// linked back to the originating onboarding session server-side via the
// Cal webhook:
//   - `metadata.onboarding_session_id`: Cal's documented metadata
//     pass-through. Flows into every Cal webhook payload (BOOKING_CREATED,
//     RESCHEDULED, CANCELLED) and lets /api/webhooks/cal update the
//     matching onboarding.sessions row.
//   - `email`: prefills the Cal email field with whatever the visitor
//     typed at /start. Editable in Cal if they want a different one;
//     step-1 email stays canonical on our side.
//
// `name` stays blank — no Step 1 name to prefill.
export function ScheduleEmbed({
  calLink,
  onboardingSessionId,
  prefilledEmail,
}: {
  calLink: string;
  onboardingSessionId: string;
  prefilledEmail: string;
}) {
  return (
    <div className="relative h-full w-full">
      <Cal
        namespace="intentional-discovery"
        calLink={calLink}
        style={{ width: "100%", height: "100%", minHeight: "600px" }}
        config={{
          layout: "month_view",
          name: "",
          email: prefilledEmail,
          metadata: { onboarding_session_id: onboardingSessionId },
        }}
      />
    </div>
  );
}
