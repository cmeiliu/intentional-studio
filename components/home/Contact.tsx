"use client";

import { Stagger, StaggerItem } from "./primitives";

export function Contact() {
  return (
    <section id="contact" className="section section-contact">
      <div className="frame">
        <Stagger className="contact" staggerChildren={0.1}>
          <StaggerItem as="p" className="eyebrow eyebrow-cream">
            <span className="eyebrow-line" />
            Want to work together?
          </StaggerItem>
          <StaggerItem>
            <h2 className="contact-title">
              Tell us what you&apos;re trying to <em>build</em>.
            </h2>
          </StaggerItem>
          <StaggerItem as="p" className="contact-sub">
            Tell us about your team, the problem, and the timeline. We&apos;ll
            come back with how we&apos;d approach it.
          </StaggerItem>
          <StaggerItem>
            <a
              href="mailto:mei@intentional.studio?subject=Let's%20work%20together"
              className="contact-email"
            >
              mei<em>@</em>intentional.studio
            </a>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
