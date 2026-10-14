// components/home/work.tsx
// Cards de projeto empilhados: cada card gruda no topo e, conforme o
// próximo sobe por cima, o anterior recua (escala + escurece).
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import NextLink from "next/link";
import { useRef } from "react";

import { Reveal } from "@/components/motion";
import { useI18n } from "@/i18n";
import type { ProjectSummary } from "@/utils/content";

function ProjectArt({ project }: { project: ProjectSummary }) {
  return (
    <div className="relative h-full min-h-[220px] overflow-hidden rounded-[22px] bg-[var(--bg-subtle)] grid place-items-center">
      {project.thumbnail_url ? (
        <>
          <img
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover scale-150 blur-3xl opacity-50 saturate-150"
            src={project.thumbnail_url}
          />
          <img
            alt={project.title}
            className="relative w-28 h-28 sm:w-40 sm:h-40 rounded-[28%] object-cover shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            loading="lazy"
            src={project.thumbnail_url}
          />
        </>
      ) : (
        <span className="display-lg text-gradient">{project.title.slice(0, 1)}</span>
      )}
    </div>
  );
}

function StackedCard({
  project,
  index,
  total,
  progress,
}: {
  project: ProjectSummary;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const { t } = useI18n();
  const start = index / total;
  const targetScale = 1 - (total - 1 - index) * 0.045;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const dim = useTransform(progress, [start, Math.min(1, start + 1 / total)], [0, index === total - 1 ? 0 : 0.55]);

  return (
    <div className="sticky top-0 h-[100svh] flex items-center justify-center">
      <motion.article
        className="group relative w-full origin-top surface overflow-hidden shadow-[var(--shadow-lg)]"
        style={{ scale, top: `calc(${index * 18}px)` }}
      >
        <NextLink
          className="grid md:grid-cols-[1.05fr_1fr] gap-6 md:gap-10 p-5 sm:p-8 md:p-10 min-h-[min(68vh,580px)]"
          href={`/projects/${project.slug}`}
        >
          <div className="flex flex-col order-2 md:order-1">
            <p className="font-mono text-[13px] text-faint">
              {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h3 className="display-md mt-3">{project.title}</h3>
            {project.description && (
              <p className="mt-4 text-[17px] leading-relaxed text-muted max-w-[46ch]">{project.description}</p>
            )}
            {project.tech_stack.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {project.tech_stack.slice(0, 6).map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            )}
            <span className="link-arrow mt-auto pt-8">
              {t.common.viewProject} <span className="arrow">→</span>
            </span>
          </div>
          <div className="order-1 md:order-2">
            <ProjectArt project={project} />
          </div>
        </NextLink>
        <motion.div aria-hidden className="absolute inset-0 bg-[var(--bg)] pointer-events-none" style={{ opacity: dim }} />
      </motion.article>
    </div>
  );
}

export default function Work({ projects, loading }: { projects: ProjectSummary[]; loading: boolean }) {
  const { t } = useI18n();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="relative pt-[clamp(96px,14vw,180px)]" id="work">
      <div className="container-x">
        <Reveal>
          <p className="eyebrow">{t.home.workEyebrow}</p>
          <h2 className="display-lg mt-3 max-w-[16ch]">{t.home.workTitle}</h2>
          <p className="lead mt-5">{t.home.workLead}</p>
        </Reveal>
      </div>

      {loading && projects.length === 0 ? (
        <div className="container-x mt-12">
          <div className="ui-skeleton h-[60vh] !rounded-[28px]" />
        </div>
      ) : (
        <div ref={ref} className="container-x relative">
          {projects.map((p, i) => (
            <StackedCard key={p.id} index={i} progress={scrollYProgress} project={p} total={projects.length} />
          ))}
        </div>
      )}

      <div className="container-x pb-8 flex justify-center">
        <NextLink className="btn btn-ghost" href="/projects">
          {t.common.viewAll} →
        </NextLink>
      </div>
    </section>
  );
}
