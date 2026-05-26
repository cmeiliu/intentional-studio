import {
  bigint,
  index,
  integer,
  jsonb,
  pgSchema,
  text,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { sessions as onboardingSessions } from "../onboarding/schema";

export const meetingsSchema = pgSchema("meetings");

export type MeetingType =
  | "onboarding"
  | "pipeline_followup"
  | "existing_customer"
  | "other";

export type MeetingStatus =
  | "scheduled"
  | "capturing"
  | "completed"
  | "failed"
  | "cancelled";

export type Attendee = {
  name: string | null;
  email: string;
};

export const meetings = meetingsSchema.table(
  "meetings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    cal_event_uuid: text("cal_event_uuid").unique(),
    meeting_type: text("meeting_type").$type<MeetingType>().notNull(),
    onboarding_session_id: text("onboarding_session_id").references(
      () => onboardingSessions.id,
    ),
    related_meeting_id: uuid("related_meeting_id"),
    scheduled_at: bigint("scheduled_at", { mode: "number" }).notNull(),
    meeting_url: text("meeting_url"),
    attendees: jsonb("attendees").$type<Attendee[]>().notNull().default([]),
    client_name: text("client_name"),
    client_contact_email: text("client_contact_email"),
    status: text("status").$type<MeetingStatus>().notNull(),
    recall_bot_id: text("recall_bot_id"),
    recording_url: text("recording_url"),
    transcript_url: text("transcript_url"),
    raw_transcript: jsonb("raw_transcript"),
    transcript_indexed_at: bigint("transcript_indexed_at", { mode: "number" }),
    transcript_index_chunk_count: integer("transcript_index_chunk_count"),
    transcript_index_embedding_tokens: bigint("transcript_index_embedding_tokens", {
      mode: "number",
    }),
    transcript_index_embedding_cost_micros: bigint(
      "transcript_index_embedding_cost_micros",
      { mode: "number" },
    ),
    transcript_index_error: text("transcript_index_error"),
    error_context: text("error_context"),
    created_at: bigint("created_at", { mode: "number" }).notNull(),
    completed_at: bigint("completed_at", { mode: "number" }),
    cancelled_at: bigint("cancelled_at", { mode: "number" }),
  },
  (table) => [
    index("meetings_meeting_type_idx").on(table.meeting_type),
    index("meetings_scheduled_at_idx").on(table.scheduled_at),
    index("meetings_onboarding_session_id_idx").on(table.onboarding_session_id),
    index("meetings_client_contact_email_idx").on(table.client_contact_email),
    index("meetings_related_meeting_id_idx").on(table.related_meeting_id),
    index("meetings_status_idx").on(table.status),
  ],
);

export type MeetingRow = typeof meetings.$inferSelect;
export type NewMeetingRow = typeof meetings.$inferInsert;

export const meetingTranscriptChunks = meetingsSchema.table(
  "meeting_transcript_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meeting_id: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    chunk_idx: integer("chunk_idx").notNull(),
    speaker: text("speaker"),
    start_ts: bigint("start_ts", { mode: "number" }),
    end_ts: bigint("end_ts", { mode: "number" }),
    text: text("text").notNull(),
    embedding: text("embedding"),
    created_at: bigint("created_at", { mode: "number" }).notNull(),
  },
  (table) => [
    uniqueIndex("meeting_transcript_chunks_meeting_idx_unique").on(
      table.meeting_id,
      table.chunk_idx,
    ),
    index("meeting_transcript_chunks_meeting_idx").on(table.meeting_id),
    index("meeting_transcript_chunks_start_ts_idx").on(
      table.meeting_id,
      table.start_ts,
    ),
  ],
);

export type MeetingTranscriptChunkRow =
  typeof meetingTranscriptChunks.$inferSelect;

export type FollowUpStatus = "draft" | "approved" | "discarded";

export type RecommendedNextAction =
  | "none"
  | "sow"
  | "poc"
  | "schedule_followup"
  | "handoff";

export type FollowUpActionItem = {
  owner: "mei" | "client" | "both";
  text: string;
};

export const followUpRecords = meetingsSchema.table(
  "follow_up_records",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    meeting_id: uuid("meeting_id")
      .notNull()
      .references(() => meetings.id, { onDelete: "cascade" }),
    version: bigint("version", { mode: "number" }).notNull().default(1),
    summary: text("summary").notNull(),
    action_items: jsonb("action_items")
      .$type<FollowUpActionItem[]>()
      .notNull()
      .default([]),
    open_questions: jsonb("open_questions")
      .$type<string[]>()
      .notNull()
      .default([]),
    recommended_next_action: text("recommended_next_action")
      .$type<RecommendedNextAction>()
      .notNull(),
    recommendation_reasoning: text("recommendation_reasoning"),
    status: text("status").$type<FollowUpStatus>().notNull(),
    generated_at: bigint("generated_at", { mode: "number" }).notNull(),
    reviewed_at: bigint("reviewed_at", { mode: "number" }),
    reviewed_by: text("reviewed_by"),
    source_project_id: uuid("source_project_id"),
  },
  (table) => [
    index("follow_up_records_meeting_id_version_idx").on(
      table.meeting_id,
      table.version,
    ),
  ],
);

export type FollowUpRecordRow = typeof followUpRecords.$inferSelect;
export type NewFollowUpRecordRow = typeof followUpRecords.$inferInsert;
