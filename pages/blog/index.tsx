// pages/blog/index.tsx
import { PostCard } from "@/components/home/writing";
import { PageIntro, StateMessage } from "@/components/page";
import { useLocalizedData } from "@/hooks/useLocalizedData";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import { fetchPosts } from "@/utils/content";

export default function BlogPage() {
  const { t } = useI18n();
  const { data, loading, error, reload } = useLocalizedData((locale, signal) => fetchPosts(locale, { signal }));
  const posts = data ?? [];
  // Destaque: o post marcado como featured mais recente, senão o mais recente
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== lead);

  return (
    <DefaultLayout title={t.blog.title}>
      <PageIntro eyebrow={t.blog.eyebrow} lead={t.blog.lead} title={t.blog.title} />

      <section className="container-x pb-32">
        {loading && posts.length === 0 ? (
          <div className="space-y-5">
            <div className="ui-skeleton h-[420px] !rounded-[28px]" />
            <div className="grid gap-5 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="ui-skeleton h-[400px] !rounded-[28px]" />
              ))}
            </div>
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
        ) : posts.length === 0 ? (
          <StateMessage title={t.blog.empty} />
        ) : (
          <>
            {lead && <PostCard large post={lead} />}
            {rest.length > 0 && (
              <>
                <h2 className="display-sm mt-20 mb-8">{t.blog.latest}</h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post, i) => (
                    <PostCard key={post.id} index={i} post={post} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </DefaultLayout>
  );
}
