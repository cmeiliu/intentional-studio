import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { SiteSnapshot } from "./scrape";

/**
 * PEBB-199: per-pebble shape after the schema trim.
 *
 * Dropped from new generations:
 * - `bottleneck_addressed` — was paraphrasing the operator's input back at
 *   them, low signal.
 * - `example_workflow` — content merged into `what_it_does` (one combined
 *   narrative).
 *
 * Both stay OPTIONAL in the Zod schema for read-back compat: existing
 * `onboarding.sessions` rows persisted before this PR still have them, and
 * the read path (ProjectsList, presurvey-notification) tolerates either
 * shape during the rollout window. New generations don't emit them.
 */
export const PebbleProjectSchema = z.object({
  title: z.string(),
  category: z.enum(["app", "agent", "automation"]),
  what_it_does: z.string(),
  effort: z.enum(["small", "medium", "large"]),
  expected_impact: z.string(),
  // Legacy fields — present on rows minted before PEBB-199. Optional so the
  // schema parses both shapes; UI renders them when present.
  bottleneck_addressed: z.string().optional(),
  example_workflow: z.string().optional(),
});

/**
 * PEBB-199: cap at exactly 3 pebbles (was 3-5). Halves the worst-case
 * output-token budget, which is the dominant latency cost on Haiku.
 */
export const PebbleProjectsSchema = z.object({
  projects: z.array(PebbleProjectSchema).length(3),
});

export type PebbleProject = z.infer<typeof PebbleProjectSchema>;

const DEFAULT_INTAKE_MODEL = "claude-haiku-4-5-20251001";
const SITE_EXCERPT_CHARS = 4_000;

const PEBBLE_PROJECTS_TOOL: Anthropic.Tool = {
  name: "return_pebble_projects",
  description:
    "Return the concrete Intentional Studio project suggestions for the business.",
  strict: true,
  input_schema: {
    type: "object",
    properties: {
      projects: {
        // PEBB-202: Anthropic's tool-input validator rejects minItems/maxItems
        // values other than 0 or 1. We still enforce "exactly 3" via the
        // prompt text and via Zod's `PebbleProjectsSchema.length(3)` parse on
        // the returned tool input — so this schema only describes the shape,
        // not the cardinality.
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            category: {
              type: "string",
              enum: ["app", "agent", "automation"],
            },
            what_it_does: { type: "string" },
            effort: { type: "string", enum: ["small", "medium", "large"] },
            expected_impact: { type: "string" },
          },
          required: [
            "title",
            "category",
            "what_it_does",
            "effort",
            "expected_impact",
          ],
        },
      },
    },
    required: ["projects"],
    additionalProperties: false,
  },
};

const SYSTEM = `You are the strategy lead at Intentional Studio, Mei Liu's practice for AI training, custom software, and useful automation. Your job: given a business's website context and the bottleneck they named, propose exactly 3 concrete "pebbles" — small, shippable apps or agents that would meaningfully reduce that bottleneck.

Voice: direct, operator-to-operator, calm, slightly editorial. No corporate jargon. No emoji. No hype. Speak like someone who has actually run a small business.

Each pebble should be:
- Specific to THIS business's domain (not generic SaaS suggestions)
- Tied to a real workflow that exists today
- Buildable in 1-6 weeks
- Either an app (UI for a human), agent (autonomous), or automation (silent pipeline)

Avoid: generic CRM/email-blast/social-media-scheduler suggestions. Avoid suggesting tools that already exist off-the-shelf (e.g. "use HubSpot"). Pebbles are custom-built by Intentional Studio.`;

export async function generatePebbles(input: {
  site: SiteSnapshot;
  bottleneck: string;
}): Promise<PebbleProject[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `Business website: ${input.site.url}
Site title: ${input.site.title || "(none)"}
Site description: ${input.site.description || "(none)"}

Site content (excerpt):
${input.site.bodyText.slice(0, SITE_EXCERPT_CHARS) || "(could not scrape)"}

---
The operator says their biggest bottleneck right now is:

"${input.bottleneck}"

---
Propose exactly 3 pebbles. Use the return_pebble_projects tool with this exact shape:

{
  "projects": [
    {
      "title": "Short punchy name (max 6 words)",
      "category": "app" | "agent" | "automation",
      "what_it_does": "Plain-English description that names a concrete moment it would help. 3-4 sentences. Mention which slice of their bottleneck this attacks, what it does end-to-end, and a real workflow it would unlock.",
      "effort": "small" | "medium" | "large",
      "expected_impact": "Hours saved per week or another concrete outcome (1 sentence)"
    }
  ]
}`;

  const response = await client.messages.create({
    // `||` (not `??`) so an env var that's defined-but-empty
    // (`ANTHROPIC_INTAKE_MODEL=`) falls back to the default instead of
    // sending `model: ""`, which the API rejects with a 400.
    model: process.env.ANTHROPIC_INTAKE_MODEL || DEFAULT_INTAKE_MODEL,
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [PEBBLE_PROJECTS_TOOL],
    tool_choice: {
      type: "tool",
      name: PEBBLE_PROJECTS_TOOL.name,
      disable_parallel_tool_use: true,
    },
    messages: [{ role: "user", content: userMessage }],
  });

  return parsePebbleProjectsContent(response.content);
}

