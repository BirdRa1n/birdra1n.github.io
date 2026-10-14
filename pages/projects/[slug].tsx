// pages/projects/[slug].tsx
import { motion, useScroll, useTransform } from "framer-motion";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { FiExternalLink, FiGithub } from "react-icons/fi";

import { Markdown } from "@/components/markdown";
import { EASE_OUT, Reveal } from "@/components/motion";
import { BackLink, StateMessage, TranslationNotice } from "@/components/page";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchProject, incrementProjectViews } from "@/utils/content";
import { safeUrl } from "@/utils/safe-url";

export default function ProjectPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const { t } = useI18n();
  const { data: project, loading, error, reload } = useLocalizedData(
    (locale, signal) => fetchProject(slug, locale, signal),
    [slug],
    { enabled: Boolean(slug) },
  );

  const artRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: artRef, offset: ["start end", "end start"] });
  const artScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const iconY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  // Conta a visualização uma vez por slug (não a cada troca de idioma)
  const countedRef = useRef<string | null>(null);

  useEffect(() => {
    if (project && countedRef.current !== slug) {
      countedRef.current = slug;
      incrementProjectViews(slug);
    }
  }, [project, slug]);

  if (loading && !project) {
    return (
      <DefaultLayout>
        <div className="container-x pt-40 pb-32 space-y-5">
          <div className="ui-skeleton h-14 w-2/3" />
          <div className="ui-skeleton h-5 w-1/2" />
          <div className="ui-skeleton h-[50vh] !rounded-[28px] mt-10" />
        </div>
      </DefaultLayout>
    );
  }

  if (error || !project) {
    return (
      <DefaultLayout title={t.projects.notFound}>
        <div className="container-x pt-32">
          <StateMessage
            action={
              error ? (
                <button className="btn btn-ghost btn-sm" type="button" onClick={reload}>
                  {t.common.retry}
                </button>
              ) : (
                <NextLink className="btn btn-ghost btn-sm" href="/projects">
                  {t.projects.backTo}
                </NextLink>
              )
            }
            detail={error}
            title={error ? t.common.loadError : t.projects.notFound}
          />
        </div>
      </DefaultLayout>
    );
  }

  const demo = safeUrl(project.demo_url);
  const repo = safeUrl(project.repo_url);

  return (
    <DefaultLayout description={project.description ?? undefined} title={project.title}>
      <article>
        <header className="relative overflow-hidden pt-32 md:pt-40">
          <div aria-hidden className="aurora opacity-40" />
          <div className="container-x relative">
            <BackLink href="/projects" label={t.projects.backTo} />
            <motion.h1
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              className="display-xl mt-8"
              initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
              transition={{ duration: 1, ease: EASE_OUT }}
            >
              {project.title}
            </motion.h1>
            {project.description && (
              <motion.p
                animate={{ opacity: 1, y: 0 }}
                className="lead mt-6 max-w-[48ch]"
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.9, delay: 0.1, ease: EASE_OUT }}
              >
                {project.description}
              </motion.p>
            )}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex flex-wrap items-center gap-3"
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.9, delay: 0.2, ease: EASE_OUT }}
            >
              {demo && (
                <a className="btn btn-solid" href={demo} rel="noopener noreferrer" target="_blank">
                  <FiExternalLink size={16} /> {t.projects.demo}
                </a>
              )}
              {repo && (
                <a className="btn btn-ghost" href={repo} rel="noopener noreferrer" target="_blank">
                  <FiGithub size={16} /> {t.projects.repo}
                </a>
              )}
              <span className="text-[14px] text-faint ml-1">{t.common.views(project.views_count)}</span>
            </motion.div>
          </div>
        </header>

        {/* Arte do projeto: cresce ao entrar e o ícone flutua em parallax */}
        <div ref={artRef} className="container-x mt-14 md:mt-20">
          <motion.div
            className="relative overflow-hidden rounded-[32px] bg-[var(--bg-subtle)] h-[min(62vh,560px)] grid place-items-center origin-center"
            style={{ scale: artScale }}
          >
            {project.thumbnail_url ? (
              <>
                <img
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover scale-150 blur-3xl opacity-60 saturate-150"
                  src={project.thumbnail_url}
                />
                <motion.img
                  alt={project.title}
                  className="relative w-36 h-36 md:w-52 md:h-52 rounded-[28%] object-cover shadow-[0_40px_80px_-20px_rgba(0,0,0,0.55)]"
                  src={project.thumbnail_url}
                  style={{ y: iconY }}
                />
              </>
            ) : (
              <span className="display-xl text-gradient">{project.title.slice(0, 1)}</span>
            )}
          </motion.div>
        </div>

        <div className="container-narrow py-20 md:py-28">
          <div className="flex flex-wrap items-center gap-2 mb-10">
            <TranslationNotice autoTranslated={project.auto_translated} contentLocale={project.locale} />
          </div>

          {project.tech_stack.length > 0 && (
            <Reveal className="mb-14">
              <p className="text-[13px] font-medium text-faint mb-3">{t.projects.stack}</p>
              <ul className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {project.content && (
            <Reveal>
              <Markdown source={project.content} />
            </Reveal>
          )}
        </div>
      </article>
    </DefaultLayout>
  );
}
