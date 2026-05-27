"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import type { PebbleProject } from "@/lib/anthropic";
import { addCustomProject, setPriorities } from "./actions";

const CATEGORY_LABEL: Record<PebbleProject["category"], string> = {
  app: "App",
  agent: "Agent",
  automation: "Automation",
};

const EFFORT_LABEL: Record<PebbleProject["effort"], string> = {
  small: "1–2 weeks",
  medium: "3–4 weeks",
  large: "5–6 weeks",
};

export function ProjectsList({
  projects: initialProjects,
  initialSelected = [],
}: {
  projects: PebbleProject[];
  initialSelected?: number[];
}) {
  const router = useRouter();
  const [projects, setProjects] = useState<PebbleProject[]>(initialProjects);
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(initialSelected),
  );
  const [submitting, setSubmitting] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);

  function toggle(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  async function onContinue() {
    if (selected.size === 0) return;
    setSubmitting(true);
    const ordered = Array.from(selected);
    // Indices double as session-local project IDs.
    await setPriorities(ordered);
    // PEBB-218: fire client-side via posthog-js so the event carries
    // the recording's `$session_id`. Fires AFTER the server action
    // resolves to match the previous server-side semantics: the event
    // means "priorities persisted", not "operator clicked Continue."
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture("project_prioritized", {
        prioritized_count: ordered.length,
        project_count: projects.length,
      });
    }
    router.push("/schedule");
  }

  function handleCustomAdded(project: PebbleProject, index: number) {
    setProjects((prev) => [...prev, project]);
    setSelected((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
    setShowCustomForm(false);
  }

  return (
    <div>
      <div className="space-y-4">
        {projects.map((p, i) => {
          const isSelected = selected.has(i);
          return (
            <button
              key={i}
              type="button"
              onClick={() => toggle(i)}
              className={`w-full text-left bg-cream-2 border rounded-2xl p-6 md:p-8 transition-colors ${
                isSelected
                  ? "border-burgundy-deep ring-1 ring-burgundy-deep"
                  : "border-ink/10 hover:border-ink/25"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs uppercase tracking-wide text-ink-muted">
                      {CATEGORY_LABEL[p.category]}
                    </span>
                    <span className="text-xs text-ink-muted">·</span>
                    <span className="text-xs text-ink-muted">
                      {EFFORT_LABEL[p.effort]}
                    </span>
                  </div>
                  <h3 className="serif text-2xl mb-3">{p.title}</h3>
                  <p className="text-ink-2 leading-relaxed mb-4">
                    {p.what_it_does}
                  </p>
                  <div className="space-y-2 text-sm">
                    {/* PEBB-199: bottleneck_addressed and example_workflow
                        were merged into what_it_does for new pebbles.
                        Render them when present (legacy rows) and skip
                        when absent. */}
                    {p.bottleneck_addressed && (
                      <Row label="Bottleneck">{p.bottleneck_addressed}</Row>
                    )}
                    {p.example_workflow && (
                      <Row label="Example">{p.example_workflow}</Row>
                    )}
                    <Row label="Impact">{p.expected_impact}</Row>
                  </div>
                </div>
                <Checkbox checked={isSelected} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {showCustomForm ? (
          <CustomProjectForm
            onCancel={() => setShowCustomForm(false)}
            onAdded={handleCustomAdded}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowCustomForm(true)}
            className="w-full text-left bg-transparent border border-dashed border-ink/25 rounded-2xl p-6 md:p-8 hover:border-burgundy-deep hover:bg-cream-2/50 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="serif text-xl text-ink mb-1">
                  Have something else in mind?
                </h3>
                <p className="text-ink-2 text-sm">
                  Add your own idea in the same shape and we&rsquo;ll plan it
                  out on the call.
                </p>
              </div>
              <span className="text-burgundy-deep text-sm font-medium shrink-0">
                Add your own →
              </span>
            </div>
          </button>
        )}
      </div>

      <div className="mt-12 sticky bottom-6 z-10">
        <div className="bg-cream rounded-full border border-ink/10 shadow-lg shadow-ink/5 px-6 py-3 flex items-center justify-between gap-4">
          <span className="text-sm text-ink-2">
            {selected.size === 0
              ? "Pick the one that hurts most to keep doing manually"
              : `${selected.size} selected — ready when you are`}
          </span>
          <button
            type="button"
            onClick={onContinue}
            disabled={selected.size === 0 || submitting}
            className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-burgundy-deep text-cream-0 hover:bg-burgundy-darkest disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            {submitting ? "Saving…" : "Book the 30-min call →"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="text-ink-muted shrink-0 w-20">{label}</span>
      <span className="text-ink-2">{children}</span>
    </div>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`shrink-0 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked
          ? "bg-burgundy-deep border-burgundy-deep"
          : "border-ink/25 bg-transparent"
      }`}
    >
      {checked && (
        <svg
          className="h-3 w-3 text-cream-0"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="2 6 5 9 10 3" />
        </svg>
      )}
    </div>
  );
}

function CustomProjectForm({
  onCancel,
  onAdded,
}: {
  onCancel: () => void;
  onAdded: (project: PebbleProject, index: number) => void;
}) {
  const [title, setTitle] = useState("");
  const [whatItDoes, setWhatItDoes] = useState("");
  const [impact, setImpact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await addCustomProject({
      title,
      what_it_does: whatItDoes,
      expected_impact: impact,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    // PEBB-199: pebble shape collapsed to 5 fields; the optional legacy
    // fields are intentionally omitted from new submissions.
    onAdded(
      {
        title: title.trim(),
        category: "app",
        effort: "medium",
        what_it_does: whatItDoes.trim(),
        expected_impact: impact.trim(),
      },
      res.index,
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-cream-2 border border-burgundy-deep/40 rounded-2xl p-6 md:p-8 space-y-4"
    >
      <div>
        <h3 className="serif text-2xl text-ink mb-1">Your own idea</h3>
        <p className="text-ink-2 text-sm">
          Same fields as the suggestions above. Be specific &mdash; the more
          concrete, the better we can plan it.
        </p>
      </div>

      <Field
        label="Title"
        hint="Short and punchy. What would you call it?"
      >
        <input
          type="text"
          required
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Quote builder for catering inquiries"
          className="w-full bg-cream border border-ink/15 rounded-lg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy-deep"
        />
      </Field>

      <Field
        label="What it is"
        hint="3–4 sentences. What does it do, which part of your bottleneck does it solve, and a concrete moment it would help?"
      >
        <textarea
          required
          rows={5}
          value={whatItDoes}
          onChange={(e) => setWhatItDoes(e.target.value)}
          placeholder="A small app where the operator pastes an inquiry and gets back a priced quote draft tailored to the menu. Targets the quotes-take-20-minutes bottleneck — on a Friday lunch inquiry for 40, the draft is ready in 60 seconds and goes out before the inquirer calls a competitor."
          className="w-full bg-cream border border-ink/15 rounded-lg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy-deep resize-none"
        />
      </Field>

      <Field
        label="Time it would save"
        hint="Hours per week, or another concrete outcome."
      >
        <input
          type="text"
          required
          maxLength={200}
          value={impact}
          onChange={(e) => setImpact(e.target.value)}
          placeholder="6–8 hours a week and ~3 saved inquiries we’d otherwise lose"
          className="w-full bg-cream border border-ink/15 rounded-lg px-4 py-2.5 text-ink placeholder:text-ink-muted focus:outline-none focus:border-burgundy-deep"
        />
      </Field>

      {error && (
        <p className="text-sm text-burgundy-deep" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-ink-2 hover:text-ink px-3 py-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-burgundy-deep text-cream-0 hover:bg-burgundy-darkest disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          {submitting ? "Adding…" : "Add to my list"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: React.ReactNode;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-ink-muted block mb-1">
        {label}
      </span>
      {hint && <span className="text-xs text-ink-2 block mb-2">{hint}</span>}
      {children}
    </label>
  );
}
