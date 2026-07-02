"use client";

import { Reveal, Stagger, StaggerItem } from "./primitives";

// Real client quotes. Each `quote` is split so the punch phrase renders in
// serif italic (the site's accent), echoing the emphasis in the source design.
const quotes = [
  {
    quote: [
      { text: "Ten emails and five texts go out before I’m awake. I " },
      { text: "approved drafts for three weeks", em: true },
      { text: ", then turned on autosend and never looked back." },
    ],
    name: "Donald",
    org: "Lip Smacking Foodie Tours",
    meta: "Las Vegas · tour-day outreach",
  },
  {
    quote: [
      { text: "Parents reserve a spot and pay the deposit at " },
      { text: "midnight", em: true },
      { text: ". We wake up to confirmed registrations we didn’t have to type." },
    ],
    name: "Jen & Tina",
    org: "Camp Spin Off",
    meta: "summer camp · intake → deposit",
  },
  {
    quote: [
      { text: "I described the quote I send a hundred times a week. By lunch it was " },
      { text: "drafting them for me", em: true },
      { text: " from a photo." },
    ],
    name: "Marcus",
    org: "Northside Exteriors",
    meta: "home services · photo-to-quote",
  },
];

export function Testimonials() {
  return (
    <section id="clients" className="section section-clients">
      <div className="frame">
        <Reveal className="section-head">
          <p className="eyebrow eyebrow-turquoise">
            <span className="eyebrow-line" />
            Operators
          </p>
          <h2 className="section-title">
            Built by the people <em>using it</em>.
          </h2>
        </Reveal>

        <Stagger className="quote-grid" staggerChildren={0.1}>
          {quotes.map((q) => (
            <StaggerItem key={q.name} as="article" className="quote-card">
              <blockquote className="quote-body">
                <span aria-hidden="true" className="quote-open">
                  “
                </span>
                {q.quote.map((s, i) =>
                  s.em ? <em key={i}>{s.text}</em> : <span key={i}>{s.text}</span>,
                )}
                <span aria-hidden="true">”</span>
              </blockquote>
              <div className="quote-attr">
                <span className="quote-name">
                  {q.name} · {q.org}
                </span>
                <span className="quote-meta">{q.meta}</span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
