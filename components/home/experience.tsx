// components/home/experience.tsx
// Linha do tempo profissional + formação e certificações.
// A linha vertical se preenche de amarelo conforme o leitor rola.
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useRef, useState } from "react";
import { FiAward, FiBookOpen } from "react-icons/fi";

import { EASE_OUT, Reveal } from "@/components/motion";
import { useCertificates } from "@/contexts/certificates";
import { useI18n } from "@/i18n";
import type { ExperienceItem } from "@/utils/content";
import { safeUrl } from "@/utils/safe-url";

const VISIBLE_HIGHLIGHTS = 3;

function monthsBetween(start: string, end: string | null) {
  const a = new Date(start);
  const b = end ? new Date(end) : new Date();

  return Math.max(1, (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) + 1);
}

function Period({ item }: { item: ExperienceItem }) {
  const { t, formatDate } = useI18n();
  const fmt = (d: string) => formatDate(d, { month: "short", year: "numeric" });
  const months = monthsBetween(item.start_date, item.end_date);

  return (
    <p className="text-[14px] text-faint">
      <time dateTime={item.start_date}>{fmt(item.start_date)}</time>
      {" — "}
      {item.end_date ? <time dateTime={item.end_date}>{fmt(item.end_date)}</time> : t.home.present}
      {item.kind === "work" && (
        <>
          <span aria-hidden> · </span>
          {t.home.duration(Math.floor(months / 12), months % 12)}
        </>
      )}
    </p>
  );
}

function Job({ item, index }: { item: ExperienceItem; index: number }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const current = !item.end_date;
  const extra = item.highlights.length - VISIBLE_HIGHLIGHTS;
  const shown = open ? item.highlights : item.highlights.slice(0, VISIBLE_HIGHLIGHTS);

  return (
    <motion.li
      className="relative pl-10 md:pl-14 pb-14 last:pb-0"
      initial={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.8, delay: index * 0.04, ease: EASE_OUT }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full border-2 border-[var(--bg)]"
        style={{
          background: current ? "var(--accent-fill)" : "var(--fg-faint)",
          boxShadow: current ? "0 0 0 5px var(--accent-soft)" : "none",
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Period item={item} />
        {current && <span className="chip chip-accent !py-0.5 !text-[12px]">{t.home.current}</span>}
      </div>
      <h3 className="display-sm mt-2">{item.role}</h3>
      <p className="mt-1 text-[16px] text-muted">
        {item.organization}
        {item.location ? ` · ${item.location}` : ""}
      </p>

      {shown.length > 0 && (
        <ul className="mt-4 space-y-2.5 max-w-[68ch]">
          <AnimatePresence initial={false}>
            {shown.map((h) => (
              <motion.li
                key={h}
                animate={{ opacity: 1, height: "auto" }}
                className="relative pl-5 text-[16px] leading-relaxed text-muted overflow-hidden"
                exit={{ opacity: 0, height: 0 }}
                initial={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
              >
                <span aria-hidden className="absolute left-0 top-[0.7em] w-1.5 h-1.5 rounded-full bg-[var(--accent-fill)]" />
                {h}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
      {extra > 0 && (
        <button className="mt-3 text-[14px] font-medium text-[var(--accent)] hover:underline underline-offset-4" type="button" onClick={() => setOpen((v) => !v)}>
          {open ? t.home.showLess : t.home.showMore(extra)}
        </button>
      )}

      {item.tech.length > 0 && (
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {item.tech.map((tech) => (
            <li key={tech} className="chip !text-[12px] !py-0.5">
              {tech}
            </li>
          ))}
        </ul>
      )}
    </motion.li>
  );
}

export default function Experience({ items, loading }: { items: ExperienceItem[]; loading: boolean }) {
  const { t, formatDate } = useI18n();
  const { certificates } = useCertificates();
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  const jobs = items.filter((i) => i.kind === "work");
  const education = items.filter((i) => i.kind === "education");

  return (
    <section className="section-y scroll-mt-14" id="experience">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">{t.home.experienceEyebrow}</p>
            <h2 className="display-lg mt-3 max-w-[12ch]">{t.home.experienceTitle}</h2>
          </Reveal>
        </div>

        {loading && jobs.length === 0 ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="ui-skeleton h-40 !rounded-[20px]" />
            ))}
          </div>
        ) : (
          <ol ref={listRef} className="relative">
            <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--line-strong)]" />
            <motion.span
              aria-hidden
              className="absolute left-[7px] top-2 bottom-2 w-px origin-top bg-[var(--accent-fill)]"
              style={{ scaleY: fill }}
            />
            {jobs.map((job, i) => (
              <Job key={job.id} index={i} item={job} />
            ))}
          </ol>
        )}
      </div>

      {/* Formação + certificações */}
      <div className="container-x mt-20 md:mt-28 grid gap-5 md:grid-cols-2">
        <Reveal className="surface p-7 sm:p-9">
          <h3 className="flex items-center gap-2.5 display-sm">
            <FiBookOpen className="text-[var(--accent)]" size={20} /> {t.home.educationTitle}
          </h3>
          <ul className="mt-6 space-y-6">
            {education.map((e) => (
              <li key={e.id}>
                <p className="font-semibold tracking-[-0.01em] text-[17px]">{e.role}</p>
                <p className="text-[15px] text-muted">{e.organization}</p>
                <Period item={e} />
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="surface p-7 sm:p-9" delay={0.08}>
          <h3 className="flex items-center gap-2.5 display-sm">
            <FiAward className="text-[var(--accent)]" size={20} /> {t.home.certsTitle}
          </h3>
          <ul className="mt-6 divide-y divide-[var(--line)]">
            {certificates.map((c) => {
              const href = safeUrl(c.url);
              const body = (
                <>
                  <span className="min-w-0">
                    <span className="block font-semibold tracking-[-0.01em] text-[16px] truncate">{c.title}</span>
                    <span className="block text-[14px] text-muted truncate">{c.organization?.name}</span>
                  </span>
                  <span className="shrink-0 text-[14px] text-faint tabular-nums">
                    {formatDate(c.emission, { year: "numeric" })}
                  </span>
                </>
              );

              return (
                <li key={c.id}>
                  {href ? (
                    <a className="flex items-center justify-between gap-4 py-3.5 hover:text-[var(--accent)] transition-colors" href={href} rel="noopener noreferrer" target="_blank">
                      {body}
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-4 py-3.5">{body}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
