CREATE SCHEMA IF NOT EXISTS onboarding;
CREATE SCHEMA IF NOT EXISTS meetings;

CREATE TABLE IF NOT EXISTS onboarding.sessions (
  id text PRIMARY KEY,
  url text NOT NULL,
  bottleneck text NOT NULL,
  email text,
  projects jsonb NOT NULL,
  prioritized jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL,
  slot_start_at bigint,
  slot_timezone text,
  cal_event_uuid text,
  booking_status text,
  hold_expires_at bigint
);

CREATE INDEX IF NOT EXISTS idx_onboarding_sessions_email
  ON onboarding.sessions (email);

CREATE TABLE IF NOT EXISTS onboarding.presurvey_submissions (
  id text PRIMARY KEY,
  session_id text NOT NULL REFERENCES onboarding.sessions(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text NOT NULL,
  team_shape text,
  current_workflow text,
  tools text,
  success text,
  constraints text,
  session_snapshot jsonb NOT NULL,
  notification_id text,
  notification_error text,
  notified_at bigint,
  created_at bigint NOT NULL,
  updated_at bigint NOT NULL
);

CREATE INDEX IF NOT EXISTS presurvey_submissions_session_id_idx
  ON onboarding.presurvey_submissions (session_id);
CREATE INDEX IF NOT EXISTS presurvey_submissions_email_idx
  ON onboarding.presurvey_submissions (email);

CREATE TABLE IF NOT EXISTS meetings.meetings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cal_event_uuid text UNIQUE,
  meeting_type text NOT NULL,
  onboarding_session_id text REFERENCES onboarding.sessions(id),
  related_meeting_id uuid,
  scheduled_at bigint NOT NULL,
  meeting_url text,
  attendees jsonb NOT NULL DEFAULT '[]'::jsonb,
  client_name text,
  client_contact_email text,
  status text NOT NULL,
  recall_bot_id text,
  recording_url text,
  transcript_url text,
  raw_transcript jsonb,
  transcript_indexed_at bigint,
  transcript_index_chunk_count integer,
  transcript_index_embedding_tokens bigint,
  transcript_index_embedding_cost_micros bigint,
  transcript_index_error text,
  error_context text,
  created_at bigint NOT NULL,
  completed_at bigint,
  cancelled_at bigint
);

CREATE INDEX IF NOT EXISTS meetings_meeting_type_idx
  ON meetings.meetings (meeting_type);
CREATE INDEX IF NOT EXISTS meetings_scheduled_at_idx
  ON meetings.meetings (scheduled_at);
CREATE INDEX IF NOT EXISTS meetings_onboarding_session_id_idx
  ON meetings.meetings (onboarding_session_id);
CREATE INDEX IF NOT EXISTS meetings_client_contact_email_idx
  ON meetings.meetings (client_contact_email);
CREATE INDEX IF NOT EXISTS meetings_related_meeting_id_idx
  ON meetings.meetings (related_meeting_id);
CREATE INDEX IF NOT EXISTS meetings_status_idx
  ON meetings.meetings (status);

CREATE TABLE IF NOT EXISTS meetings.meeting_transcript_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings.meetings(id) ON DELETE CASCADE,
  chunk_idx integer NOT NULL,
  speaker text,
  start_ts bigint,
  end_ts bigint,
  text text NOT NULL,
  embedding text,
  created_at bigint NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS meeting_transcript_chunks_meeting_idx_unique
  ON meetings.meeting_transcript_chunks (meeting_id, chunk_idx);
CREATE INDEX IF NOT EXISTS meeting_transcript_chunks_meeting_idx
  ON meetings.meeting_transcript_chunks (meeting_id);
CREATE INDEX IF NOT EXISTS meeting_transcript_chunks_start_ts_idx
  ON meetings.meeting_transcript_chunks (meeting_id, start_ts);

CREATE TABLE IF NOT EXISTS meetings.follow_up_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meeting_id uuid NOT NULL REFERENCES meetings.meetings(id) ON DELETE CASCADE,
  version bigint NOT NULL DEFAULT 1,
  summary text NOT NULL,
  action_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  open_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_next_action text NOT NULL,
  recommendation_reasoning text,
  status text NOT NULL,
  generated_at bigint NOT NULL,
  reviewed_at bigint,
  reviewed_by text,
  source_project_id uuid
);

CREATE INDEX IF NOT EXISTS follow_up_records_meeting_id_version_idx
  ON meetings.follow_up_records (meeting_id, version);
