# AI for Non-Technical Entrepreneurs: Automate & Build — Course Blueprint

> The full class design. Each lesson is produced as a self-contained, printable HTML
> file in `./lessons/`. This document is the map; the lessons are the territory.

## Right-sizing (the recommendation)

The mission now spans two outcomes — **automate** a workflow *and* **build** your own
tool/app — at a "just enough to not get stuck" code depth, for a broad ("a bit of
everything") target. That's more than 4 weeks can carry without going shallow, and more
than this busy audience will give to an 8-week program. The sweet spot:

**6 weeks · ~3–4 hrs/week · hybrid.**
- 3 short self-paced lessons per week (10–15 min each) = ~18 lessons total.
- 1 live build/Q&A session per week (6 total).
- A running example carried week to week: the learner's **own** workflow, then their **own** build idea.
- One **capstone** (learner's choice): a live automation *or* a deployed small app, running for real by Week 6.

Two halves: **Weeks 1–3 Automate** (AI does work for you) → **Weeks 4–6 Build** (you make your own tools).

---

## The arc

**Understand AI → direct it → connect it (automate) → build with it → understand it
enough to fix it → ship & maintain.**

| Week | Module | Outcome by end of week |
|------|--------|------------------------|
| 1 | Foundations & Fluency | Can say where AI belongs; has a target workflow + a build idea |
| 2 | Prompting for Real Work | Has a reusable prompt that does one recurring task well |
| 3 | No-Code Automation | Built a live trigger→AI-action automation |
| 4 | Build by Talking (Vibe Coding) | Built & deployed a small app with a public URL |
| 5 | Escape the Final 20% | Can read generated code, debug an error, use Git & deploy |
| 6 | Ship Your Own Thing | Shipped one capstone (automation or app) running for real |

---

## PART 1 — AUTOMATE

### Module 1 — Foundations & Fluency *(Week 1)*
**Goal:** Accurate mental model of AI; spot what to automate *and* what to build.

- **Lesson 0001 — What AI Can Actually Do For Your Business** *(built)*
  LLM as a "confident, fast, forgetful intern." Strengths/weaknesses. The Automatable Task Test.
- **Lesson 0002 — The Hidden Busywork Audit (+ Build Wishlist)**
  Hands-on: score recurring tasks to find the best *automation* candidate, and capture a "things I wish existed" *build* idea. Output: one workflow + one app idea to carry through the course.
- **Lesson 0003 — Tools of the Trade (and what they cost)**
  Two stacks: no-code automation (Zapier/Make) **and** vibe-coding builders (Lovable/Bolt/v0/Replit). Free vs paid, and how AI *credits* meter. Picks the stack.
- **Live Session 1:** Learners pitch their workflow + build idea; instructor pressure-tests feasibility.

### Module 2 — Prompting for Real Work *(Week 2)*
**Goal:** Move from lucky one-offs to a reliable, reusable prompt — the core skill underneath *both* automating and building.

- **Lesson 0004 — Anatomy of a Reliable Prompt** — role + context + task + examples + output format. Same-length-answer quiz.
- **Lesson 0005 — Your Prompt Library** — turn a recurring task into a saved, parameterized template.
- **Lesson 0006 — Make It Trustworthy** — reducing hallucination; give it the source, ask for citations, verify; when *not* to trust output.
- **Live Session 2:** Prompt clinic — run templates, get feedback, iterate.

### Module 3 — No-Code Automation *(Week 3)*
**Goal:** Connect AI to the tools they already use, no code.

- **Lesson 0007 — Triggers & Actions (the grammar of automation)** — "when X, do Y"; walk a template end to end.
- **Lesson 0008 — Build Your First Automation** — guided: real trigger → AI action → output. Screenshots, hands-on.
- **Lesson 0009 — Multi-Step & Safe Failure** — branching, testing, error handling, human-in-the-loop checkpoint.
- **Live Session 3:** Co-working build — everyone's automation goes live.

---

## PART 2 — BUILD

### Module 4 — Build by Talking: Vibe Coding *(Week 4)*
**Goal:** Make a real, deployed thing by describing it — without writing code yet.

- **Lesson 0010 — The Vibe-Coding Mindset** — describe → generate → look → iterate. Why a clear spec beats a clever prompt. Tool: Lovable/Bolt. Warns against the "blank chat box" trap — build *results & buttons*, not a chat box.
- **Lesson 0011 — Write the Build Brief** — turn their Week-1 idea into a tight one-page spec (who it's for, the one job, inputs, outputs, what "done" means). The single biggest lever on output quality.
- **Lesson 0012 — Build & Ship a One-Page Tool** — hands-on: generate, preview, iterate, and **deploy to a public URL**. First tangible "I made software" win.
- **Live Session 4:** Vibe-build co-working — each learner gets a v1 live on the web.

### Module 5 — Escape the Final 20% *(Week 5)*
**Goal:** Just enough *true code* to get unstuck — the antidote to "comprehension debt." This module is the heart of the new mission.

- **Lesson 0013 — Reading Code Without Fear** *(flagship — built as the design standard for Part 2)*
  What files/HTML/CSS/JS actually are; how to *read* what the AI generated and find the part you want to change — without writing from scratch.
- **Lesson 0014 — Debugging With AI (Without Burning Credits)** — the error-message → paste → isolate → fix loop; how to escape endless debug spirals; describing a bug precisely; when to revert vs. push on.
- **Lesson 0015 — Git & Deploy Without Tears** — version control as "save points + undo history," connecting GitHub, deploying updates; plus a gentle, non-scary pass on the common safety pitfalls of generated apps (exposed keys, open data).
- **Live Session 5:** Debug clinic — bring a broken build, leave with it fixed (and understood).

### Module 6 — Ship Your Own Thing *(Week 6)*
**Goal:** Ship one real capstone; know your limits.

- **Lesson 0016 — Choose Your Capstone** — an automation *or* a small app; pick what serves their business now. Scoping to "one narrow job, low risk if wrong."
- **Lesson 0017 — Build Sprint** — assembly checklist; definition of done; human-in-the-loop wherever it touches customers.
- **Lesson 0018 — Keep It Alive & Know Your Limits** — cost, monitoring, what to do when it breaks, and the empowering skill of knowing when to hand off to a real developer. Roadmap for the next three things to build/automate + communities.
- **Live Session 6:** Capstone demos — each learner shows their live thing. Celebrate + next steps.

---

## Reference documents (in `./reference/`)
- **Glossary** *(built — `glossary.html`)* — canonical plain-English definitions across both halves (prompt, hallucination, trigger, action, agent, vibe coding, deploy, Git, repository, debugging, comprehension debt…).
- *(planned)* **Prompt template cheat-sheet** — the reusable prompt skeleton, printable.
- *(planned)* **Build brief template** — the one-page spec from Lesson 0011.
- *(planned)* **Automation pattern cards** — the most common small-business automation patterns.

## How lessons get built
Lessons are produced **just-in-time, one at a time**, in the learner's zone of proximal
development — not all 18 up front. **Lesson 0001** (Part 1 standard) and **Lesson 0013**
(Part 2 standard) are built as the references for tone, depth, and visual design, plus the
canonical glossary. Say the word and I'll generate the next lesson(s).
