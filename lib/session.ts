import { cookies } from "next/headers";
import type { PebbleProject } from "./anthropic";
import {
  getOnboardingSession,
  upsertOnboardingSession,
} from "./onboarding/db";

const COOKIE_NAME = "intentional_session";
const MAX_AGE = 60 * 60 * 24 * 7;

export type PebbleSession = {
  url: string;
  bottleneck: string;
  // Optional in the type so old anonymous rows (pre-PEBB-179) still parse,
  // but new sessions always carry it — `/start` validates required.
  email?: string | null;
  projects: PebbleProject[];
  prioritized?: number[];
  createdAt: number;
  slotStartAt?: number | null;
  slotTimezone?: string | null;
  bookingStatus?: string | null;
};

export type PebbleSessionWithId = PebbleSession & {
  id: string;
};

/**
 * Writes the session row + sets the cookie. Returns the session id so
 * callers can use it as a PostHog distinct_id for funnel events fired in
 * the same request (PEBB-203).
 */
export async function writeSession(session: PebbleSession): Promise<string> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  const id = existing ?? crypto.randomUUID();
  const now = Date.now();
  await upsertOnboardingSession({
    id,
    url: session.url,
    bottleneck: session.bottleneck,
    email: session.email ?? null,
    projects: session.projects,
    prioritized: session.prioritized ?? [],
    created_at: session.createdAt ?? now,
    updated_at: now,
  });
  store.set(COOKIE_NAME, id, {
    maxAge: MAX_AGE,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return id;
}

export async function readSession(): Promise<PebbleSession | null> {
  const session = await readSessionWithId();
  if (!session) return null;
  return {
    url: session.url,
    bottleneck: session.bottleneck,
    email: session.email,
    projects: session.projects,
    prioritized: session.prioritized,
    createdAt: session.createdAt,
    slotStartAt: session.slotStartAt,
    slotTimezone: session.slotTimezone,
    bookingStatus: session.bookingStatus,
  };
}

export async function readSessionWithId(): Promise<PebbleSessionWithId | null> {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;
  if (!id) return null;
  const row = await getOnboardingSession(id);
  if (!row) return null;
  return {
    id,
    url: row.url,
    bottleneck: row.bottleneck,
    email: row.email,
    projects: row.projects,
    prioritized: row.prioritized,
    createdAt: row.created_at,
    slotStartAt: row.slot_start_at,
    slotTimezone: row.slot_timezone,
    bookingStatus: row.booking_status,
  };
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
