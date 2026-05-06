// pages/index.tsx
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";
import NextLink from "next/link";

import { GithubIcon } from "@/components/icons";
import Certificates from "@/components/home/certificates";
import FeaturedProjects from "@/components/home/featured-projects";
import Repositories from "@/components/home/repos";
import SkillsGlobe from "@/components/home/skills-globe";
import { siteConfig } from "@/config/site";
import { useReposContext } from "@/contexts/repos";
import DefaultLayout from "@/layouts/default";

/* ─── Hooks ──────────────────────────────────────────────────── */
function useTypewriter(texts: string[], speed = 70, pause = 2200) {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIndex];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          setDisplayed(current.slice(0, charIndex + 1));
          if (charIndex + 1 === current.length) setTimeout(() => setDeleting(true), pause);
          else setCharIndex((c) => c + 1);
        } else {
          setDisplayed(current.slice(0, charIndex - 1));
          if (charIndex - 1 === 0) {
            setDeleting(false);
            setTextIndex((i) => (i + 1) % texts.length);
            setCharIndex(0);
          } else {
            setCharIndex((c) => c - 1);
          }
        }
      },
      deleting ? speed / 2 : speed,
    );
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, pause]);

  return displayed;
}

function useCounter(end: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const start = useCallback(() => setStarted(true), []);

  useEffect(() => {
    if (!started || end === 0) return;
    let t0: number;
    const step = (ts: number) => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
      else setCount(end);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, start };
}

/* ─── Always-dark panel tokens (code blocks) ─────────────────── */
// Code panels must always render dark regardless of light/dark mode
const PANEL: React.CSSProperties = {
  ["--bg-card" as any]:     "#110F1A",
  ["--bg-card-alt" as any]: "#1A1726",
  ["--border" as any]:      "#2D2640",
  ["--text-primary" as any]:"#EDE9FE",
  ["--text-muted" as any]:  "#7C7A9A",
};

// Code syntax colors — designed for dark background
const C = {
  kw:  "#FF7B72",   // keywords
  var: "#79C0FF",   // variables
  str: "#A5D6FF",   // strings
  num: "#F8C555",   // numbers
  cmt: "#6A737D",   // comments
  neon:"#A78BFA",   // special (true, Infinity)
  def: "#E6EDF3",   // default text
};

/* ─── Hero code block (always dark) ─────────────────────────── */
const HeroCodeBlock = ({ repoCount }: { repoCount: number }) => (
  <motion.div
    animate={{ opacity: 1, x: 0 }}
    className="terminal-window w-full"
    initial={{ opacity: 0, x: 40 }}
    style={PANEL}
    transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="terminal-header">
      <div className="terminal-dots">
        <div className="terminal-dot" style={{ background: "#FF5F57" }} />
        <div className="terminal-dot" style={{ background: "#FEBC2E" }} />
        <div className="terminal-dot" style={{ background: "#28C840" }} />
      </div>
      <span className="text-xs" style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
        developer.config.ts
      </span>
    </div>
    <div className="p-5 overflow-x-auto">
      <pre className="text-[11px] sm:text-xs leading-[1.8]" style={{ fontFamily: "var(--font-mono)", margin: 0 }}>
        <span style={{ color: C.cmt }}>{"// BirdRa1n — Dev Config\n"}</span>
        <span style={{ color: C.kw }}>{"const "}</span><span style={{ color: C.var }}>{"developer"}</span><span style={{ color: C.def }}>{" = {\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"name"}</span><span style={{ color: C.def }}>{":     "}</span><span style={{ color: C.str }}>{'"Dário Jr"'}</span><span style={{ color: C.def }}>{",\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"alias"}</span><span style={{ color: C.def }}>{":    "}</span><span style={{ color: C.str }}>{'"BirdRa1n"'}</span><span style={{ color: C.def }}>{",\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"location"}</span><span style={{ color: C.def }}>{": "}</span><span style={{ color: C.str }}>{'"Brazil 🇧🇷"'}</span><span style={{ color: C.def }}>{",\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"stack"}</span><span style={{ color: C.def }}>{":    ["}</span>
        <span style={{ color: C.str }}>{'"React"'}</span><span style={{ color: C.def }}>{", "}</span>
        <span style={{ color: C.str }}>{'"Next.js"'}</span><span style={{ color: C.def }}>{", "}</span>
        <span style={{ color: C.str }}>{'"TypeScript"'}</span><span style={{ color: C.def }}>{"],\n"}</span>
        <span style={{ color: C.def }}>{"             ["}</span>
        <span style={{ color: C.str }}>{'"Node.js"'}</span><span style={{ color: C.def }}>{", "}</span>
        <span style={{ color: C.str }}>{'"Supabase"'}</span><span style={{ color: C.def }}>{", "}</span>
        <span style={{ color: C.str }}>{'"Swift"'}</span><span style={{ color: C.def }}>{"],\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"repos"}</span><span style={{ color: C.def }}>{":    "}</span><span style={{ color: C.num }}>{repoCount || "..."}</span><span style={{ color: C.def }}>{",\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"available"}</span><span style={{ color: C.def }}>{": "}</span><span style={{ color: C.neon }}>{"true"}</span><span style={{ color: C.def }}>{",\n"}</span>
        <span style={{ color: C.def }}>{"  "}</span><span style={{ color: C.var }}>{"coffee"}</span><span style={{ color: C.def }}>{":   "}</span><span style={{ color: C.num }}>{"Infinity"}</span><span style={{ color: C.def }}>{",\n"}</span>
        <span style={{ color: C.def }}>{"}\n\n"}</span>
        <span style={{ color: C.kw }}>{"export default "}</span><span style={{ color: C.var }}>{"developer"}</span><span style={{ color: C.def }}>{";"}</span>
      </pre>
    </div>
  </motion.div>
);


/* ─── Section reveal wrapper ─────────────────────────────────── */
const Section = ({ children, id }: { children: React.ReactNode; id?: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className="w-full"
      animate={inView ? { opacity: 1, y: 0 } : {}}
      initial={{ opacity: 0, y: 48 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
};

/* ─── Section heading — clean, no terminal chrome ────────────── */
const SectionHeading = ({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
    <div>
      <p
        className="text-[10px] font-bold tracking-[0.25em] uppercase mb-3"
        style={{ color: "var(--neon)" }}
      >
        {eyebrow}
      </p>
      <h2
        className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>
    </div>
    <p
      className="text-sm leading-relaxed sm:text-right sm:max-w-xs"
      style={{ color: "var(--text-muted)", fontFamily: "var(--font-body)" }}
    >
      {description}
    </p>
  </div>
);

/* ─── Stat box ───────────────────────────────────────────────── */
const StatBox = ({ value, label }: { value: string | number; label: string }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const isNum = typeof value === "number";
  const { count, start } = useCounter(isNum ? (value as number) : 0);

  useEffect(() => { if (inView && isNum) start(); }, [inView, isNum, start]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center justify-center px-4 py-3 rounded-lg"
      style={{ border: "1px solid var(--border)", background: "var(--bg-card)", minWidth: 80 }}
    >
      <span
        className="text-xl font-bold leading-none"
        style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
      >
        {isNum ? count : value}
      </span>
      <span
        className="text-[9px] mt-1 tracking-widest uppercase"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
};

/* ─── Boot sequence lines ────────────────────────────────────── */
const BOOT_LINES = [
  { text: "> init.BirdRa1n()",                  delay: 0.05 },
  { text: "> loading.modules() ...............", delay: 0.3,  ok: true },
  { text: "> mounting.portfolio() ............", delay: 0.55, ok: true },
  { text: "> status: ONLINE",                   delay: 0.8,  neon: true },
];

/* ─── Page ───────────────────────────────────────────────────── */
export default function IndexPage() {
  const { repos, fetchingRepos } = useReposContext();
  const roles = [
    "Full-Stack Developer",
    "Front-End Engineer",
    "Back-End Engineer",
    "Open Source Contributor",
  ];
  const role = useTypewriter(roles, 70, 2200);
  const { scrollYProgress } = useScroll();
  const heroY       = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3],  [1, 0.4]);

  return (
    <DefaultLayout>
      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center py-20">
        <div className="grid lg:grid-cols-[1fr_440px] xl:grid-cols-[1fr_480px] gap-12 xl:gap-16 items-center w-full">

          {/* Left */}
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            {/* Boot lines */}
            <div className="mb-7 space-y-1.5">
              {BOOT_LINES.map((line) => (
                <motion.div
                  key={line.text}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 text-xs"
                  initial={{ opacity: 0, x: -12 }}
                  style={{ fontFamily: "var(--font-mono)" }}
                  transition={{ delay: line.delay, duration: 0.35 }}
                >
                  <span style={{ color: line.neon ? "var(--neon)" : "var(--text-muted)" }}>
                    {line.text}
                  </span>
                  {line.ok && (
                    <span className="font-bold" style={{ color: "var(--neon)" }}>[OK]</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Name */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 24 }}
              transition={{ delay: 0.95, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="text-sm mb-2"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                Hello, World. I&apos;m
              </p>
              <h1
                className="text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none"
                style={{ fontFamily: "var(--font-display)", color: "var(--neon)" }}
              >
                Dário Jr
              </h1>
            </motion.div>

            {/* Typewriter */}
            <motion.div
              animate={{ opacity: 1 }}
              className="mt-4 mb-6 flex items-center gap-2"
              initial={{ opacity: 0 }}
              transition={{ delay: 1.15 }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                &gt;{" "}
              </span>
              <span
                className="text-base sm:text-lg font-medium"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)" }}
              >
                {role}
                <span className="cursor-blink ml-0.5" style={{ color: "var(--neon)" }}>▌</span>
              </span>
            </motion.div>

            {/* Bio */}
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="text-sm leading-[1.85] max-w-xl mb-8"
              initial={{ opacity: 0, y: 14 }}
              style={{ color: "var(--text-muted)" }}
              transition={{ delay: 1.25, duration: 0.55 }}
            >
              Tech enthusiast and developer with experience in front-end and back-end development.
              Focused on building exceptional digital solutions through clean code and thoughtful design.
            </motion.p>

            {/* CTAs */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap gap-3 mb-8"
              initial={{ opacity: 0, y: 14 }}
              transition={{ delay: 1.38, duration: 0.5 }}
            >
              <NextLink className="btn-primary" href="#repositories">
                Initialize_Portfolio()
              </NextLink>
              <a
                className="btn-outline"
                href={siteConfig.links.github}
                rel="noopener noreferrer"
                target="_blank"
              >
                <GithubIcon size={14} />
                GitHub
                {!fetchingRepos && repos.length > 0 && (
                  <span
                    className="ml-1 text-[10px] px-1.5 py-0.5 rounded"
                    style={{ background: "var(--neon-glow)", border: "1px solid var(--neon-dim)" }}
                  >
                    {repos.length}
                  </span>
                )}
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              animate={{ opacity: 1 }}
              className="flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              transition={{ delay: 1.5 }}
            >
              <StatBox label="YRS EXP"  value="3+"  />
              <StatBox label="REPOS"    value={fetchingRepos ? 0 : repos.length} />
              <StatBox label="CERTS"    value="15+" />
              <StatBox label="CAFFEINE" value="∞ ☕" />
            </motion.div>
          </motion.div>

          {/* Right — code block */}
          <div className="hidden lg:block">
            <HeroCodeBlock repoCount={repos.length} />
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-0 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          transition={{ delay: 2.0 }}
        >
          <motion.div
            className="w-5 h-9 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: "1.5px solid var(--border)" }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              className="w-1 h-1.5 rounded-full"
              style={{ background: "var(--neon)" }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── SKILLS ─────────────────────────────────────────────── */}
      <div className="mb-28">
        <SectionHeading
          description="Technologies and tools I work with daily."
          eyebrow="Stack"
          title="Skills & Tools"
        />
        <SkillsGlobe />
      </div>

      {/* ── CONTENT SECTIONS ───────────────────────────────────── */}
      <div className="space-y-28 pb-28">
        <Section>
          <SectionHeading
            description="Selected work and experiments I've been building."
            eyebrow="Work"
            title="Latest Projects"
          />
          <FeaturedProjects />
        </Section>

        <Section id="certificates">
          <SectionHeading
            description="Professional certifications and credentials."
            eyebrow="Credentials"
            title="Certifications"
          />
          <Certificates />
        </Section>

        <Section id="repositories">
          <SectionHeading
            description="Public projects and open-source work on GitHub."
            eyebrow="Open Source"
            title="Repositories"
          />
          <Repositories />
        </Section>
      </div>
    </DefaultLayout>
  );
}
