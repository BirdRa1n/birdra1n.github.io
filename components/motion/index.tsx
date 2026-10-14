// components/motion — primitivas de animação do site.
// Tudo anima só transform/opacity (compositor) e respeita
// prefers-reduced-motion via <MotionConfig reducedMotion="user">.
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

/* ─── Reveal: sobe e aparece ao entrar na viewport ───────────── */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = "div",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "article" | "li" | "header";
  once?: boolean;
}) {
  const Comp = motion[as];

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: EASE_OUT }}
      viewport={{ once, margin: "0px 0px -12% 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </Comp>
  );
}

/* ─── Título que entra palavra por palavra ───────────────────── */
export function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");

  return (
    <span aria-label={text} className={className} role="text">
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
        >
          <motion.span
            className="inline-block"
            initial={{ y: "105%" }}
            transition={{ duration: 1, delay: delay + i * stagger, ease: EASE_OUT }}
            viewport={{ once: true }}
            whileInView={{ y: "0%" }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* ─── Texto que "acende" conforme o scroll (estilo Apple) ────── */
function ScrollWord({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.18, 1]);

  return (
    <motion.span className="inline" style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

export function ScrollHighlight({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 45%"],
  });
  const words = text.split(" ");

  if (reduce) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} aria-label={text} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        return (
          <ScrollWord
            key={`${word}-${i}`}
            progress={scrollYProgress}
            range={[start, end]}
            word={word}
          />
        );
      })}
    </p>
  );
}

/* ─── Contador animado ao entrar na viewport ─────────────────── */
export function CountUp({
  value,
  suffix = "",
  duration = 1.6,
  format = (n: number) => String(n),
}: {
  value: number;
  suffix?: string;
  duration?: number;
  format?: (n: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduce || value === 0) {
      setDisplay(value);

      return;
    }

    let raf = 0;
    let t0 = 0;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 4);

      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);

    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, reduce]);

  return (
    <span ref={ref} className="tabular-nums">
      {format(display)}
      {suffix}
    </span>
  );
}

/* ─── Barra de progresso de leitura/scroll ───────────────────── */
export function ScrollProgress({ className = "" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden
      className={`fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] ${className}`}
      style={{ scaleX, background: "var(--grad)" }}
    />
  );
}

/* ─── Saber se a página já rolou (para a nav) ────────────────── */
export function useScrolled(threshold = 8) {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > threshold));

  return scrolled;
}
