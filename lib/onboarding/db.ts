import { neon } from "@neondatabase/serverless";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import {
  presurveySubmissions,
  sessions,
  type BookingStatus,
  type OnboardingSessionRow,
  type PresurveySessionSnapshot,
  type PresurveySubmissionRow,
} from "./schema";

type Db = ReturnType<typeof drizzle>;
let _db: Db | null = null;

export function getDb(): Db {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  _db = drizzle({ client: neon(url) });
  return _db;
}

export async function getOnboardingSession(
  id: string,
): Promise<OnboardingSessionRow | null> {
  const rows = await getDb()
    .select()
    .from(sessions)
    .where(eq(sessions.id, id))
    .limit(1);
  return rows[0] ?? null;
}

// Only the pre-booking fields are required for the intake flow. The
// Cal.com booking fields (slot_start_at, slot_timezone, cal_event_uuid,
// booking_status, hold_expires_at) are populated by the Cal.com webhook
// on BOOKING_CREATED / RESCHEDULED / CANCELLED — see
// app/api/webhooks/cal/route.ts. PEBB-211 removed the legacy in-house
// Stripe columns (payment_intent_id, refund_id, attendance_set_at) and
// their writer functions; Cal.com Payments owns the deposit flow now.
export type UpsertSessionInput = Pick<
  OnboardingSessionRow,
  | "id"
  | "url"
  | "bottleneck"
  | "email"
  | "projects"
  | "prioritized"
  | "created_at"
  | "updated_at"
>;

export async function upsertOnboardingSession(
  row: UpsertSessionInput,
): Promise<void> {
  await getDb()
    .insert(sessions)
    .values(row)
    .onConflictDoUpdate({
      target: sessions.id,
      set: {
        url: sql`excluded.url`,
        bottleneck: sql`excluded.bottleneck`,
        email: sql`excluded.email`,
        projects: sql`excluded.projects`,
        prioritized: sql`excluded.prioritized`,
        updated_at: sql`excluded.updated_at`,
      },
    });
}

/**
 * PEBB-180: Apply Cal booking state to the matching onboarding session row.
 *
 * Called from `/api/webhooks/cal` when Cal fires BOOKING_CREATED with
 * `metadata.onboarding_session_id` present. Reuses the dormant booking
 * columns that PR #156 added and PR #188 left in place.
 *
 * Idempotent: re-firing the same Cal event ends with the same row state.
 * Re-firing with different values (reschedule) updates the slot but does NOT
 * change cal_event_uuid — we use that as the per-booking key.
 *
 * Returns `false` if no row matches the session id (e.g. the session row was
 * deleted, or the metadata id was forged). The webhook treats that as a soft
 * miss and records the meeting independently.
 */
export async function applyCalBookingToSession(args: {
  sessionId: string;
  cal_event_uuid: string;
  slot_start_at: number;
  slot_timezone: string | null;
  booking_status: BookingStatus;
}): Promise<boolean> {
  const now = Date.now();
  const result = await getDb()
    .update(sessions)
    .set({
      cal_event_uuid: args.cal_event_uuid,
      slot_start_at: args.slot_start_at,
      slot_timezone: args.slot_timezone,
      booking_status: args.booking_status,
      updated_at: now,
    })
    .where(eq(sessions.id, args.sessionId))
    .returning({ id: sessions.id });
  return result.length > 0;
}

/**
 * PEBB-180: Update the booking state on an existing onboarding session,
 * keyed by the Cal event uuid. Used for BOOKING_RESCHEDULED (updates
 * slot_start_at) and BOOKING_CANCELLED (flips booking_status). Returns
 * `false` if no onboarding row owns this Cal event uuid — that's fine,
 * the booking might be for a non-onboarding meeting type.
 */
