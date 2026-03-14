// pages/index.tsx
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import NextLink from "next/link";

import { GithubIcon } from "@/components/icons";
import Certificates from "@/components/home/certificates";
import FeaturedProjects from "@/components/home/featured-projects";
import Repositories from "@/components/home/repos";
import { siteConfig } from "@/config/site";
import { useReposContext } from "@/contexts/repos";
import DefaultLayout from "@/layouts/default";

// Typewriter hook
function useTypewriter(texts: string[], speed = 80, pause = 2000) {
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
          if (charIndex + 1 === current.length) {
            setTimeout(() => setDeleting(true), pause);
          } else {
            setCharIndex((c) => c + 1);
          }
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

// Section wrapper with reveal animation
const Section = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.section
      ref={ref}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      className="w-full"
      id={id}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
};

// Section heading component
const SectionHeading = ({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle: string;
}) => (
  <div className="mb-10">
    <div className="flex items-center gap-4 mb-3">
      <span
        className="text-xs tracking-[0.3em] opacity-50"
        style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
      >
        {index}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
    <h2
      className="text-3xl font-bold tracking-tight mb-2"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {title}
    </h2>
    <p
      className="text-sm opacity-50"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {subtitle}
    </p>
  </div>
);

export default function IndexPage() {
  const { repos, fetchingRepos } = useReposContext();
  const roles = [
    "Full-Stack Developer",
    "Front-End Engineer",
    "Back-End Engineer",
    "Open Source Contributor",
  ];
  const role = useTypewriter(roles, 70, 2200);

  return (
    <DefaultLayout>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative flex flex-col justify-center min-h-[80vh] py-16">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(var(--neon) 1px, transparent 1px), linear-gradient(90deg, var(--neon) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 max-w-4xl">
          {/* Pre-title */}
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-6"
            initial={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
          >
            <span
              className="text-xs tracking-[0.4em] uppercase"
              style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            >
              Hello, World
            </span>
            <span
              className="inline-block w-8 h-px"
              style={{
                background: "var(--neon)",
                boxShadow: "0 0 8px var(--neon)",
              }}
            />
          </motion.div>

          {/* Name */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1
              className="text-6xl sm:text-7xl lg:text-8xl font-extrabold leading-none tracking-tighter mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dário Jr
            </h1>
            <div
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-none tracking-tighter"
              style={{
                fontFamily: "var(--font-display)",
                WebkitTextStroke: "2px var(--neon)",
                color: "transparent",
                textShadow: "0 0 40px rgba(0,255,135,0.15)",
              }}
            >
              BirdRa1n
            </div>
          </motion.div>

          {/* Typewriter role */}
          <motion.div
            animate={{ opacity: 1 }}
            className="mt-6 flex items-center gap-2"
            initial={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span
              className="text-lg sm:text-xl"
              style={{
                fontFamily: "var(--font-mono)",
                color: "var(--neon)",
                opacity: 0.7,
              }}
            >
              ~$
            </span>
            <span
              className="text-lg sm:text-xl"
              style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            >
              {role}
              <span className="cursor-blink opacity-80">▌</span>
            </span>
          </motion.div>

          {/* Bio */}
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-base leading-relaxed max-w-2xl opacity-60"
            initial={{ opacity: 0, y: 20 }}
            style={{ fontFamily: "var(--font-body)" }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Tech enthusiast and developer with experience in front-end and
            back-end development. Focused on creating exceptional digital
            solutions and improving the user experience through clean code and
            thoughtful design.
          </motion.p>

          {/* CTAs */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <NextLink
              className="group flex items-center gap-3 px-6 py-3 font-semibold text-sm tracking-wider transition-all duration-300"
              href="#repositories"
              style={{
                fontFamily: "var(--font-mono)",
                background: "var(--neon)",
                color: "#05080F",
                clipPath:
                  "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                boxShadow: "0 0 24px rgba(0,255,135,0.4)",
              }}
            >
              VIEW_WORK
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </NextLink>

            <a
              className="group flex items-center gap-3 px-6 py-3 text-sm tracking-wider transition-all duration-300"
              href={siteConfig.links.github}
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)",
                border: "1px solid var(--neon)",
                color: "var(--neon)",
                clipPath:
                  "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
              }}
              target="_blank"
            >
              <GithubIcon size={16} />
              GITHUB
              {!fetchingRepos && (
                <span className="text-xs opacity-50">[{repos.length}]</span>
              )}
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ opacity: 1 }}
          className="absolute bottom-8 left-0 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          transition={{ delay: 1.2 }}
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase opacity-30 rotate-90 mb-6"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            className="w-px h-10 opacity-30"
            style={{ background: "linear-gradient(var(--neon), transparent)" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        </motion.div>
      </section>

      {/* ── CONTENT SECTIONS ────────────────────────────── */}
      <div className="space-y-28 pb-24">
        <Section>
          <SectionHeading
            index="01"
            subtitle="// recent_work.ts"
            title="Latest Projects"
          />
          <FeaturedProjects />
        </Section>

        <Section id="certificates">
          <SectionHeading
            index="02"
            subtitle="// professional_credentials.ts"
            title="Certifications"
          />
          <Certificates />
        </Section>

        <Section id="repositories">
          <SectionHeading
            index="03"
            subtitle="// open_source.ts"
            title="Repositories"
          />
          <Repositories />
        </Section>
      </div>
    </DefaultLayout>
  );
}
