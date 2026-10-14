// pages/projects/index.tsx
import { PageIntro, StateMessage } from "@/components/page";
import { ProjectCard } from "@/components/project-card";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchProjects } from "@/utils/content";

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
              <ProjectCard key={p.id} index={i} project={p} />
            ))}
          </ul>
        )}
      </section>
    </DefaultLayout>
  );
}
