# AI Workflow Automation for Non-Technical Entrepreneurs — Course Blueprint

> The full class design. Each lesson is produced as a self-contained, printable HTML
> file in `./lessons/`. This document is the map; the lessons are the territory.

## Right-sizing (the recommendation)

For busy, non-technical founders whose goal is to **automate a real workflow**, a
short crash-course is too shallow to ship a working automation, and a long multi-week
course loses this audience. The sweet spot:

**4 weeks · ~3–4 hrs/week · hybrid.**
- 3 short self-paced lessons per week (10–15 min each) = 12 lessons total.
- 1 live office-hours / build session per week (4 total) — Q&A + hands-on build.
- A single running example: **each learner's own real workflow**, carried week to week.
- One **capstone**: an automation running in the learner's actual business by Week 4.

This is the "Goldilocks" scope. It can compress to a 1-day intensive (Modules 1–4 as
four 90-min blocks) or stretch to 8 weeks (split each module in two, add assignments).

---

## The arc

Learners move along a deliberate ramp: **understand AI → direct it reliably →
connect it to their tools → let it run on its own.**

| Week | Module | Outcome by end of week |
|------|--------|------------------------|
| 1 | Foundations & Fluency | Can say where AI does/doesn't belong in their business |
| 2 | Prompting for Real Work | Has a reusable prompt that does one recurring task well |
| 3 | No-Code Automation | Built a live trigger→AI-action automation |
| 4 | Agents & Capstone | Shipped one end-to-end automation in their business |

---

## Module 1 — Foundations & Fluency *(Week 1)*
**Goal:** Replace hype/fear with an accurate mental model, and spot automatable work.

- **Lesson 0001 — What AI Can Actually Do For Your Business** *(built — see `./lessons/`)*
  Mental model of an LLM as a "confident, fast, forgetful intern." What it's great at,
  where it fails (hallucination, no memory, no live data). The "automatable task" test.
- **Lesson 0002 — The Hidden Busywork Audit**
  Hands-on: learner lists their weekly recurring tasks and scores each on *frequency ×
  tedium × rule-based-ness* to find the best automation candidate. Output: their target workflow.
- **Lesson 0003 — Tools of the Trade (and what they cost)**
  Tour of the consumer AI tools + the no-code automation landscape (Zapier vs Make vs
  AI-native). Free vs paid tiers. Picks the stack for the rest of the course.
- **Live Session 1:** Each learner pitches their target workflow; instructor pressure-tests feasibility.

## Module 2 — Prompting for Real Work *(Week 2)*
**Goal:** Move from lucky one-off results to a **reliable, reusable prompt**.

- **Lesson 0004 — Anatomy of a Reliable Prompt**
  Role + context + task + examples + output format. Quiz with same-length answers.
- **Lesson 0005 — Your Prompt Library**
  Turn a recurring task into a saved, parameterized prompt template. Build one for their workflow.
- **Lesson 0006 — Make It Trustworthy**
  Reducing hallucination: give it the source material, ask for citations, verify. Knowing when *not* to trust output.
- **Live Session 2:** Live prompt clinic — learners run their template, get feedback, iterate.

## Module 3 — No-Code Automation *(Week 3)*
**Goal:** Connect AI to the tools they already use, with no code.

- **Lesson 0007 — Triggers & Actions (the grammar of automation)**
  The "when X happens, do Y" model. Walk a pre-built template end to end.
- **Lesson 0008 — Build Your First Automation**
  Guided build: a real trigger (new email / form / row) → an AI action → an output. Hands-on, screenshots.
- **Lesson 0009 — Multi-Step & Safe Failure**
  Adding steps, branching, and — crucially — testing, error handling, and a human-in-the-loop checkpoint.
- **Live Session 3:** Co-working build session — everyone gets their automation running live.

## Module 4 — Agents & Capstone *(Week 4)*
**Goal:** Ship one end-to-end automation; understand when to reach for an "agent."

- **Lesson 0010 — From Automation to Agent**
  Plain-language: when a fixed workflow isn't enough and you want AI to decide steps. Promise and risk.
- **Lesson 0011 — Putting It Together (Capstone Guide)**
  Checklist to assemble Modules 1–3 into one shipped workflow. Definition of "done."
- **Lesson 0012 — Keeping It Running & What's Next**
  Monitoring, cost, when it breaks, and a roadmap for automating the next three workflows. Where to keep learning (communities).
- **Live Session 4:** Capstone demos — each learner shows their live automation. Celebrate + next steps.

---

## Reference documents (in `./reference/`)
- **Glossary** *(built — `glossary.html`)* — canonical plain-English definitions (prompt, token, hallucination, trigger, action, agent…). Adhered to in every lesson.
- *(planned)* **Prompt template cheat-sheet** — the reusable prompt skeleton, printable.
- *(planned)* **Automation pattern cards** — the 5–6 most common small-business automation patterns.

## How lessons get built
Lessons are produced **just-in-time, one at a time**, in the learner's zone of proximal
development — not all 12 up front. Lesson 0001 and the glossary are built as the
reference standard for tone, depth, and visual design. Say the word and I'll generate
the next lesson(s).