export async function updateCalBookingOnSession(args: {
  cal_event_uuid: string;
  slot_start_at?: number;
  slot_timezone?: string | null;
  booking_status?: BookingStatus;
}): Promise<boolean> {
  const patch: Record<string, unknown> = { updated_at: Date.now() };
  if (args.slot_start_at !== undefined) patch.slot_start_at = args.slot_start_at;
  if (args.slot_timezone !== undefined) patch.slot_timezone = args.slot_timezone;
  if (args.booking_status !== undefined) patch.booking_status = args.booking_status;
  const result = await getDb()
    .update(sessions)
    .set(patch)
    .where(eq(sessions.cal_event_uuid, args.cal_event_uuid))
    .returning({ id: sessions.id });
  return result.length > 0;
}

export type PresurveySubmissionInput = {
  sessionId: string;
  name: string;
  email: string;
  team_shape: string | null;
  current_workflow: string | null;
  tools: string | null;
  success: string | null;
  constraints: string | null;
  session_snapshot: PresurveySessionSnapshot;
};

export async function createPresurveySubmission(
  input: PresurveySubmissionInput,
): Promise<PresurveySubmissionRow> {
  const now = Date.now();
  const rows = await getDb()
    .insert(presurveySubmissions)
    .values({
      id: crypto.randomUUID(),
      session_id: input.sessionId,
      name: input.name,
      email: input.email,
      team_shape: input.team_shape,
      current_workflow: input.current_workflow,
      tools: input.tools,
      success: input.success,
      constraints: input.constraints,
      session_snapshot: input.session_snapshot,
      created_at: now,
      updated_at: now,
    })
    .returning();
  const row = rows[0];
  if (!row) throw new Error("Failed to create presurvey submission");
  return row;
}

export async function markPresurveyNotificationSent(
  id: string,
  notificationId: string,
): Promise<void> {
  const now = Date.now();
  await getDb()
    .update(presurveySubmissions)
    .set({
      notification_id: notificationId,
      notification_error: null,
      notified_at: now,
      updated_at: now,
    })
    .where(eq(presurveySubmissions.id, id));
}

export async function markPresurveyNotificationFailed(
  id: string,
  error: string,
): Promise<void> {
  await getDb()
    .update(presurveySubmissions)
    .set({
      notification_error: error.slice(0, 2000),
      updated_at: Date.now(),
    })
    .where(eq(presurveySubmissions.id, id));
}

// --- Booking helpers (PEBB-40/41/42/43) -----------------------------------

export async function updateBookingHold(
  id: string,
  args: {
    slot_start_at: number;
    slot_timezone: string;
    cal_event_uuid: string;
    hold_expires_at: number;
  },
): Promise<void> {
  await getDb()
    .update(sessions)
    .set({
      slot_start_at: args.slot_start_at,
      slot_timezone: args.slot_timezone,
      cal_event_uuid: args.cal_event_uuid,
      hold_expires_at: args.hold_expires_at,
      booking_status: "tentative",
      updated_at: Date.now(),
    })
    .where(eq(sessions.id, id));
}

export async function markExpired(id: string): Promise<void> {
  await getDb()
    .update(sessions)
    .set({ booking_status: "expired", updated_at: Date.now() })
    .where(eq(sessions.id, id));
}

export async function setBookingStatus(
  id: string,
  status: BookingStatus,
): Promise<void> {
  await getDb()
    .update(sessions)
    .set({ booking_status: status, updated_at: Date.now() })
    .where(eq(sessions.id, id));
}

// PEBB-211: removed `markConfirmed`, `markAttended`, `markNoShow`, and
// `getByPaymentIntent` — all dead since Cal.com Payments took over the
// deposit flow. Their target columns (`payment_intent_id`, `refund_id`,
// `attendance_set_at`) are also removed from the Drizzle schema in this
// PR; the DB still has the physical columns until PR 2 drops them.

export async function getByCalEventUuid(
  cal_event_uuid: string,
): Promise<OnboardingSessionRow | null> {
  const rows = await getDb()
    .select()
    .from(sessions)
    .where(eq(sessions.cal_event_uuid, cal_event_uuid))
    .limit(1);
  return rows[0] ?? null;
}
