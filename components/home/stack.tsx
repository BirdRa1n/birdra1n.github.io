// components/home/stack.tsx
// Seção fixada: o scroll vertical vira deslocamento horizontal dos
// cards de stack. Com reduced-motion vira uma grade comum.
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { IconType } from "react-icons";
import {
  SiDocker,
  SiFigma,
  SiFramer,
  SiGit,
  SiGithubactions,
  SiJavascript,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiSupabase,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
} from "react-icons/si";

import { Reveal } from "@/components/motion";
import { useI18n } from "@/i18n";

type GroupKey = "frontend" | "backend" | "mobile" | "tooling";

const GROUPS: { key: GroupKey; tint: string; skills: { name: string; Icon: IconType; color: string }[] }[] = [
  {
    key: "frontend",
    tint: "#61DAFB",
    skills: [
      { name: "React", Icon: SiReact, color: "#61DAFB" },
      { name: "Next.js", Icon: SiNextdotjs, color: "currentColor" },
      { name: "TypeScript", Icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { name: "Tailwind CSS", Icon: SiTailwindcss, color: "#06B6D4" },
      { name: "Framer Motion", Icon: SiFramer, color: "#8B5CF6" },
    ],
  },
  {
    key: "backend",
    tint: "#3ECF8E",
    skills: [
      { name: "Node.js", Icon: SiNodedotjs, color: "#68A063" },
      { name: "Supabase", Icon: SiSupabase, color: "#3ECF8E" },
      { name: "PostgreSQL", Icon: SiPostgresql, color: "#6B9FCE" },
      { name: "Python", Icon: SiPython, color: "#FFD43B" },
    ],
  },
  {
    key: "mobile",
    tint: "#FA7343",
    skills: [
      { name: "Swift", Icon: SiSwift, color: "#FA7343" },
      { name: "SwiftUI", Icon: SiSwift, color: "#0A84FF" },
      { name: "React Native", Icon: SiReact, color: "#61DAFB" },
    ],
  },
  {
    key: "tooling",
    tint: "#A78BFA",
    skills: [
      { name: "Git", Icon: SiGit, color: "#F05032" },
      { name: "GitHub Actions", Icon: SiGithubactions, color: "#2088FF" },
      { name: "Docker", Icon: SiDocker, color: "#2496ED" },
      { name: "Vercel", Icon: SiVercel, color: "currentColor" },
      { name: "Figma", Icon: SiFigma, color: "#F24E1E" },
    ],
  },
];

function GroupCard({ group, index }: { group: (typeof GROUPS)[number]; index: number }) {
  const { t } = useI18n();

  return (
    <article className="surface relative overflow-hidden shrink-0 w-[82vw] sm:w-[460px] h-[min(46svh,420px)] min-h-[300px] p-7 sm:p-9 flex flex-col">
      <div
        aria-hidden
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
        style={{ background: group.tint }}
      />
      <p className="font-mono text-[13px] text-faint">0{index + 1}</p>
      <h3 className="display-sm mt-2">{t.home.stackGroups[group.key]}</h3>
      <ul className="mt-auto flex flex-wrap gap-2.5">
        {group.skills.map(({ name, Icon, color }) => (
          <li
            key={name}
            className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl bg-[var(--bg-subtle)] text-[15px] font-medium tracking-[-0.01em]"
          >
            <Icon aria-hidden color={color} size={18} />
            {name}
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function Stack() {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;

      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };

    measure();
    window.addEventListener("resize", measure);

    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);

  const header = (
    <div className="container-x">
      <Reveal>
        <p className="eyebrow">{t.home.stackEyebrow}</p>
        <h2 className="display-lg mt-3 max-w-[14ch]">{t.home.stackTitle}</h2>
        <p className="lead mt-5 max-w-[42ch]">{t.home.stackLead}</p>
      </Reveal>
    </div>
  );

  if (reduce) {
    return (
      <section className="section-y">
        {header}
        <div className="container-x mt-12 grid gap-5 md:grid-cols-2">
          {GROUPS.map((g, i) => (
            <GroupCard key={g.key} group={g} index={i} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative"
      // altura proporcional ao quanto há para rolar na horizontal
      style={{ height: `calc(100vh + ${distance}px + 40vh)` }}
    >
      <div className="sticky top-0 h-[100svh] flex flex-col justify-center gap-10 overflow-hidden pt-14">
        {header}
        <motion.div
          ref={trackRef}
          className="flex gap-5 px-5 md:px-[max(40px,calc((100vw-1200px)/2+40px))] w-max"
          style={{ x }}
        >
          {GROUPS.map((g, i) => (
            <GroupCard key={g.key} group={g} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
