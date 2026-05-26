import { redirect } from "next/navigation";
import { AnalyticsTrigger } from "@/app/AnalyticsTrigger";
import { FunnelHeader } from "@/components/funnel/Brand";
import { FunnelProgress } from "@/components/funnel/FunnelProgress";
import { readSessionWithId } from "@/lib/session";
import { ProjectsList } from "./ProjectsList";

export default async function ProjectsPage() {
  const session = await readSessionWithId();
  if (!session) redirect("/start");

  return (
    <div className="flex min-h-screen flex-col bg-cream-1">
      <AnalyticsTrigger
        event="projects_viewed"
        properties={{
          project_count: session.projects.length,
          has_prior_priorities: (session.prioritized?.length ?? 0) > 0,
        }}
      />
      <FunnelHeader backHref="/start" backLabel="Start over" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 md:px-10 md:py-16">
        <FunnelProgress current={2} />
        <h1 className="h2 mt-6 text-ink">
          Built for{" "}
          <span className="ital text-burgundy-deep">{prettyHost(session.url)}</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
          I read your site and the bottleneck you named. Pick the idea that
          would take the most weight off your week. On the call, we will turn it
          into a real build plan.
        </p>
        <div className="mt-12">
          <ProjectsList
            projects={session.projects}
            initialSelected={session.prioritized ?? []}
          />
        </div>
      </main>
    </div>
  );
}

function prettyHost(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}
