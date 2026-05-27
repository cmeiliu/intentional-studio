import { bigint, index, jsonb, pgSchema, text } from "drizzle-orm/pg-core";
import type { PebbleProject } from "../anthropic";

export const onboardingSchema = pgSchema("onboarding");

export const sessions = onboardingSchema.table(
  "sessions",
  {
    id: text("id").primaryKey(),
    url: text("url").notNull(),
    bottleneck: text("bottleneck").notNull(),
    // PEBB-179: visitor's email captured at /start. Nullable so pre-PEBB-179
    // rows (created when the funnel was anonymous) stay valid; new rows always
    // populate it. Indexed for the future pebbled-internal CRM sync that will
    // key on email.
    email: text("email"),
    projects: jsonb("projects").$type<PebbleProject[]>().notNull(),
    prioritized: jsonb("prioritized")
      .$type<number[]>()
      .notNull()
      .default([]),
    created_at: bigint("created_at", { mode: "number" }).notNull(),
    updated_at: bigint("updated_at", { mode: "number" }).notNull(),
    // Cal.com booking columns (PEBB-40/41/42/43). All nullable so existing
    // rows aren't touched. One onboarding session = at most one booking, so
    // we hang every booking field off this row instead of a separate table.
    slot_start_at: bigint("slot_start_at", { mode: "number" }),
    slot_timezone: text("slot_timezone"),
    cal_event_uuid: text("cal_event_uuid"),
    // 'tentative' | 'confirmed' | 'expired' | 'canceled' | 'attended' | 'no_show'
    booking_status: text("booking_status"),
    hold_expires_at: bigint("hold_expires_at", { mode: "number" }),
    // PEBB-211: legacy in-house Stripe deposit columns
    // (payment_intent_id, refund_id, attendance_set_at) removed from the
    // Drizzle schema here; physical columns drop in PR 2. Cal.com Payments
    // now owns the deposit flow end-to-end.
  },
  (table) => [index("idx_onboarding_sessions_email").on(table.email)],
);

export type OnboardingSessionRow = typeof sessions.$inferSelect;
export type BookingStatus =
  | "tentative"
  | "confirmed"
  | "expired"
  | "canceled"
  | "attended"
  | "no_show";

export type PresurveySessionSnapshot = Pick<
  OnboardingSessionRow,
  | "url"
  | "bottleneck"
  | "projects"
  | "prioritized"
  | "slot_start_at"
  | "slot_timezone"
  | "booking_status"
>;

export const presurveySubmissions = onboardingSchema.table(
  "presurvey_submissions",
  {
    id: text("id").primaryKey(),
    session_id: text("session_id")
      .notNull()
      .references(() => sessions.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email").notNull(),
    team_shape: text("team_shape"),
    current_workflow: text("current_workflow"),
    tools: text("tools"),
    success: text("success"),
    constraints: text("constraints"),
    session_snapshot: jsonb("session_snapshot")
      .$type<PresurveySessionSnapshot>()
      .notNull(),
    notification_id: text("notification_id"),
    notification_error: text("notification_error"),
    notified_at: bigint("notified_at", { mode: "number" }),
    created_at: bigint("created_at", { mode: "number" }).notNull(),
    updated_at: bigint("updated_at", { mode: "number" }).notNull(),
  },
  (table) => [
    index("presurvey_submissions_session_id_idx").on(table.session_id),
    index("presurvey_submissions_email_idx").on(table.email),
  ],
);

export type PresurveySubmissionRow =
  typeof presurveySubmissions.$inferSelect;
