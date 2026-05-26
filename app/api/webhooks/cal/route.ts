import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { captureFunnelEvent } from "@/lib/analytics";
import {
  cancelMeeting,
  findOnboardingSessionByCalUuid,
  rescheduleMeeting,
  upsertMeetingFromBooking,
} from "@/lib/meetings/db";
import type { Attendee, MeetingType } from "@/lib/meetings/schema";
import {
  applyCalBookingToSession,
  updateCalBookingOnSession,
} from "@/lib/onboarding/db";

export const dynamic = "force-dynamic";

const AttendeeSchema = z.object({
  name: z.string().nullable().optional(),
  email: z.string().email(),
  timeZone: z.string().optional(),
});

const PayloadSchema = z.object({
  uid: z.string().min(1),
  startTime: z.string().optional(),
  attendees: z.array(AttendeeSchema).optional(),
  location: z.string().nullable().optional(),
  videoCallData: z.object({ url: z.string().optional() }).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const BodySchema = z.object({
  triggerEvent: z.string().min(1),
  payload: PayloadSchema,
});

function verifySignature(raw: string, header: string, secret: string): boolean {
  const computed = createHmac("sha256", secret).update(raw).digest("hex");
  const a = Buffer.from(computed, "utf8");
  const b = Buffer.from(header, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function extractMeetingUrl(payload: z.infer<typeof PayloadSchema>): string | null {
  if (payload.videoCallData?.url) return payload.videoCallData.url;
  if (payload.location && /^https?:\/\//.test(payload.location)) {
    return payload.location;
  }
  return null;
}

function pickClient(attendees: Attendee[]): {
  name: string | null;
  email: string | null;
} {
  const primary = attendees[0];
  if (!primary) return { name: null, email: null };
  return { name: primary.name, email: primary.email };
}

export async function POST(req: NextRequest) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CAL_WEBHOOK_SECRET not configured." },
      { status: 503 },
    );
  }

  const sig = req.headers.get("x-cal-signature-256");
  if (!sig) {
    return NextResponse.json({ error: "Missing signature." }, { status: 401 });
  }

  const raw = await req.text();
  if (!verifySignature(raw, sig, secret)) {
    return NextResponse.json({ error: "Bad signature." }, { status: 401 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Bad JSON." }, { status: 400 });
  }

  const result = BodySchema.safeParse(parsedBody);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid body.", details: result.error.format() },
      { status: 400 },
    );
  }

  const { triggerEvent, payload } = result.data;
  const calUuid = payload.uid;

  switch (triggerEvent) {
    case "BOOKING_CREATED": {
      if (!payload.startTime) {
        return NextResponse.json({ ok: true, recorded: false });
      }
      const scheduledAt = Date.parse(payload.startTime);
      if (!Number.isFinite(scheduledAt)) {
        return NextResponse.json({
          ok: true,
          recorded: false,
          reason: "unparseable startTime",
        });
      }

      const onboardingSessionIdRaw = payload.metadata?.onboarding_session_id;
      const onboardingSessionId =
        typeof onboardingSessionIdRaw === "string" && onboardingSessionIdRaw
          ? onboardingSessionIdRaw
          : null;

      if (onboardingSessionId) {
        const attendeeTz = payload.attendees?.[0]?.timeZone ?? null;
        await applyCalBookingToSession({
          sessionId: onboardingSessionId,
          cal_event_uuid: calUuid,
          slot_start_at: scheduledAt,
          slot_timezone: attendeeTz,
          booking_status: "confirmed",
        });
        void captureFunnelEvent(onboardingSessionId, "schedule_booked", {
          cal_event_uuid: calUuid,
          scheduled_at_ms: scheduledAt,
          attendee_timezone: attendeeTz,
        });
      }

      const onboarding = await findOnboardingSessionByCalUuid(calUuid);
      const meetingType: MeetingType = onboarding ? "onboarding" : "other";
      const attendees: Attendee[] = (payload.attendees ?? []).map((a) => ({
        name: a.name ?? null,
        email: a.email,
      }));
      const client = pickClient(attendees);
      await upsertMeetingFromBooking({
        cal_event_uuid: calUuid,
        meeting_type: meetingType,
        onboarding_session_id: onboarding?.id ?? null,
        scheduled_at: scheduledAt,
        meeting_url: extractMeetingUrl(payload),
        attendees,
        client_name: client.name,
        client_contact_email: client.email,
      });
      return NextResponse.json({ ok: true, recorded: true });
    }

    case "BOOKING_RESCHEDULED": {
      if (!payload.startTime) return NextResponse.json({ ok: true });
      const scheduledAt = Date.parse(payload.startTime);
      if (!Number.isFinite(scheduledAt)) return NextResponse.json({ ok: true });
      await rescheduleMeeting(calUuid, scheduledAt);
      await updateCalBookingOnSession({
        cal_event_uuid: calUuid,
        slot_start_at: scheduledAt,
        slot_timezone: payload.attendees?.[0]?.timeZone ?? null,
      });
      return NextResponse.json({ ok: true, recorded: true });
    }

    case "BOOKING_CANCELLED": {
      await cancelMeeting(calUuid);
      await updateCalBookingOnSession({
        cal_event_uuid: calUuid,
        booking_status: "canceled",
      });
      return NextResponse.json({ ok: true, recorded: true });
    }

    default:
      return NextResponse.json({
        ok: true,
        recorded: false,
        reason: `unhandled trigger: ${triggerEvent}`,
      });
  }
}
