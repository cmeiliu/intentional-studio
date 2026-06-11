# AI for Entrepreneurs — Two-Course Program Blueprint

> One mission, delivered as a **two-course sequence**. Each lesson is produced as a
> self-contained, printable HTML file in `./lessons/`. This document is the map.

## Shape of the program

**Mission:** empower non-technical entrepreneurs to *automate* their work and *build*
their own software with AI — and understand it well enough to ship and maintain it.

Delivered as two stackable courses so the foundational audience isn't scared off and the
ambitious can go pro:

- **Course A — Automate & Build** *(foundational · ~4–5 weeks)* — any entrepreneur. Leaves with an automation and a deployed simple app.
- **Course B — Ship Real Software with AI Agents** *(advanced · ~4–5 weeks)* — Course A grads / aspiring technical founders. Takes a prototype to production-grade and adds the agentic toolkit.

**Mixed cohort:** every module = **core lessons** (everyone does) **+ deep-dive lessons**
(`◆ optional`, for those going pro). Live build/Q&A session each week. Both courses ~3–4
hrs/week core; deep-dives add on top.

**Built so far:** `0001` (Course A / A1) and `0013` (Course A / A4) as the design
standards; canonical glossary. Lesson numbering below is per-course (A#/B#); files will be
foldered as `lessons/course-a/` and `lessons/course-b/` when produced.

---

# COURSE A — Automate & Build *(foundational)*

**Outcome:** can say where AI belongs, write a reliable reusable prompt, ship a no-code
automation, and **build + deploy a simple app by describing it.**

### Module A1 — Foundations & the AI Tool Landscape
- **A1.1 What AI Can Actually Do For Your Business** *(built — `0001`)* — the "forgetful intern" model + Automatable Task Test
- **A1.2 The AI Tool Landscape, Categorically** — a *map, not a list*: chat assistants · no-code automation · AI app builders (vibe) · coding agents/IDEs · agent platforms — and when to reach for which
- **A1.3 Busywork Audit + Build Wishlist** — pick one workflow to automate + one thing to build
- 🔴 **Live A1:** pitch your workflow + build idea

### Module A2 — Prompting for Real Work
- **A2.1 Anatomy of a Reliable Prompt** — role + context + task + examples + output
- **A2.2 Your Prompt Library** — recurring task → reusable template
- **A2.3 Make It Trustworthy** — reduce hallucination, verify, when not to trust it
- 🔴 **Live A2:** prompt clinic

### Module A3 — No-Code Automation
- **A3.1 Triggers & Actions** — the "when X, do Y" grammar
- **A3.2 Build Your First Automation** — real trigger → AI action → output
- **A3.3 Multi-Step & Safe Failure** — branching, testing, human-in-the-loop
- ◆ **A3.4 (deep-dive) Webhooks & Connecting Anything** — when there's no ready-made integration
- 🔴 **Live A3:** co-working build — automations go live

### Module A4 — Build by Talking (Vibe Coding)
- **A4.1 The Vibe-Coding Mindset** — describe → generate → look → iterate; build *results & buttons*, not a chat box
- **A4.2 Anatomy of an App** — frontend / backend / database / hosting / APIs / auth — the map of what you're actually assembling *(sets up Course B)*
- **A4.3 Write the Build Brief** — idea → tight one-page spec
- **A4.4 Build & Ship a One-Page Tool** — generate, preview, **deploy to a public URL**
- **A4.5 Reading Code Without Fear** *(built — `0013`)* — locate, don't write; the 3 file types; the "find the part" method
- ◆ **A4.6 (deep-dive) Debugging With AI Without Burning Credits**
- 🔴 **Live A4:** vibe-build co-working — each learner gets a v1 on the web

### Capstone A
Ship one: a live automation **or** a deployed one-page app.

---

# COURSE B — Ship Real Software with AI Agents *(advanced)*

**Prereq:** Course A or equivalent. **Outcome:** take a prototype to real, production-grade
software (auth, data, payments, hosting) and wield the agentic toolkit (MCP, skills,
subagents) to build faster.

### Module B1 — The Real 20%: Production Software
*The gap between a cute prototype and software people pay for.*
- **B1.1 GitHub & Worktrees** — version control as save-points + branches; working on things in parallel
- **B1.2 Databases** — where your app's data actually lives; reading/changing it safely
- **B1.3 Integrate Data** — pull in & sync external data (imports, exports, connecting to other systems/APIs)
- **B1.4 Hosting & Infra** — getting it online for real; domains, environments
- **B1.5 API Keys & Secrets** — connecting services *without leaking keys*
- **B1.6 Auth** — letting real users log in
- **B1.7 Send Emails** — transactional email & notifications your app sends on its own
- **B1.8 Payments** — taking money (Stripe)
- ◆ **B1.9 (deep-dive) Security Basics** — what actually gets vibe-coded apps hacked
- 🔴 **Live B1 (×2 — this is a 2-week module):** production clinic

### Module B2 — Going Agentic: Agents, MCP & Skills
- **B2.1 Anatomy of an Agent** — model + tools + memory + the loop
- **B2.2 Tools, CLI, MCP & Skills** — the four ways an agent gets superpowers; CLI vs MCP compared; what a skill is *(the thing we installed in lesson 0)*
- **B2.3 Using Subagents** — delegating work to parallel agents
- **B2.4 Reading Session Logs** — seeing what the agent did; debugging *its* behavior
- **B2.5 Open Source** — what it is, finding it, standing on others' work
- ◆ **B2.6 (deep-dive) Build Your Own Skill / MCP Server**
- 🔴 **Live B2:** agent build session

### Module B3 — Capstone
- **B3.1 Choose Your Capstone** — a real app with at least one production concern (auth/data/payments)
- **B3.2 Build Sprint** — assembly checklist; definition of done
- **B3.3 Keep It Alive & Know Your Limits** — cost, monitoring, when to hire a dev; roadmap + communities
- 🔴 **Live B3:** capstone demos

---

## Reference documents (in `./reference/`)
- **Glossary** *(built)* — canonical definitions, spans both courses
- *(planned)* Prompt cheat-sheet · Build-brief template · Anatomy-of-an-app diagram · Anatomy-of-an-agent diagram · Automation pattern cards

## File manifest (canonical — links depend on these exact names)

Lessons live in `./lessons/course-a/` and `./lessons/course-b/`, share `./lessons/lesson.css`,
and link to the previous/next lesson + the glossary. `◆` = optional deep-dive.

**Course A** (`lessons/course-a/`, 17 lessons)
`a01-what-ai-can-do` · `a02-ai-tool-landscape` · `a03-busywork-audit` ·
`a04-anatomy-of-a-prompt` · `a05-prompt-library` · `a06-make-it-trustworthy` ·
`a07-triggers-and-actions` · `a08-first-automation` · `a09-multi-step-safe-failure` ·
`a10-webhooks` ◆ · `a11-vibe-coding-mindset` · `a12-anatomy-of-an-app` ·
`a13-build-brief` · `a14-build-and-ship` · `a15-reading-code-without-fear` ·
`a16-debugging-with-ai` ◆ · `a17-capstone`

**Course B** (`lessons/course-b/`, 18 lessons)
`b01-github-worktrees` · `b02-databases` · `b03-integrate-data` · `b04-hosting-infra` ·
`b05-api-keys-secrets` · `b06-auth` · `b07-send-emails` · `b08-payments` ·
`b09-security-basics` ◆ · `b10-anatomy-of-an-agent` · `b11-tools-mcp-skills` ·
`b12-using-subagents` · `b13-session-logs` · `b14-open-source` ·
`b15-build-your-own-skill` ◆ · `b16-choose-capstone` · `b17-build-sprint` · `b18-keep-it-alive`

The last Course A lesson links forward to the first Course B lesson.

## How lessons get built
Core lessons first; deep-dives (`◆`) produced on demand for the ambitious track.
Each lesson is one win, beautiful, printable, with a quiz, a primary-source citation,
a "ask your teacher" prompt, and working prev/next + glossary links.
