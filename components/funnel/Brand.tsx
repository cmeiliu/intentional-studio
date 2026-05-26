import Link from "next/link";

export function IntentionalMark({ size = 28 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]"
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, var(--maroon) 0%, var(--maroon) 50%, var(--turquoise) 50%, var(--turquoise) 100%)",
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
    <header className="px-6 py-6 md:px-10 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2.5 no-underline">
        <IntentionalMark size={28} />
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
