import { redirect } from "next/navigation";
import { AnalyticsTrigger } from "@/app/AnalyticsTrigger";
import { FunnelHeader } from "@/components/funnel/Brand";
import { FunnelProgress } from "@/components/funnel/FunnelProgress";
import { readSessionWithId } from "@/lib/session";
import { ScheduleEmbed } from "./ScheduleEmbed";

export default async function SchedulePage() {
  const session = await readSessionWithId();
  if (!session) redirect("/start");

  const prioritized = (session.prioritized ?? [])
    .map((i) => session.projects[i])
    .filter(Boolean);

  if (prioritized.length === 0) redirect("/projects");

  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;

  return (
    <div className="flex flex-1 flex-col">
      <AnalyticsTrigger
        event="schedule_viewed"
        properties={{
          prioritized_count: prioritized.length,
          cal_link_present: Boolean(calLink),
        }}
      />
      <FunnelHeader backHref="/projects" backLabel="Back to ideas" />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 md:px-10 md:py-16">
        <div className="mb-8">
          <FunnelProgress current={3} />
        </div>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h1 className="h2 text-ink">
              Let&apos;s plan this <span className="ital">together</span>.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-ink-2">
              Thirty minutes on Zoom. We&rsquo;ll walk through your workflow,
              confirm which tools we need to connect, and leave with enough
              detail to price the first version and start building.
            </p>
            <div className="mt-8 space-y-2.5">
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                You picked
              </p>
              {prioritized.map((p, i) => (
                <div
                  key={`${p.title}-${i}`}
                  className="rounded-xl border border-ink/10 bg-cream-2 px-4 py-3"
                >
                  <div className="serif text-base">{p.title}</div>
                  <div className="mt-1 text-xs text-ink-muted">
                    {p.expected_impact}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-ink/10 bg-cream-0 p-5">
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                How it works
              </p>
              <ol className="mt-3 space-y-2.5 text-sm leading-relaxed text-ink-2">
                <li>
                  <span className="serif mr-1.5 text-burgundy-deep">1.</span>
                  Pick a 30-minute slot.
                </li>
                <li>
                  <span className="serif mr-1.5 text-burgundy-deep">2.</span>
                  Pay a <strong className="text-ink">$50 booking fee</strong>{" "}
                  through Cal.com to lock the time.
                </li>
                <li>
                  <span className="serif mr-1.5 text-burgundy-deep">3.</span>
                  Show up and we turn the idea into a clear first build plan.
                </li>
              </ol>
            </div>
          </div>
          <div className="min-h-[600px] rounded-2xl border border-ink/10 bg-cream-2 p-4 md:p-6">
            {calLink ? (
              <ScheduleEmbed
                calLink={calLink}
                onboardingSessionId={session.id}
                prefilledEmail={session.email ?? ""}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center px-8 py-16 text-center">
                <p className="mb-3 text-sm text-ink-muted">
                  Scheduling is temporarily offline.
                </p>
                <p className="max-w-sm text-ink-2">
                  Email{" "}
                  <a
                    href="mailto:mei@intentional.studio"
                    className="text-burgundy-deep underline"
                  >
                    mei@intentional.studio
                  </a>{" "}
                  and I&apos;ll send you a booking link.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
