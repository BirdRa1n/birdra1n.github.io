// components/home/skills-globe.tsx
import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiFramer,
  SiNodedotjs, SiSupabase, SiPostgresql, SiJavascript,
  SiSwift, SiGit, SiVercel, SiDocker, SiGithubactions, SiPython, SiFigma,
} from "react-icons/si";
import type { IconType } from "react-icons";

interface Skill {
  name: string;
  Icon: IconType;
  color: string;
}

const SKILLS: Skill[] = [
  { name: "React",       Icon: SiReact,         color: "#61DAFB" },
  { name: "Next.js",     Icon: SiNextdotjs,      color: "#E2E8F0" },
  { name: "TypeScript",  Icon: SiTypescript,     color: "#3178C6" },
  { name: "Tailwind",    Icon: SiTailwindcss,    color: "#06B6D4" },
  { name: "Framer",      Icon: SiFramer,         color: "#8B5CF6" },
  { name: "JavaScript",  Icon: SiJavascript,     color: "#F7DF1E" },
  { name: "Node.js",     Icon: SiNodedotjs,      color: "#68A063" },
  { name: "Supabase",    Icon: SiSupabase,       color: "#3ECF8E" },
  { name: "PostgreSQL",  Icon: SiPostgresql,     color: "#6b9fce" },
  { name: "Swift",       Icon: SiSwift,          color: "#FA7343" },
  { name: "Python",      Icon: SiPython,         color: "#FFD43B" },
  { name: "Docker",      Icon: SiDocker,         color: "#2496ED" },
  { name: "Git",         Icon: SiGit,            color: "#F05032" },
  { name: "Vercel",      Icon: SiVercel,         color: "#E2E8F0" },
  { name: "GH Actions",  Icon: SiGithubactions,  color: "#2088FF" },
  { name: "Figma",       Icon: SiFigma,          color: "#F24E1E" },
];

const RADIUS = 155;

// Fibonacci sphere: distributes N points evenly on a unit sphere
function fibPositions(count: number, rotY: number) {
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  return Array.from({ length: count }, (_, i) => {
    const y  = 1 - (i / (count - 1)) * 2;
    const r  = Math.sqrt(1 - y * y);
    const θ  = phi * i + rotY;
    const x  = r * Math.cos(θ);
    const z  = r * Math.sin(θ);
    const depth = (z + 1) / 2; // 0 = back, 1 = front
    return { x, y, depth };
  });
}

/* ─── Globe SVG ──────────────────────────────────────────────── */
const GlobeSVG = () => (
  <svg fill="none" height="210" viewBox="-105 -105 210 210" width="210">
    <defs>
      <radialGradient cx="38%" cy="35%" id="globeFill" r="65%">
        <stop offset="0%"   stopColor="#2D2640" />
        <stop offset="100%" stopColor="#09080F" />
      </radialGradient>
      <filter height="150%" id="centerGlow" width="150%" x="-25%" y="-25%">
        <feGaussianBlur result="blur" stdDeviation="4" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>

    {/* Outer ambient rings */}
    <circle opacity="0.04" r="100" stroke="#A78BFA" strokeWidth="10" />
    <circle opacity="0.10" r="93"  stroke="#A78BFA" strokeWidth="1"  />

    {/* Globe fill */}
    <circle fill="url(#globeFill)" r="88" />

    {/* Latitude lines */}
    <ellipse cx="0" cy="-58" opacity="0.16" rx="88" ry="7"  stroke="#A78BFA" strokeWidth="0.4" />
    <ellipse cx="0" cy="-33" opacity="0.22" rx="88" ry="14" stroke="#A78BFA" strokeWidth="0.45" />
    <ellipse cx="0" cy="0"   opacity="0.30" rx="88" ry="18" stroke="#A78BFA" strokeWidth="0.55" />
    <ellipse cx="0" cy="33"  opacity="0.22" rx="88" ry="14" stroke="#A78BFA" strokeWidth="0.45" />
    <ellipse cx="0" cy="58"  opacity="0.16" rx="88" ry="7"  stroke="#A78BFA" strokeWidth="0.4"  />

    {/* Longitude lines */}
    <ellipse opacity="0.16" rx="5"  ry="88" stroke="#A78BFA" strokeWidth="0.4" />
    <ellipse opacity="0.18" rx="44" ry="88" stroke="#A78BFA" strokeWidth="0.4" />
    <ellipse opacity="0.14" rx="74" ry="88" stroke="#A78BFA" strokeWidth="0.35" />

    {/* Globe border */}
    <circle opacity="0.45" r="88" stroke="#A78BFA" strokeWidth="0.8" />

    {/* Specular highlight */}
    <ellipse cx="-22" cy="-30" fill="white" opacity="0.05" rx="30" ry="18" />

    {/* Pulsing center */}
    <circle fill="#A78BFA" filter="url(#centerGlow)" opacity="0.6" r="3" />
  </svg>
);

/* ─── Main component ─────────────────────────────────────────── */
export default function SkillsGlobe() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const pillRefs  = useRef<(HTMLDivElement | null)[]>([]);
  const angleRef  = useRef(0);
  const rafRef    = useRef<number>(0);
  const pausedRef = useRef(false);

  const inView = useInView(wrapRef, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView) return;

    const tick = () => {
      if (!pausedRef.current) angleRef.current += 0.0035;

      fibPositions(SKILLS.length, angleRef.current).forEach((pos, i) => {
        const el = pillRefs.current[i];
        if (!el) return;

        const scale   = (0.5 + pos.depth * 0.6).toFixed(3);
        const opacity = Math.max(0.08, 0.15 + pos.depth * 0.85).toFixed(3);
        const x       = (pos.x * RADIUS).toFixed(1);
        const y       = (pos.y * RADIUS).toFixed(1);

        el.style.transform     = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
        el.style.opacity       = opacity;
        el.style.zIndex        = String(Math.round(pos.depth * 100));
        el.style.pointerEvents = pos.depth > 0.45 ? "auto" : "none";
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [inView]);

  return (
    <div
      ref={wrapRef}
      className="relative flex items-center justify-center"
      style={{ height: 380 }}
      onMouseEnter={() => { pausedRef.current = true;  }}
      onMouseLeave={() => { pausedRef.current = false; }}
    >
      {/* Globe */}
      <div className="absolute pointer-events-none select-none">
        <GlobeSVG />
      </div>

      {/* Skill pills */}
      {SKILLS.map((skill, i) => (
        <div
          key={skill.name}
          ref={(el) => { pillRefs.current[i] = el; }}
          className="absolute left-1/2 top-1/2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full select-none whitespace-nowrap"
          style={{
            opacity: 0,
            background:   "var(--bg-card)",
            border:       "1px solid var(--border)",
            fontFamily:   "var(--font-mono)",
            fontSize:     "11px",
            color:        "var(--text-primary)",
            boxShadow:    "0 2px 10px rgba(0,0,0,0.2)",
            transition:   "background 0.2s, border-color 0.2s, box-shadow 0.2s",
            cursor:       "default",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background   = "var(--bg-card-alt)";
            el.style.borderColor  = "var(--neon-dim)";
            el.style.boxShadow    = "0 0 0 1px var(--neon-glow), 0 4px 20px var(--neon-glow)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background   = "var(--bg-card)";
            el.style.borderColor  = "var(--border)";
            el.style.boxShadow    = "0 2px 10px rgba(0,0,0,0.2)";
          }}
        >
          <skill.Icon color={skill.color} size={13} />
          <span>{skill.name}</span>
        </div>
      ))}
    </div>
  );
}
