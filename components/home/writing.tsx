// components/home/writing.tsx
import { motion } from "framer-motion";
import NextLink from "next/link";

import { EASE_OUT, Reveal } from "@/components/motion";
import { useI18n } from "@/i18n";
import type { PostSummary } from "@/utils/content";

export function PostCard({ post, index = 0, large = false }: { post: PostSummary; index?: number; large?: boolean }) {
  const { t, formatDate } = useI18n();

  return (
    <motion.article
      className="h-full"
      initial={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.08, ease: EASE_OUT }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <NextLink
        className={`surface surface-hover group flex h-full overflow-hidden ${large ? "flex-col md:flex-row" : "flex-col"}`}
        href={`/blog/${post.slug}`}
      >
        <div
          className={`relative overflow-hidden bg-[var(--bg-subtle)] ${large ? "aspect-[16/10] md:aspect-auto md:w-[55%]" : "aspect-[16/10]"}`}
        >
          {post.cover_url ? (
            <img
              alt=""
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
              loading="lazy"
              src={post.cover_url}
            />
          ) : (
            <div aria-hidden className="absolute inset-0 opacity-60" style={{ background: "var(--grad)" }} />
          )}
        </div>
        <div className={`flex flex-col p-6 sm:p-7 ${large ? "md:p-10 md:flex-1" : "flex-1"}`}>
          <div className="flex flex-wrap items-center gap-2 text-[13px] text-faint">
            {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
            {post.read_time_min ? (
              <>
                <span aria-hidden>·</span>
                <span>{t.common.minRead(post.read_time_min)}</span>
              </>
            ) : null}
          </div>
          <h3 className={`mt-3 font-display font-semibold tracking-[-0.025em] leading-[1.15] ${large ? "text-[clamp(1.6rem,2.6vw,2.25rem)]" : "text-[21px]"}`}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p className={`mt-3 text-muted leading-relaxed ${large ? "text-[17px] line-clamp-4" : "text-[15px] line-clamp-3"}`}>
              {post.excerpt}
            </p>
          )}
          {post.tags.length > 0 && (
            <ul className="mt-auto pt-6 flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <li key={tag.id} className="chip !text-[12px] !py-0.5">
                  {tag.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </NextLink>
    </motion.article>
  );
}

export default function Writing({ posts, loading }: { posts: PostSummary[]; loading: boolean }) {
  const { t } = useI18n();

  if (!loading && posts.length === 0) return null;

  return (
    <section className="section-y">
      <div className="container-x">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.home.writingEyebrow}</p>
            <h2 className="display-lg mt-3 max-w-[16ch]">{t.home.writingTitle}</h2>
            <p className="lead mt-5">{t.home.writingLead}</p>
          </div>
          <NextLink className="link-arrow shrink-0" href="/blog">
            {t.common.viewAll} <span className="arrow">→</span>
          </NextLink>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {loading && posts.length === 0
            ? Array.from({ length: 3 }).map((_, i) => <div key={i} className="ui-skeleton h-[420px] !rounded-[28px]" />)
            : posts.map((post, i) => <PostCard key={post.id} index={i} post={post} />)}
        </div>
      </div>
    </section>
  );
}
