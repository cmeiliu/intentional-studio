import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" />
          Intentional Studio
        </Link>
        <nav className="topnav">
          <Link href="/about">About</Link>
          <Link href="/ai-training">AI Training</Link>
          <Link href="/custom-apps">Custom Apps</Link>
          <Link href="/work">Work</Link>
          <Link href="/guides">Guides</Link>
          <Link href="/answers">Answers</Link>
          <Link href="/learn">Learn</Link>
          <Link href="/start" className="topnav-cta">
            Get in touch &rarr;
          </Link>
        </nav>
      </div>
    </header>
  );
}
