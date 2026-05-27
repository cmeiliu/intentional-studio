const STEPS = [
  { label: "Tell me", path: "/start" },
  { label: "Pick", path: "/projects" },
  { label: "Book", path: "/schedule" },
];

export function FunnelProgress({ current }: { current: 1 | 2 | 3 }) {
  return (
    <div className="mono flex items-center gap-3 text-[12px] text-ink-muted">
      <span className="uppercase tracking-wide">
        Step {current} of {STEPS.length}
      </span>
      <div className="flex items-center gap-1.5">
        {STEPS.map((step, index) => {
          const stepNum = index + 1;
          const isActive = stepNum === current;
          const isDone = stepNum < current;
          return (
            <span
              key={step.path}
              className="h-1 rounded-full transition-all"
              style={{
                width: isActive ? 36 : 14,
                background: isDone
                  ? "var(--color-burgundy-deep)"
                  : isActive
                    ? "var(--color-burgundy)"
                    : "rgba(26,24,20,.12)",
              }}
              aria-label={`${step.label}${isActive ? " (current)" : isDone ? " (done)" : ""}`}
            />
          );
        })}
      </div>
    </div>
  );
}
