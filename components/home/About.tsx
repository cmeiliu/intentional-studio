"use client";

import { Counter, Reveal, Stagger, StaggerItem } from "./primitives";

const facts = [
  { to: 13, suffix: "+", label: "Years in product, ops & AI", cls: "fact" },
  { to: 12, suffix: "+", label: "Workshops delivered", cls: "fact fact-maroon" },
  { to: 8, suffix: "", label: "Custom apps shipped", cls: "fact fact-turquoise" },
  { to: 300, suffix: "+", label: "Lifetime projects shipped", cls: "fact" },
];

export function About() {
  return (
    <section id="about" className="section section-about">
      <div className="frame">
        <Reveal className="section-head">
          <p className="eyebrow eyebrow-turquoise">
            <span className="eyebrow-line" />
            Get to know more
          </p>
          <h2 className="section-title">
            About the <em>studio</em>.
          </h2>
        </Reveal>

        <div className="about-grid">
          <Reveal className="about-prose">
            <p className="lede">
              The model isn&apos;t your bottleneck. Your team is. Most companies
              tried ChatGPT, watched a demo, bought a few seats, and quietly went
              back to the old way of doing things. That gap is where I work.
            </p>
            <p>
              Thirteen years in startup product and operating roles, mostly in
              data, AI, and ML. Most recently at Binance.US, and before that
              building product and growth teams from scratch. Northwestern, Econ
              &amp; Legal Studies, magna cum laude. I started Intentional Studio
              because the AI work I kept getting pulled into deserved a real home.
            </p>
            <p>
              I take three or four engagements a quarter and do them well. I
              won&apos;t oversell you. If we&apos;re not a fit, I&apos;ll tell you
              on the first call.
            </p>

            <ul className="recognition">
              <li>
                <span>2025 ·</span> Top 50 Women We Admire, Austin
              </li>
              <li>
                <span>2021 ·</span> Women in Product Conference, Speaker
              </li>
            </ul>
          </Reveal>

          <Stagger className="about-facts" staggerChildren={0.1}>
            {facts.map((f) => (
              <StaggerItem key={f.label} className={f.cls}>
                <span className="fact-num">
                  <Counter to={f.to} suffix={f.suffix} />
                </span>
                <span className="fact-label">{f.label}</span>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
