import Link from "next/link";

/**
 * Matches the homepage brand mark (`.brand-mark` in globals.css): a circle
 * split on the 135° diagonal into maroon and turquoise, with a faint inset
 * ring. Kept in sync with the homepage so the funnel header reads as the
 * same brand.
 */
export function IntentionalLogo({ size = 16 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background:
          "linear-gradient(135deg, var(--maroon) 0%, var(--maroon) 50%, var(--turquoise) 50%, var(--turquoise) 100%)",
        boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)",
        display: "inline-block",
        flexShrink: 0,
      }}
    />
  );
}

export function FunnelHeader({
  backHref,
  backLabel,
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-10">
      <Link href="/" className="flex w-fit items-center gap-2.5 no-underline">
        <IntentionalLogo size={16} />
        <span className="ital text-[20px] text-ink">Intentional Studio</span>
      </Link>
      {backHref && backLabel ? (
        <Link href={backHref} className="navlink">
          {backLabel}
        </Link>
      ) : null}
    </header>
  );
}
