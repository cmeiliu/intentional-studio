"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  animate,
} from "motion/react";
import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import {
  EASE_OUT,
  SPRING_SNAPPY,
  SPRING_SOFT,
  fadeUp,
  inView,
  stagger,
  word,
  wordContainer,
} from "@/lib/motion";

/**
 * useReveal — drives a scroll-triggered reveal, with a safety net.
 *
 * On a normal browser it reveals when the element scrolls into view (pure
 * scroll-reveal, no arbitrary timers). But if IntersectionObserver can't work
 * — JS-disabled SSR, or a zero-height/headless viewport — it reveals
 * immediately so content is never left permanently hidden. That guard is what
 * keeps "hidden by default, shown by JS" from ever producing a blank page.
 */
function useReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const inViewNow = useInView(ref, inView);
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.innerHeight === 0
    ) {
      setForced(true);
    }
  }, []);

  return { ref, show: inViewNow || forced };
}

/**
 * Reveal — a single element that fades/rises in when scrolled into view.
 * Honors prefers-reduced-motion (renders visible, no transform).
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "aside" | "li" | "p" | "span";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal();
  const MotionTag = motion[as];
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      variants={fadeUp}
      initial="hidden"
      animate={show ? "show" : "hidden"}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Stagger — a container whose direct <Reveal>/motion children cascade in.
 */
export function Stagger({
  children,
  className,
  as = "div",
  delayChildren = 0,
  staggerChildren = 0.08,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "ul";
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const reduce = useReducedMotion();
  const { ref, show } = useReveal();
  const MotionTag = motion[as];
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      className={className}
      variants={stagger(delayChildren, staggerChildren)}
      initial="hidden"
      animate={show ? "show" : "hidden"}
    >
      {children}
    </MotionTag>
  );
}

/** A child of <Stagger> that rises in as part of the cascade. */
export function StaggerItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "li" | "p";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as];
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}

/**
 * WordReveal — splits text into words that rise in one after another.
 * Renders the signature hero headline. `html` allows inline <em>/<br>.
 */
export function WordReveal({
  segments,
  className,
}: {
  /** Array of words/segments. Use { em: true } for the serif-italic accent. */
  segments: { text: string; em?: boolean; br?: boolean }[];
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <h1 className={className}>
        {segments.map((s, i) =>
          s.br ? <br key={i} /> : s.em ? <em key={i}>{s.text} </em> : <span key={i}>{s.text} </span>,
        )}
      </h1>
    );
  }
  return (
    <motion.h1
      className={className}
      variants={wordContainer}
      initial="hidden"
      animate="show"
      aria-label={segments.map((s) => s.text).join(" ")}
    >
      {segments.map((s, i) =>
        s.br ? (
          <br key={i} />
        ) : (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: "0.05em" }}>
            <motion.span variants={word} style={{ display: "inline-block" }}>
              {s.em ? <em>{s.text}</em> : s.text}
              {" "}
            </motion.span>
          </span>
        ),
      )}
    </motion.h1>
  );
}

/**
 * Magnetic — element subtly pulls toward the cursor and springs back.
 * Used on the hero CTAs. Disabled under reduced-motion.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
} & ComponentPropsWithoutRef<typeof motion.a>) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useSpring(useMotionValue(0), SPRING_SOFT);
  const y = useSpring(useMotionValue(0), SPRING_SOFT);

  if (reduce) {
    // Fall back to a plain anchor with the same class.
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    return (
      <a className={className} {...(rest as ComponentPropsWithoutRef<"a">)}>
        {children}
      </a>
    );
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={{ x, y }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
        y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      {...rest}
    >
      {children}
    </motion.a>
  );
}

/**
 * Counter — counts a number up from 0 when scrolled into view.
 * Preserves prefix/suffix (e.g. "13", "+"). Reduced-motion shows final value.
 */
export function Counter({
  to,
  suffix = "",
  className,
}: {
  to: number;
  suffix?: string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [forced, setForced] = useState(false);
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.innerHeight === 0
    ) {
      setForced(true);
    }
  }, []);

  useEffect(() => {
    if (reduce || !(seen || forced)) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: EASE_OUT,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [seen, forced, to, reduce]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix ? <sup>{suffix}</sup> : null}
    </span>
  );
}

/**
 * TiltCard — spring-damped 3D tilt toward the cursor. Replaces the old
 * linear mouse-tilt on the hero card with something weighted and smooth.
 */
export function TiltCard({
  children,
  className,
  baseRotate = 0.6,
}: {
  children: ReactNode;
  className?: string;
  baseRotate?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [8, -8]), SPRING_SNAPPY);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [-6, 6]), SPRING_SNAPPY);
  const lift = useSpring(useTransform(py, [-0.5, 0.5], [-4, 4]), SPRING_SNAPPY);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        rotate: baseRotate,
        rotateX,
        rotateY,
        y: lift,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        px.set((e.clientX - rect.left) / rect.width - 0.5);
        py.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
