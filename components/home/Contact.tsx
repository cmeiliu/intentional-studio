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
              Tell me what you&apos;re trying to <em>build</em>.
            </h2>
          </StaggerItem>
          <StaggerItem as="p" className="contact-sub">
            Send a few sentences about the team, the problem, and the rough
            timeline. I read everything and reply within two working days.
          </StaggerItem>
          <StaggerItem>
            <a href="mailto:mei@intentional.studio" className="contact-email">
              mei<em>@</em>intentional.studio
            </a>
          </StaggerItem>
          <StaggerItem>
            <div className="contact-meta">
              <span>Currently booking · Q3 2026</span>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
