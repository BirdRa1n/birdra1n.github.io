// pages/projects/index.tsx
import { motion } from "framer-motion";
import NextLink from "next/link";

import { EASE_OUT } from "@/components/motion";
import { PageIntro, StateMessage } from "@/components/page";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchProjects, type ProjectSummary } from "@/utils/content";

function ProjectTile({ project, index }: { project: ProjectSummary; index: number }) {
  const { t } = useI18n();

  return (
    <motion.li
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.9, delay: (index % 2) * 0.1, ease: EASE_OUT }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <NextLink className="surface surface-hover group flex flex-col h-full overflow-hidden" href={`/projects/${project.slug}`}>
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-subtle)] grid place-items-center">
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
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-[28%] object-cover shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                loading="lazy"
                src={project.thumbnail_url}
              />
            </>
          ) : (
            <span className="display-lg text-gradient">{project.title.slice(0, 1)}</span>
          )}
          {project.featured && <span className="chip chip-accent absolute top-4 left-4">{t.common.featured}</span>}
        </div>
        <div className="flex flex-col flex-1 p-7">
          <h2 className="display-sm">{project.title}</h2>
          {project.description && <p className="mt-3 text-[16px] text-muted leading-relaxed line-clamp-3">{project.description}</p>}
          {project.tech_stack.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.tech_stack.slice(0, 5).map((tech) => (
                <li key={tech} className="chip !text-[12px] !py-0.5">
                  {tech}
                </li>
              ))}
            </ul>
          )}
          <span className="link-arrow mt-auto pt-6">
            {t.common.viewProject} <span className="arrow">→</span>
          </span>
        </div>
      </NextLink>
    </motion.li>
  );
}

export default function ProjectsPage() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useLocalizedData((locale, signal) => fetchProjects(locale, { signal }));
  const projects = data ?? [];

  return (
    <DefaultLayout title={t.projects.title}>
      <PageIntro eyebrow={t.projects.eyebrow} lead={t.projects.lead} title={t.projects.title} />

      <section className="container-x pb-32">
        {loading && projects.length === 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="ui-skeleton h-[480px] !rounded-[28px]" />
            ))}
          </div>
        ) : error ? (
          <StateMessage
            action={
              <button className="btn btn-ghost btn-sm" type="button" onClick={reload}>
                {t.common.retry}
              </button>
            }
            detail={error}
            title={t.common.loadError}
          />
        ) : projects.length === 0 ? (
          <StateMessage title={t.projects.empty} />
        ) : (
          <ul className="grid gap-5 md:grid-cols-2">
            {projects.map((p, i) => (
              <ProjectTile key={p.id} index={i} project={p} />
            ))}
          </ul>
        )}
      </section>
    </DefaultLayout>
  );
}
