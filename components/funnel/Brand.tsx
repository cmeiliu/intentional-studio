import Link from "next/link";

export function IntentionalLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <defs>
        <linearGradient id="intentional-burgundy" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6e1d2c" />
          <stop offset="100%" stopColor="#350a14" />
        </linearGradient>
        <linearGradient id="intentional-sage" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7ac8a7" />
          <stop offset="100%" stopColor="#4f9d83" />
        </linearGradient>
      </defs>
      <ellipse cx="20" cy="22" rx="10" ry="8" fill="url(#intentional-burgundy)" />
      <ellipse cx="11" cy="14" rx="8" ry="6.5" fill="url(#intentional-sage)" />
      <ellipse cx="22" cy="9" rx="5" ry="4" fill="#c79b54" />
    </svg>
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
        <IntentionalLogo size={28} />
        <span className="serif text-[22px] text-ink">Intentional Studio</span>
      </Link>
      {backHref && backLabel ? (
        <Link href={backHref} className="navlink">
          {backLabel}
        </Link>
      ) : null}
    </header>
  );
}
