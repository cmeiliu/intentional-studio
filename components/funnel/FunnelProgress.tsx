const STEPS = ["Intake", "Ideas", "Schedule"] as const;

export function FunnelProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-3 text-[12px] mono text-ink-muted">
      {STEPS.map((step, index) => {
        const n = index + 1;
        const active = n === current;
        const complete = n < current;
        return (
          <div key={step} className="flex items-center gap-3">
            <span
              className="grid h-7 w-7 place-items-center rounded-full border text-[11px]"
              style={{
                borderColor:
                  active || complete
                    ? "var(--color-burgundy-deep)"
                    : "var(--color-cream-4)",
                background: active
                  ? "var(--color-burgundy-deep)"
                  : complete
                    ? "var(--color-burgundy)"
                    : "transparent",
                color: active || complete ? "var(--color-cream-0)" : "inherit",
              }}
            >
              {n}
            </span>
            <span className={active ? "text-ink" : ""}>{step}</span>
            {n < STEPS.length ? <span className="text-ink-muted">/</span> : null}
          </div>
        );
      })}
    </div>
  );
}
