import { FunnelHeader } from "@/components/funnel/Brand";
import { FunnelProgress } from "@/components/funnel/FunnelProgress";
import { StartForm } from "./StartForm";

export default function StartPage() {
  return (
    <div className="flex flex-1 flex-col">
      <FunnelHeader />
      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-12 md:px-10 md:py-20">
        <FunnelProgress current={1} />
        <h1 className="h2 mt-6 text-ink">
          Where are you <span className="ital">stuck</span>?
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          Send me your website and tell me the one bottleneck eating your week.
          I&apos;ll read the site, sketch 3 concrete build ideas, and help you
          pick the first thing worth turning into software.
        </p>
        <div className="mt-10">
          <StartForm />
        </div>
      </main>
    </div>
  );
}
