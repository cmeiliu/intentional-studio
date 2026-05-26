"use client";

import { useEffect } from "react";

export function BrochureEffects() {
  useEffect(() => {
    const candidates = document.querySelectorAll<HTMLElement>(
      ".hero-text, .hero-card, .section-head, .about-prose, .fact, .service, .workcard, .work-footer, .step, .contact > *",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );

    candidates.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.transitionDelay = `${Math.min(index * 50, 240)}ms`;
      observer.observe(element);
    });

    const topbar = document.querySelector(".topbar");
    const onScroll = () => {
      topbar?.classList.toggle("scrolled", window.scrollY > 32);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const card = document.querySelector<HTMLElement>(".hero-card");
    const onMouseMove = (event: MouseEvent) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotate(${0.6 - x * 1.5}deg) translateY(${y * -4}px)`;
    };
    const onMouseLeave = () => {
      if (card) card.style.transform = "rotate(0.6deg)";
    };
    card?.addEventListener("mousemove", onMouseMove);
    card?.addEventListener("mouseleave", onMouseLeave);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      card?.removeEventListener("mousemove", onMouseMove);
      card?.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return null;
}
