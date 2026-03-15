// pages/blog/index.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { FiClock, FiEye, FiTag } from "react-icons/fi";

import DefaultLayout from "@/layouts/default";
import supabase from "@/utils/supabase/client";
import { BlogPost } from "@/utils/supabase/typed-client";

const PostCard = ({ post, index }: { post: BlogPost; index: number }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
  >
    <NextLink
      href={`/blog/${post.slug}`}
      className="group flex flex-col md:flex-row gap-5 p-5 rounded-sm cursor-pointer overflow-hidden"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)", transition: "border-color 0.25s, box-shadow 0.25s" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,255,135,0.08)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      {post.cover_url && (
        <div className="w-full md:w-48 h-32 md:h-auto rounded-sm overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--border)" }}>
          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {post.featured && (
              <span className="text-[9px] px-2 py-0.5 tracking-widest" style={{ fontFamily: "var(--font-mono)", background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.2)", color: "var(--neon)" }}>
                DESTAQUE
              </span>
            )}
            {((post as any).tags as any[])?.slice(0, 3).map((t: any) => (
              <span key={t.tag?.id} className="tag-chip">{t.tag?.name}</span>
            ))}
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2 group-hover:text-[var(--neon)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
            {post.title}
          </h2>
          {post.excerpt && (
            <p className="text-sm opacity-50 leading-relaxed line-clamp-2" style={{ fontFamily: "var(--font-body)" }}>
              {post.excerpt}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3">
          {post.read_time_min && (
            <span className="flex items-center gap-1 text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
              <FiClock size={10} /> {post.read_time_min} min
            </span>
          )}
          <span className="flex items-center gap-1 text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
            <FiEye size={10} /> {post.views_count}
          </span>
          <span className="text-[10px] opacity-30 ml-auto" style={{ fontFamily: "var(--font-mono)" }}>
            {post.published_at ? new Date(post.published_at).toLocaleDateString("pt-BR") : ""}
          </span>
          <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}>LER →</span>
        </div>
      </div>
    </NextLink>
  </motion.article>
);

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .schema("blog" as any)
      .from("posts")
      .select("*, tags:post_tags(tag:tags(*))")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .then(({ data }) => {
        setPosts((data || []) as any[]);
        setLoading(false);
      });
  }, []);

  return (
    <DefaultLayout>
      <section className="max-w-3xl mx-auto py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-xs tracking-[0.3em] opacity-50" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>05</span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3" style={{ fontFamily: "var(--font-display)" }}>
            Blog
          </h1>
          <p className="text-sm opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
            {"// Pensamentos, tutoriais e descobertas sobre dev"}
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-36 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 opacity-30">
            <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhum post ainda — em breve!"}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post, i) => <PostCard key={post.id} post={post} index={i} />)}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
