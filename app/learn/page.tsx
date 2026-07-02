import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import {
  FOUNDER_NAME,
  SITE_NAME,
  absoluteUrl,
  organizationId,
  organizationSameAs,
  personSameAs,
  personId,
} from "@/lib/seo";

export const metadata: Metadata = {
  title: "AI Automation Courses for Entrepreneurs",
  description:
    "Self-paced AI automation and AI app-building courses from Intentional Studio for non-technical entrepreneurs who want to automate real work and ship useful software.",
  alternates: {
    canonical: "/learn",
  },
  keywords: [
    "AI automation course",
    "AI training for entrepreneurs",
    "learn AI automation",
    "build apps with AI",
    "Intentional Studio learn",
  ],
  openGraph: {
    title: `AI Automation Courses for Entrepreneurs | ${SITE_NAME}`,
    description:
      "Two stackable Intentional Studio courses for automating real work and building useful software with AI.",
    url: "/learn",
    type: "website",
    images: [
      {
        url: "/assets/mei.jpg",
        alt: `${FOUNDER_NAME}, founder of ${SITE_NAME}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `AI Automation Courses for Entrepreneurs | ${SITE_NAME}`,
    description:
      "Self-paced AI automation and AI app-building courses from Intentional Studio.",
    images: [absoluteUrl("/assets/mei.jpg")],
  },
};

type Lesson = { code: string; title: string; file: string; deep?: boolean };
type Module = { name: string; lessons: Lesson[] };
type Course = {
  id: string;
  tag: string;
  level: string;
  title: string;
  blurb: string;
  meta: string;
  dir: "course-a" | "course-b";
  modules: Module[];
};

const COURSES: Course[] = [
  {
    id: "course-a",
    tag: "Course A",
    level: "Foundational",
    title: "Automate & Build",
    blurb:
      "For any entrepreneur. Learn what AI can and can't do, ship a no-code automation that saves you hours, and build and deploy a working app by describing what you want.",
    meta: "17 lessons · 4-5 weeks · no coding required",
    dir: "course-a",
    modules: [
      {
        name: "A1 · Foundations & the AI Tool Landscape",
        lessons: [
          { code: "A1", title: "What AI Can Actually Do", file: "a01-what-ai-can-do" },
          { code: "A2", title: "The AI Tool Landscape", file: "a02-ai-tool-landscape" },
          { code: "A3", title: "The Busywork Audit (+ Build Wishlist)", file: "a03-busywork-audit" },
        ],
      },
      {
        name: "A2 · Prompting for Real Work",
        lessons: [
          { code: "A4", title: "Anatomy of a Reliable Prompt", file: "a04-anatomy-of-a-prompt" },
          { code: "A5", title: "Your Prompt Library", file: "a05-prompt-library" },
          { code: "A6", title: "Make It Trustworthy", file: "a06-make-it-trustworthy" },
        ],
      },
      {
        name: "A3 · No-Code Automation",
        lessons: [
          { code: "A7", title: "Triggers & Actions", file: "a07-triggers-and-actions" },
          { code: "A8", title: "Build Your First Automation", file: "a08-first-automation" },
          { code: "A9", title: "Multi-Step & Safe Failure", file: "a09-multi-step-safe-failure" },
          { code: "A10", title: "Webhooks: Connecting Anything", file: "a10-webhooks", deep: true },
        ],
      },
      {
        name: "A4 · Build by Talking (Vibe Coding)",
        lessons: [
          { code: "A11", title: "The Vibe-Coding Mindset", file: "a11-vibe-coding-mindset" },
          { code: "A12", title: "Anatomy of an App", file: "a12-anatomy-of-an-app" },
          { code: "A13", title: "Write the Build Brief", file: "a13-build-brief" },
          { code: "A14", title: "Build & Ship a One-Page Tool", file: "a14-build-and-ship" },
          { code: "A15", title: "Reading Code Without Fear", file: "a15-reading-code-without-fear" },
          { code: "A16", title: "Debugging With AI", file: "a16-debugging-with-ai", deep: true },
        ],
      },
      {
        name: "Capstone",
        lessons: [
          { code: "A17", title: "Capstone A: Ship Your First Thing", file: "a17-capstone" },
        ],
      },
    ],
  },
  {
    id: "course-b",
    tag: "Course B",
    level: "Advanced",
    title: "Ship Real Software with AI Agents",
    blurb:
      "For Course A grads and founders who want to go further. Take a prototype to real, production software with auth, data, payments, and hosting, then put AI agents to work building it.",
    meta: "18 lessons · 4-5 weeks · production + agents",
    dir: "course-b",
    modules: [
      {
        name: "B1 · The Real 20%: Production Software",
        lessons: [
          { code: "B1", title: "GitHub & Worktrees", file: "b01-github-worktrees" },
          { code: "B2", title: "Databases", file: "b02-databases" },
          { code: "B3", title: "Integrate Data", file: "b03-integrate-data" },
          { code: "B4", title: "Hosting & Infra", file: "b04-hosting-infra" },
          { code: "B5", title: "API Keys & Secrets", file: "b05-api-keys-secrets" },
          { code: "B6", title: "Auth: Real Logins", file: "b06-auth" },
          { code: "B7", title: "Send Emails", file: "b07-send-emails" },
          { code: "B8", title: "Payments with Stripe", file: "b08-payments" },
          { code: "B9", title: "Security Basics", file: "b09-security-basics", deep: true },
        ],
      },
      {
        name: "B2 · Going Agentic: Agents, MCP & Skills",
        lessons: [
          { code: "B10", title: "Anatomy of an Agent", file: "b10-anatomy-of-an-agent" },
          { code: "B11", title: "Tools, CLI, MCP & Skills", file: "b11-tools-mcp-skills" },
          { code: "B12", title: "Using Subagents", file: "b12-using-subagents" },
          { code: "B13", title: "Reading Session Logs", file: "b13-session-logs" },
          { code: "B14", title: "Open Source", file: "b14-open-source" },
          { code: "B15", title: "Build Your Own Skill or MCP Server", file: "b15-build-your-own-skill", deep: true },
        ],
      },
      {
        name: "B3 · Capstone",
        lessons: [
          { code: "B16", title: "Choose Your Capstone", file: "b16-choose-capstone" },
          { code: "B17", title: "Build Sprint", file: "b17-build-sprint" },
          { code: "B18", title: "Keep It Alive & Know Your Limits", file: "b18-keep-it-alive" },
        ],
      },
    ],
  },
];

function lessonHref(dir: string, file: string) {
  return `/learn/lessons/${dir}/${file}.html`;
}

const learnJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/intentional-studio-logo.svg"),
      sameAs: organizationSameAs,
      founder: {
        "@id": personId,
      },
    },
    {
      "@type": "Person",
      "@id": personId,
      name: FOUNDER_NAME,
      url: absoluteUrl("/about"),
      image: absoluteUrl("/assets/mei.jpg"),
      sameAs: personSameAs,
    },
    {
      "@type": "WebPage",
      "@id": absoluteUrl("/learn#webpage"),
      name: "AI Automation Courses for Entrepreneurs",
      description:
        "Self-paced AI automation and AI app-building courses from Intentional Studio for non-technical entrepreneurs.",
      url: absoluteUrl("/learn"),
      isPartOf: {
        "@id": absoluteUrl("/#website"),
      },
      about: [
        "AI automation training",
        "AI app building",
        "AI training for entrepreneurs",
      ],
    },
    {
      "@type": "ItemList",
      "@id": absoluteUrl("/learn#courses"),
      name: "Intentional Studio AI automation courses",
      itemListElement: COURSES.map((course, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Course",
          name: course.title,
          description: course.blurb,
          url: absoluteUrl(`/learn#${course.id}`),
          provider: {
            "@id": organizationId,
          },
          creator: {
            "@id": personId,
          },
        },
      })),
    },
  ],
};

