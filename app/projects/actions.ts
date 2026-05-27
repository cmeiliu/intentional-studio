"use server";

import { PebbleProjectSchema, type PebbleProject } from "@/lib/anthropic";
import { readSessionWithId, writeSession } from "@/lib/session";

/**
 * PEBB-218: `project_prioritized` analytics moved to the client (see
 * ProjectsList.tsx's onContinue). Server actions can't carry the
 * `$session_id` PostHog needs to link recordings, and the client
 * already knows both prioritized.length and session.projects.length —
 * the move is free.
 */
export async function setPriorities(prioritized: number[]): Promise<void> {
  const session = await readSessionWithId();
  if (!session) return;
  await writeSession({ ...session, prioritized });
}

/**
 * PEBB-199: shape matches the trimmed pebble schema — bottleneck_addressed
 * and example_workflow are dropped from new submissions. The custom-form
 * UI lost those inputs in the same patch.
 */
export type CustomProjectInput = {
  title: string;
  what_it_does: string;
  expected_impact: string;
};

export async function addCustomProject(
  input: CustomProjectInput,
): Promise<{ ok: true; index: number } | { ok: false; error: string }> {
  const session = await readSessionWithId();
  if (!session) return { ok: false, error: "Session expired. Start over." };

  // Mid-range defaults; the operator and the discovery call refine these.
  const candidate: PebbleProject = {
    title: input.title.trim(),
    category: "app",
    effort: "medium",
    what_it_does: input.what_it_does.trim(),
    expected_impact: input.expected_impact.trim(),
  };

  const parsed = PebbleProjectSchema.safeParse(candidate);
  if (!parsed.success) {
    return { ok: false, error: "Please fill out every field." };
  }

  // Reject if any required field collapsed to empty after trim.
  for (const v of Object.values(parsed.data)) {
    if (typeof v === "string" && v.length === 0) {
      return { ok: false, error: "Please fill out every field." };
    }
  }

  const nextProjects = [...session.projects, parsed.data];
  await writeSession({ ...session, projects: nextProjects });
  return { ok: true, index: nextProjects.length - 1 };
}
