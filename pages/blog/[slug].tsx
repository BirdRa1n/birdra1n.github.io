// pages/blog/[slug].tsx
import { motion, useScroll, useTransform } from "framer-motion";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiShare2 } from "react-icons/fi";

import { Markdown } from "@/components/markdown";
import { EASE_OUT, Reveal, ScrollProgress } from "@/components/motion";
import { BackLink, StateMessage, TranslationNotice } from "@/components/page";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchPost, incrementPostViews } from "@/utils/content";

function ShareButton({ title }: { title: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;

    if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});

      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem permissão de clipboard */
    }
  };

  return (
    <button className="btn btn-ghost btn-sm" type="button" onClick={share}>
      {copied ? <FiCheck size={14} /> : <FiShare2 size={14} />}
      {copied ? t.common.copied : t.common.share}
    </button>
  );
}

export default function BlogPostPage() {
  const router = useRouter();
  const slug = typeof router.query.slug === "string" ? router.query.slug : "";
  const { t, formatDate } = useI18n();
  const { data: post, loading, error, reload } = useLocalizedData(
    (locale, signal) => fetchPost(slug, locale, signal),
    [slug],
    { enabled: Boolean(slug) },
  );

  const coverRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: coverRef, offset: ["start end", "end start"] });
  const coverY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const coverScale = useTransform(scrollYProgress, [0, 0.5], [0.94, 1]);

  const countedRef = useRef<string | null>(null);

  useEffect(() => {
    if (post && countedRef.current !== slug) {
      countedRef.current = slug;
      incrementPostViews(slug);
    }
  }, [post, slug]);

  if (loading && !post) {
    return (
      <DefaultLayout>
        <div className="container-narrow pt-40 pb-32 space-y-5">
          <div className="ui-skeleton h-12 w-full" />
          <div className="ui-skeleton h-12 w-2/3" />
          <div className="ui-skeleton h-5 w-1/2 mt-6" />
        </div>
      </DefaultLayout>
    );
  }

  if (error || !post) {
    return (
      <DefaultLayout title={t.blog.notFound}>
        <div className="container-x pt-32">
          <StateMessage
            action={
              error ? (
                <button className="btn btn-ghost btn-sm" type="button" onClick={reload}>
                  {t.common.retry}
                </button>
              ) : (
                <NextLink className="btn btn-ghost btn-sm" href="/blog">
                  {t.blog.backTo}
                </NextLink>
              )
            }
            detail={error}
            title={error ? t.common.loadError : t.blog.notFound}
          />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout description={post.excerpt ?? undefined} title={post.title}>
      <ScrollProgress />
      <article>
        <header className="container-narrow pt-32 md:pt-40">
          <BackLink href="/blog" label={t.blog.backTo} />

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-faint"
            initial={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
          >
            {post.published_at && (
              <time dateTime={post.published_at}>
                {formatDate(post.published_at, { day: "numeric", month: "long", year: "numeric" })}
              </time>
            )}
            {post.read_time_min ? (
              <>
                <span aria-hidden>·</span>
                <span>{t.common.minRead(post.read_time_min)}</span>
              </>
            ) : null}
            <span aria-hidden>·</span>
            <span>{t.common.views(post.views_count)}</span>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            className="display-lg mt-4"
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            transition={{ duration: 1, delay: 0.05, ease: EASE_OUT }}
          >
            {post.title}
          </motion.h1>

          {post.excerpt && (
            <motion.p
              animate={{ opacity: 1, y: 0 }}
              className="lead mt-6"
              initial={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
            >
              {post.excerpt}
            </motion.p>
          )}

          <motion.div
            animate={{ opacity: 1 }}
            className="mt-8 flex flex-wrap items-center gap-2"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
          >
            {post.tags.map((tag) => (
              <span key={tag.id} className="chip">
                {tag.name}
              </span>
            ))}
            <span className="ml-auto">
              <ShareButton title={post.title} />
            </span>
          </motion.div>
        </header>

        {post.cover_url && (
          <div ref={coverRef} className="container-x mt-14 md:mt-20">
            <motion.div
              className="relative overflow-hidden rounded-[32px] aspect-[16/9] bg-[var(--bg-subtle)]"
              style={{ scale: coverScale }}
            >
              <motion.img
                alt=""
                className="absolute inset-0 w-full h-[116%] -top-[8%] object-cover"
                src={post.cover_url}
                style={{ y: coverY }}
              />
            </motion.div>
          </div>
        )}

        <div className="container-narrow py-16 md:py-24">
          <div className="mb-10">
            <TranslationNotice autoTranslated={post.auto_translated} contentLocale={post.locale} />
          </div>

          <Markdown source={post.content} />

          {post.projects.length > 0 && (
            <Reveal className="mt-20 pt-12 border-t hairline">
              <h2 className="display-sm mb-6">{t.blog.mentioned}</h2>
              <ul className="grid gap-4 sm:grid-cols-2">
                {post.projects.map((project) => (
                  <li key={project.id}>
                    <NextLink
                      className="surface surface-hover flex items-center gap-4 p-4 !rounded-[20px]"
                      href={`/projects/${project.slug}`}
                    >
                      {project.thumbnail_url ? (
                        <img alt="" className="w-14 h-14 rounded-[28%] object-cover shrink-0" src={project.thumbnail_url} />
                      ) : (
                        <span className="w-14 h-14 rounded-[28%] bg-[var(--bg-subtle)] shrink-0" />
                      )}
                      <span className="min-w-0">
                        <span className="block font-semibold tracking-[-0.01em]">{project.title}</span>
                        {project.description && (
                          <span className="block text-[13px] text-muted line-clamp-1">{project.description}</span>
                        )}
                      </span>
                      <span aria-hidden className="ml-auto text-faint">
                        →
                      </span>
                    </NextLink>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}
        </div>
      </article>
    </DefaultLayout>
  );
}