export default function LearnPage() {
  return (
    <>
      <JsonLd data={learnJsonLd} />
      <div className="flex flex-1 flex-col">
        <header className="topbar">
          <div className="topbar-inner">
            <a href="/" className="brand">
              <span className="brand-mark" />
              Intentional Studio
            </a>
            <nav className="topnav">
              <a href="/">Home</a>
              <a
                href="mailto:mei@intentional.studio?subject=Let's%20work%20together"
                className="topnav-cta"
              >
                Get in touch →
              </a>
            </nav>
          </div>
        </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:px-10 md:py-16">
        <p className="eyebrow eyebrow-turquoise">
          <span className="eyebrow-line" />
          Self-paced · Preview
        </p>
        <h1 className="h2 mt-4 text-ink">
          Learn to <span className="ital text-burgundy-deep">automate &amp; build</span> with AI.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          You&rsquo;ve tried ChatGPT. Now do something with it. These two courses
          take you from poking at prompts to automating the busywork in your
          business and shipping software you actually use. No coding background
          needed. Every lesson is short, hands-on, and builds something real.
          Click any lesson to preview it.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a className="btn btn-primary" href={lessonHref("course-a", "a01-what-ai-can-do")} target="_blank" rel="noopener">
            Start Course A →
          </a>
          <a className="btn btn-ghost" href="#course-b">
            Jump to Course B
          </a>
          <a className="btn btn-ghost" href="/learn/reference/glossary.html" target="_blank" rel="noopener">
            Glossary
          </a>
        </div>

        {COURSES.map((course) => (
          <section key={course.id} id={course.id} className="mt-16 scroll-mt-24">
            <div className="rounded-2xl border border-ink/10 bg-cream-2 p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-burgundy-deep px-3 py-1 text-xs font-medium uppercase tracking-wide text-cream-0">
                    {course.tag}
                  </span>
                  <span className="text-xs uppercase tracking-wide text-ink-muted">
                    {course.level}
                  </span>
                </div>
                <span className="text-xs text-ink-muted">{course.meta}</span>
              </div>

              <h2 className="serif mt-4 text-3xl text-ink">{course.title}</h2>
              <p className="mt-3 max-w-3xl text-ink-2 leading-relaxed">{course.blurb}</p>

              <div className="mt-8 space-y-8">
                {course.modules.map((mod) => (
                  <div key={mod.name}>
                    <h3 className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                      {mod.name}
                    </h3>
                    <ul className="mt-3 divide-y divide-ink/10 border-t border-ink/10">
                      {mod.lessons.map((lesson) => (
                        <li key={lesson.file}>
                          <a
                            href={lessonHref(course.dir, lesson.file)}
                            target="_blank"
                            rel="noopener"
                            className="group flex items-center gap-4 py-3 transition-colors hover:bg-cream/60"
                          >
                            <span className="w-10 shrink-0 font-mono text-xs text-ink-muted">
                              {lesson.code}
                            </span>
                            <span className="flex-1 text-ink group-hover:text-burgundy-deep">
                              {lesson.title}
                            </span>
                            {lesson.deep && (
                              <span className="rounded-full border border-ink/15 px-2 py-0.5 text-[0.65rem] uppercase tracking-wide text-ink-muted">
                                deep dive
                              </span>
                            )}
                            <span className="shrink-0 text-ink-muted group-hover:text-burgundy-deep">
                              ↗
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        <p className="mt-12 text-sm text-ink-muted">
          Lessons open in a new tab and link to each other (previous, next,
          glossary). This is a working preview, so content is still being
          refined. The full outline lives in the repo&rsquo;s{" "}
          <code className="rounded bg-cream-2 px-1.5 py-0.5">ai-automation-for-entrepreneurs/</code>{" "}
          workspace.
        </p>
        </main>
      </div>
    </>
  );
}
