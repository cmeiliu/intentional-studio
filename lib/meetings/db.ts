import { neon } from "@neondatabase/serverless";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { sessions as onboardingSessions } from "../onboarding/schema";
import {
  meetings,
  type Attendee,
  type MeetingRow,
  type MeetingType,
} from "./schema";

type Db = ReturnType<typeof drizzle>;
let _db: Db | null = null;

function db(): Db {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  _db = drizzle({ client: neon(url) });
  return _db;
}

export type CreateMeetingInput = {
  cal_event_uuid: string;
  meeting_type: MeetingType;
  onboarding_session_id?: string | null;
  scheduled_at: number;
  meeting_url?: string | null;
  attendees: Attendee[];
  client_name?: string | null;
  client_contact_email?: string | null;
};

export async function upsertMeetingFromBooking(
  input: CreateMeetingInput,
): Promise<MeetingRow> {
  const now = Date.now();
  const rows = await db()
    .insert(meetings)
    .values({
      cal_event_uuid: input.cal_event_uuid,
      meeting_type: input.meeting_type,
      onboarding_session_id: input.onboarding_session_id ?? null,
      scheduled_at: input.scheduled_at,
      meeting_url: input.meeting_url ?? null,
      attendees: input.attendees,
      client_name: input.client_name ?? null,
      client_contact_email: input.client_contact_email ?? null,
      status: "scheduled",
      created_at: now,
    })
    .onConflictDoNothing({ target: meetings.cal_event_uuid })
    .returning();
  if (rows.length > 0) return rows[0];
  const existing = await getMeetingByCalUuid(input.cal_event_uuid);
  if (!existing) throw new Error("upsert race: row not found after conflict");
  return existing;
}

export async function getMeetingByCalUuid(
  cal_event_uuid: string,
): Promise<MeetingRow | null> {
  const rows = await db()
    .select()
    .from(meetings)
    .where(eq(meetings.cal_event_uuid, cal_event_uuid))
    .limit(1);
  return rows[0] ?? null;
}

export async function findOnboardingSessionByCalUuid(
  cal_event_uuid: string,
): Promise<{ id: string } | null> {
  const rows = await db()
    .select({ id: onboardingSessions.id })
    .from(onboardingSessions)
    .where(eq(onboardingSessions.cal_event_uuid, cal_event_uuid))
    .limit(1);
  return rows[0] ?? null;
}

export async function rescheduleMeeting(
  cal_event_uuid: string,
  scheduled_at: number,
): Promise<void> {
  await db()
    .update(meetings)
    .set({ scheduled_at })
    .where(eq(meetings.cal_event_uuid, cal_event_uuid));
}

export async function cancelMeeting(cal_event_uuid: string): Promise<void> {
  await db()
    .update(meetings)
    .set({ status: "cancelled", cancelled_at: Date.now() })
    .where(
      and(
        eq(meetings.cal_event_uuid, cal_event_uuid),
        sql`${meetings.status} != 'cancelled'`,
      ),
    );
}
