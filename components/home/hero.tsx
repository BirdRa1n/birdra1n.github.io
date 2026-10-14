// components/home/hero.tsx
// Hero fixo (sticky) por 2 telas: o título recua e some enquanto a
// "janela" de código sobe e assume o centro — transição contínua,
// guiada pelo scroll, no estilo das páginas de produto da Apple.
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import NextLink from "next/link";
import { useRef } from "react";
import { FiArrowDown } from "react-icons/fi";

import { EASE_OUT } from "@/components/motion";
import { useI18n } from "@/i18n";

const C = {
  kw: "#FF7B72",
  key: "#79C0FF",
  str: "#A5D6FF",
  num: "#F8C555",
  cmt: "#6A737D",
  bool: "#C4B5FD",
  def: "#E6EDF3",
};

function CodeWindow({ repoCount }: { repoCount: number }) {
  const line = (k: string, v: React.ReactNode) => (
    <>
      <span style={{ color: C.def }}>{"  "}</span>
      <span style={{ color: C.key }}>{k}</span>
      <span style={{ color: C.def }}>: </span>
      {v}
      <span style={{ color: C.def }}>{",\n"}</span>
    </>
  );
  const s = (v: string) => <span style={{ color: C.str }}>{`"${v}"`}</span>;

  return (
    <div
      className="w-full rounded-[22px] overflow-hidden border text-left"
      style={{
        background: "#0B0B10",
        borderColor: "rgba(255,255,255,0.1)",
        boxShadow: "0 40px 120px -30px rgba(76, 29, 149, 0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
      }}
    >
      <div className="flex items-center gap-2 px-4 h-11 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
        <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
        <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-xs font-mono" style={{ color: "#8B8B99" }}>
          developer.ts
        </span>
      </div>
      <pre className="p-5 sm:p-7 text-[12px] sm:text-[14px] leading-[1.85] font-mono overflow-x-auto m-0">
        <span style={{ color: C.cmt }}>{"// BirdRa1n — dev config\n"}</span>
        <span style={{ color: C.kw }}>export const </span>
        <span style={{ color: C.key }}>developer</span>
        <span style={{ color: C.def }}>{" = {\n"}</span>
        {line("name", s("Dário Jr"))}
        {line("location", s("Brazil"))}
        {line(
          "stack",
          <>
            <span style={{ color: C.def }}>[</span>
            {s("Swift")}
            <span style={{ color: C.def }}>, </span>
            {s("TypeScript")}
            <span style={{ color: C.def }}>, </span>
            {s("React")}
            <span style={{ color: C.def }}>, </span>
            {s("Supabase")}
            <span style={{ color: C.def }}>]</span>
          </>,
        )}
        {line("repos", <span style={{ color: C.num }}>{repoCount || "…"}</span>)}
        {line("openToWork", <span style={{ color: C.bool }}>true</span>)}
        {line("coffee", <span style={{ color: C.num }}>Infinity</span>)}
        <span style={{ color: C.def }}>{"};"}</span>
      </pre>
    </div>
  );
}

export default function Hero({ repoCount }: { repoCount: number }) {
  const { t } = useI18n();
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Título: recua, sobe e some na primeira metade
  const titleScale = useTransform(scrollYProgress, [0, 0.45], [1, 0.88]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.45], ["0vh", "-12vh"]);
  // Janela: sobe do rodapé até o centro e cresce
  const windowY = useTransform(scrollYProgress, [0.05, 0.6], ["72vh", "0vh"]);
  const windowScale = useTransform(scrollYProgress, [0.05, 0.6, 1], [0.78, 1, 1.04]);
  const windowOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0.4, 1]);
  // Luz ambiente acompanha
  const auroraScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const auroraOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: reduce ? "auto" : "220vh" }}>
      <div className={`${reduce ? "relative py-32" : "sticky top-0 h-[100svh]"} overflow-hidden`}>
        <motion.div aria-hidden className="absolute inset-0" style={{ scale: auroraScale, opacity: auroraOpacity }}>
          <div className="aurora" />
          <div className="absolute inset-0 grid-fade opacity-60" />
        </motion.div>

        {/* Título */}
        <motion.div
          className="relative z-10 h-full flex flex-col items-center justify-center text-center container-x"
          style={reduce ? undefined : { scale: titleScale, opacity: titleOpacity, y: titleY }}
        >
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="chip mb-8"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            <span className="relative flex w-2 h-2">
              <span className="absolute inset-0 rounded-full bg-[#28C840] ping-slow" />
              <span className="relative w-2 h-2 rounded-full bg-[#28C840]" />
            </span>
            {t.home.eyebrow}
          </motion.p>

          <h1 className="display-xl max-w-[12ch]">
            <motion.span
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="block"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE_OUT }}
            >
              {t.home.heroTitleA}
            </motion.span>
            <motion.span
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="block text-gradient pb-[0.08em]"
              initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
              transition={{ duration: 1.1, delay: 0.25, ease: EASE_OUT }}
            >
              {t.home.heroTitleB}
            </motion.span>
          </h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="lead mt-7 max-w-[36ch]"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE_OUT }}
          >
            {t.home.heroLead}
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.9, delay: 0.6, ease: EASE_OUT }}
          >
            <NextLink className="btn btn-solid" href="#work">
              {t.home.ctaWork}
            </NextLink>
            <NextLink className="btn btn-ghost" href="/contact">
              {t.home.ctaContact}
            </NextLink>
          </motion.div>
        </motion.div>

        {/* Janela de código que assume o palco */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none container-x"
            style={{ y: windowY, scale: windowScale, opacity: windowOpacity }}
          >
            <div className="w-full max-w-[680px]">
              <CodeWindow repoCount={repoCount} />
            </div>
          </motion.div>
        )}

        {!reduce && (
          <motion.div
            className="absolute bottom-8 inset-x-0 z-10 flex flex-col items-center gap-2 text-[13px] text-faint"
            style={{ opacity: hintOpacity }}
          >
            <span>{t.home.scroll}</span>
            <motion.span
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <FiArrowDown size={16} />
            </motion.span>
          </motion.div>
        )}
      </div>
    </section>
  );
}
