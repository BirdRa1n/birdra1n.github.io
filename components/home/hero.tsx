// components/home/hero.tsx
// Primeira dobra pensada para recrutador: quem é, o que faz, onde está,
// há quanto tempo, e como baixar o currículo/entrar em contato.
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import NextLink from "next/link";
import { useRef } from "react";
import { FiBriefcase, FiDownload, FiGithub, FiLinkedin, FiMail, FiMapPin } from "react-icons/fi";

import { EASE_OUT } from "@/components/motion";
import { profile, yearsOfExperience } from "@/config/profile";
import { resumeDownloadUrl, useResume } from "@/hooks/useResume";
import { useI18n } from "@/i18n";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE_OUT },
});

export default function Hero() {
  const { t } = useI18n();
  const { resume } = useResume();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 80]);
  const ringScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);

  const social = [
    { label: "LinkedIn", href: profile.linkedin, Icon: FiLinkedin },
    { label: "GitHub", href: profile.github, Icon: FiGithub },
    { label: profile.email, href: `mailto:${profile.email}`, Icon: FiMail },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden pt-24 md:pt-28">
      <div aria-hidden className="aurora opacity-80" />

      <div className="container-x relative grid items-center gap-6 md:gap-10 md:grid-cols-[1.1fr_0.9fr] min-h-[calc(100svh-56px)] pb-10">
        <div className="order-2 md:order-1 pb-6">
          {profile.openToWork && (
            <motion.p {...rise(0)} className="chip mb-7">
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#28C840] ping-slow" />
                <span className="relative w-2 h-2 rounded-full bg-[#28C840]" />
              </span>
              {t.home.available}
            </motion.p>
          )}

          <motion.p {...rise(0.05)} className="text-[clamp(1.1rem,1.6vw,1.35rem)] text-muted">
            {t.home.greeting}
          </motion.p>
          <motion.h1 {...rise(0.1)} className="display-xl mt-1">
            {profile.displayName}
            <span className="text-[var(--accent-fill)]">.</span>
          </motion.h1>
          <motion.p {...rise(0.18)} className="display-sm mt-3 text-muted !font-medium">
            {t.home.role}
          </motion.p>

          <motion.ul {...rise(0.24)} className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[15px] text-muted">
            <li className="flex items-center gap-1.5">
              <FiMapPin className="text-[var(--accent)]" size={15} />
              {profile.location} · {t.home.remote}
            </li>
            <li className="flex items-center gap-1.5">
              <FiBriefcase className="text-[var(--accent)]" size={15} />
              {t.home.years(yearsOfExperience())}
            </li>
          </motion.ul>

          <motion.p {...rise(0.3)} className="lead mt-6 max-w-[54ch]">
            {t.home.pitch}
          </motion.p>

          <motion.div {...rise(0.38)} className="mt-9 flex flex-wrap items-center gap-3">
            {resume && (
              <a className="btn btn-accent" href={resumeDownloadUrl(resume)} rel="noopener noreferrer" target="_blank">
                <FiDownload size={16} /> {t.common.downloadCv}
              </a>
            )}
            <NextLink className="btn btn-ghost" href="#contact">
              {t.home.ctaContact}
            </NextLink>
            <span aria-hidden className="hidden sm:block w-px h-6 bg-[var(--line-strong)] mx-1" />
            <ul className="flex items-center gap-1">
              {social.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    aria-label={label}
                    className="ui-icon-btn !w-11 !h-11"
                    href={href}
                    rel="noopener noreferrer"
                    target={href.startsWith("mailto:") ? undefined : "_blank"}
                    title={label}
                  >
                    <Icon size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Retrato: P&B com contorno amarelo, base dissolvendo no fundo */}
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="order-1 md:order-2 relative mx-auto w-full max-w-[230px] sm:max-w-[320px] md:max-w-[520px]"
          initial={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 1.2, ease: EASE_OUT }}
        >
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[86%] aspect-square rounded-full"
            style={{
              scale: ringScale,
              background: "radial-gradient(circle at 50% 40%, var(--accent-soft), transparent 70%)",
              border: "1px solid color-mix(in srgb, var(--accent-fill) 35%, transparent)",
            }}
          />
          <motion.img
            alt={t.home.portraitAlt}
            className="relative w-full h-auto select-none"
            draggable={false}
            height={894}
            src={profile.portrait}
            style={{
              y: portraitY,
              // vinheta: cabeça nítida, ombros e cortes da foto se dissolvem no fundo
              maskImage: "radial-gradient(ellipse 62% 78% at 50% 32%, #000 62%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(ellipse 62% 78% at 50% 32%, #000 62%, transparent 100%)",
            }}
            width={896}
          />
        </motion.div>
      </div>
    </section>
  );
}
