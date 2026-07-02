"use client";

import { Reveal, Stagger, StaggerItem } from "./primitives";

const steps = [
  {
    num: "01",
    title: "Discovery call",
    body: "A short call to understand the team, the problem, and whether AI is even the right move.",
  },
  {
    num: "02",
    title: "Working session",
    body: "We sit with your team and watch how you actually work before anything gets built or taught.",
  },
  {
    num: "03",
    title: "Short cycles",
    body: "2-3 week sprints, each ending with something you can actually use. You see progress, you give notes.",
  },
  {
    num: "04",
    title: "Hand it back",
    body: "Clean code, clear docs, and a team that can carry it forward without us. No lock-in.",
  },
];

export function Process() {
  return (
    <section id="process" className="section section-process">
      <div className="frame">
        <Reveal className="section-head section-head-center">
          <p className="eyebrow eyebrow-cream">
            <span className="eyebrow-line" />
            How we&apos;ll work
          </p>
          <h2 className="section-title section-title-light">
            From first call to <em>handoff</em>.
          </h2>
        </Reveal>

        <Stagger className="steps" staggerChildren={0.1}>
          {steps.map((s) => (
            <StaggerItem key={s.num} className="step">
              <span className="step-num">{s.num}</span>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
