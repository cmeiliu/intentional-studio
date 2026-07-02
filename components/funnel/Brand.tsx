import Link from "next/link";

/**
 * Funnel header. Reuses the exact same brand markup as the marketing site
 * header (`SiteHeader`) — the `.brand` / `.brand-mark` classes from
 * globals.css — so the logo is guaranteed identical across the homepage and
 * the funnel, and stays in sync if the mark is ever restyled.
 */
export function FunnelHeader({
  backHref,
  backLabel,
}: {
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <header className="flex items-center justify-between px-6 py-6 md:px-10">
      <Link href="/" className="brand no-underline">
        <span className="brand-mark" />
        Intentional Studio
      </Link>
      {backHref && backLabel ? (
        <Link href={backHref} className="navlink">
          {backLabel}
        </Link>
      ) : null}
    </header>
  );
}