/**
 * PEBB-199: streaming variant of generatePebbles.
 *
 * Invokes `onPebble` once per fully-assembled pebble as they stream in,
 * then returns the final array. A pebble is "fully assembled" when the
 * NEXT pebble has started — that's our cue that no more fields will be
 * added to the prior one (the last pebble in the array gets emitted from
 * the final-message snapshot at end-of-stream).
 *
 * The SDK's `inputJson` event hands us a `jsonSnapshot` of the parsed-
 * so-far tool input on every delta — much cleaner than hand-rolling a
 * brace-depth parser. We watch `snapshot.projects.length` and emit the
 * pebble at index `i` as soon as element `i+1` appears.
 *
 * On stream error, any pebbles already emitted via onPebble stay surfaced
 * to the client; the caller decides whether to treat the partial as a
 * regenerate-prompt or a hard failure.
 */
export async function streamPebbles(
  input: {
    site: SiteSnapshot;
    bottleneck: string;
  },
  onPebble: (pebble: PebbleProject) => void | Promise<void>,
): Promise<PebbleProject[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }

  const client = new Anthropic({ apiKey });

  const userMessage = `Business website: ${input.site.url}
Site title: ${input.site.title || "(none)"}
Site description: ${input.site.description || "(none)"}

Site content (excerpt):
${input.site.bodyText.slice(0, SITE_EXCERPT_CHARS) || "(could not scrape)"}

---
The operator says their biggest bottleneck right now is:

"${input.bottleneck}"

---
Propose exactly 3 pebbles. Use the return_pebble_projects tool with this exact shape:

{
  "projects": [
    {
      "title": "Short punchy name (max 6 words)",
      "category": "app" | "agent" | "automation",
      "what_it_does": "Plain-English description that names a concrete moment it would help. 3-4 sentences. Mention which slice of their bottleneck this attacks, what it does end-to-end, and a real workflow it would unlock.",
      "effort": "small" | "medium" | "large",
      "expected_impact": "Hours saved per week or another concrete outcome (1 sentence)"
    }
  ]
}`;

  const stream = client.messages.stream({
    // `||` (not `??`) so an env var that's defined-but-empty
    // (`ANTHROPIC_INTAKE_MODEL=`) falls back to the default instead of
    // sending `model: ""`, which the API rejects with a 400.
    model: process.env.ANTHROPIC_INTAKE_MODEL || DEFAULT_INTAKE_MODEL,
    max_tokens: 2048,
    system: [
      {
        type: "text",
        text: SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    tools: [PEBBLE_PROJECTS_TOOL],
    tool_choice: {
      type: "tool",
      name: PEBBLE_PROJECTS_TOOL.name,
      disable_parallel_tool_use: true,
    },
    messages: [{ role: "user", content: userMessage }],
  });

  // Track the highest index we've already emitted. Pebbles emit only when
  // the NEXT one has started, so the last one is handled separately at
  // end-of-stream from finalMessage().
  let lastEmittedIdx = -1;
  const emissionQueue: Promise<unknown>[] = [];

  stream.on("inputJson", (_partial, snapshot) => {
    const projects =
      snapshot &&
      typeof snapshot === "object" &&
      "projects" in snapshot &&
      Array.isArray((snapshot as { projects: unknown }).projects)
        ? ((snapshot as { projects: unknown[] }).projects)
        : null;
    if (!projects) return;
    // Emit through projects.length - 2 (everything except the in-progress
    // current pebble at the tail).
    const completedThrough = projects.length - 2;
    for (let i = lastEmittedIdx + 1; i <= completedThrough; i++) {
      const parsed = PebbleProjectSchema.safeParse(projects[i]);
      if (parsed.success) {
        lastEmittedIdx = i;
        emissionQueue.push(Promise.resolve(onPebble(parsed.data)));
      }
    }
  });

  // Surface stream errors before we try to read finalMessage().
  const finalMessage = await stream.finalMessage();
  const finalProjects = parsePebbleProjectsContent(finalMessage.content);

  // Drain any in-flight onPebble callbacks before emitting the tail.
  await Promise.allSettled(emissionQueue);

  // Emit the tail (typically just the last pebble — but if streaming was
  // partial and the inputJson handler never fired enough times, this also
  // emits any earlier pebbles that weren't sent yet).
  for (let i = lastEmittedIdx + 1; i < finalProjects.length; i++) {
    lastEmittedIdx = i;
    await onPebble(finalProjects[i]);
  }

  return finalProjects;
}

export function parsePebbleProjectsContent(
  content: Array<{ type: string; name?: string; input?: unknown }>,
): PebbleProject[] {
  const block = content.find(
    (b) => b.type === "tool_use" && b.name === PEBBLE_PROJECTS_TOOL.name,
  );
  if (!block) {
    throw new Error("Model did not return structured pebble projects");
  }

  const parsed = PebbleProjectsSchema.parse(block.input);
  return parsed.projects;
}
