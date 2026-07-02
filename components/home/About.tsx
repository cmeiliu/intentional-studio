"use client";

import { Counter, Reveal, Stagger, StaggerItem } from "./primitives";

const facts = [
  { to: 13, suffix: "+", label: "Years in product, ops & AI", cls: "fact" },
  { to: 12, suffix: "+", label: "Workshops delivered", cls: "fact fact-maroon" },
  { to: 8, suffix: "", label: "Custom apps shipped", cls: "fact fact-turquoise" },
  { to: 100, suffix: "%", label: "Built by hand, with the tools", cls: "fact" },
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
              The model isn&apos;t the bottleneck anymore — your team is. Most
              companies have tried ChatGPT, watched a demo, maybe paid for a few
              seats, and then quietly went back to doing things the old way.
              That&apos;s the gap I work in.
            </p>
            <p>
              Thirteen years in startup product and operating roles, specializing
              in data, AI, and ML — most recently at Binance.US, with earlier
              stops building product and growth functions from zero. Northwestern,
              Econ &amp; Legal Studies, magna cum laude. I started Intentional
              Studio because the AI work I kept getting pulled into deserved a real
              home.
            </p>
            <p>
              I take three to four engagements a quarter, do them well, and try
              not to oversell anything. If we&apos;re not the right fit, I&apos;ll
              say so on the first call.
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
