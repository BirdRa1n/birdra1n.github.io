// pages/blog/[slug].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { FiClock, FiEye, FiArrowLeft, FiShare2, FiAlertTriangle } from "react-icons/fi";
import dynamic from "next/dynamic";

import DefaultLayout from "@/layouts/default";
import supabase from "@/utils/supabase/client";
import { BlogPost } from "@/utils/supabase/typed-client";

const MDPreview = dynamic(
  () => import("@uiw/react-md-editor").then(m => m.default.Markdown),
  { ssr: false }
);

export default function BlogPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [mentionedProjects, setMentionedProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        // Query 1: post + tags (mesmo schema "blog")
        const { data, error: queryError } = await supabase
          .schema("blog" as any)
          .from("posts")
          .select("*, tags:post_tags(tag:tags(*))")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (queryError) {
          if (queryError.code === "PGRST116") {
            setNotFound(true);
          } else {
            console.error("[BlogPost] fetch error:", queryError.message);
            setError(queryError.message);
          }
          return;
        }

        if (!data) {
          setNotFound(true);
          return;
        }

        setPost(data as any);

        // Query 2: busca os IDs dos projetos mencionados
        const { data: mentions, error: mentionsError } = await supabase
          .schema("blog" as any)
          .from("post_project_mentions")
          .select("project_id")
          .eq("post_id", data.id);

        if (!mentionsError && mentions && mentions.length > 0) {
          const projectIds = mentions.map((m: any) => m.project_id);

          // Query 3: busca os projetos no schema portfolio separadamente
          const { data: projects, error: projectsError } = await supabase
            .schema("portfolio" as any)
            .from("projects")
            .select("id, title, slug, thumbnail_url")
            .in("id", projectIds);

          if (!projectsError && projects) {
            setMentionedProjects(projects);
          }
        }

        // Incrementa views de forma silenciosa
        Promise.resolve(
          supabase.rpc("increment_post_views", { post_slug: slug })
        ).catch(() => { });

      } catch (err: any) {
        console.error("[BlogPost] fetch exception:", err);
        setError(err?.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return (
    <DefaultLayout>
      <div className="max-w-3xl mx-auto py-20 space-y-4">
        <div className="h-12 w-2/3 rounded-sm animate-pulse" style={{ background: "var(--bg-card)" }} />
        <div className="h-4 w-1/3 rounded-sm animate-pulse" style={{ background: "var(--bg-card)" }} />
        <div className="h-96 rounded-sm animate-pulse mt-8" style={{ background: "var(--bg-card)" }} />
      </div>
    </DefaultLayout>
  );

  if (error) return (
    <DefaultLayout>
      <div className="max-w-3xl mx-auto py-20 text-center">
        <FiAlertTriangle size={32} className="mx-auto mb-4" style={{ color: "#FF9500", opacity: 0.6 }} />
        <p className="text-sm font-bold mb-2 opacity-60" style={{ fontFamily: "var(--font-mono)" }}>{"// Erro ao carregar post"}</p>
        <p className="text-xs opacity-40 mb-6" style={{ fontFamily: "var(--font-mono)" }}>{error}</p>
        <NextLink href="/blog" className="inline-block text-xs" style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}>
          ← VOLTAR AO BLOG
        </NextLink>
      </div>
    </DefaultLayout>
  );

  if (notFound) return (
    <DefaultLayout>
      <div className="max-w-3xl mx-auto py-20 text-center opacity-40">
        <p className="text-xl font-bold mb-2" style={{ fontFamily: "var(--font-mono)" }}>{"// 404"}</p>
        <p className="text-sm opacity-60" style={{ fontFamily: "var(--font-mono)" }}>Post não encontrado</p>
        <NextLink href="/blog" className="inline-block mt-6 text-xs" style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}>
          ← VOLTAR AO BLOG
        </NextLink>
      </div>
    </DefaultLayout>
  );

  if (!post) return null;

  return (
    <DefaultLayout>
      <article className="max-w-3xl mx-auto py-12 md:py-20">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="mb-8">
          <NextLink
            href="/blog"
            className="inline-flex items-center gap-2 text-xs opacity-40 hover:opacity-80 transition-opacity"
            style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
          >
            <FiArrowLeft size={12} /> BLOG
          </NextLink>
        </motion.div>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          {((post as any).tags as any[])?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {((post as any).tags as any[]).map((t: any) => (
                <span key={t.tag?.id} className="tag-chip">{t.tag?.name}</span>
              ))}
            </div>
          )}

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight" style={{ fontFamily: "var(--font-display)" }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base opacity-50 leading-relaxed mb-5" style={{ fontFamily: "var(--font-body)" }}>
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-4 py-4" style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
            <span className="text-xs opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
              {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" }) : ""}
            </span>
            {post.read_time_min && (
              <span className="flex items-center gap-1 text-xs opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
                <FiClock size={11} /> {post.read_time_min} min de leitura
              </span>
            )}
            <span className="flex items-center gap-1 text-xs opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
              <FiEye size={11} /> {post.views_count} views
            </span>
            <button
              className="ml-auto opacity-30 hover:opacity-60 transition-opacity"
              onClick={() => navigator.share?.({ title: post.title ?? "", url: window.location.href })}
            >
              <FiShare2 size={14} />
            </button>
          </div>
        </motion.header>

        {/* Cover */}
        {post.cover_url && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-10 rounded-sm overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            <img src={post.cover_url} alt={post.title ?? ""} className="w-full h-64 object-cover" />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          data-color-mode="dark"
          className="prose-custom"
          style={{
            "--color-canvas-default": "transparent",
            "--color-border-default": "var(--border)",
            "--color-fg-default": "var(--text-primary)",
          } as any}
        >
          <MDPreview
            source={post.content ?? ""}
            style={{
              background: "transparent",
              color: "inherit",
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          />
        </motion.div>

        {/* Mentioned projects */}
        {mentionedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-14 pt-10"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <h3 className="text-xs tracking-widest uppercase mb-4 opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
              {"// Projetos Mencionados"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {mentionedProjects.map((project: any) => (
                <NextLink
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-sm group transition-all"
                  style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                >
                  {project.thumbnail_url && (
                    <img src={project.thumbnail_url} alt="" className="w-10 h-10 rounded-sm object-cover flex-shrink-0" />
                  )}
                  <span className="text-sm font-semibold group-hover:text-[var(--neon)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                    {project.title}
                  </span>
                  <span className="ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}>→</span>
                </NextLink>
              ))}
            </div>
          </motion.div>
        )}
      </article>
    </DefaultLayout>
  );
}