// pages/admin/index.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFolder, FiFileText, FiMail, FiAward, FiSmartphone, FiEye, FiTrendingUp, FiClock } from "react-icons/fi";
import NextLink from "next/link";

import AdminLayout from "@/layouts/admin";
import { useAdminAuth } from "@/contexts/admin-auth";
import supabase from "@/utils/supabase/client";

interface Stats {
  projects: number;
  posts: number;
  newMessages: number;
  certificates: number;
  apps: number;
  totalViews: number;
  recentPosts: any[];
  recentMessages: any[];
}

const StatCard = ({ label, value, icon: Icon, href, color = "var(--neon)", delay = 0 }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
  >
    <NextLink
      href={href}
      className="block rounded-sm p-5 group transition-all"
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = color; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${color}18`; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-sm flex items-center justify-center" style={{ background: `${color}12`, border: `1px solid ${color}30` }}>
          <Icon size={18} style={{ color }} />
        </div>
        <span className="text-[10px] opacity-30 group-hover:opacity-60 transition-opacity" style={{ fontFamily: "var(--font-mono)" }}>↗</span>
      </div>
      <p className="text-3xl font-extrabold mb-1" style={{ fontFamily: "var(--font-display)", color }}>
        {value}
      </p>
      <p className="text-xs tracking-widest uppercase opacity-40" style={{ fontFamily: "var(--font-mono)" }}>{label}</p>
    </NextLink>
  </motion.div>
);

export default function AdminDashboard() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          { count: projects },
          { count: posts },
          { count: newMessages },
          { count: certificates },
          { count: apps },
          { data: recentPosts },
          { data: recentMessages },
          { data: viewsData },
        ] = await Promise.all([
          supabase.schema("portfolio").from("projects").select("*", { count: "exact", head: true }),
          supabase.schema("blog").from("posts").select("*", { count: "exact", head: true }),
          supabase.schema("portfolio").from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
          supabase.schema("portfolio").from("certificates").select("*", { count: "exact", head: true }),
          supabase.schema("store").from("apps").select("*", { count: "exact", head: true }),
          supabase.schema("blog").from("posts").select("id,title,slug,status,created_at").order("created_at", { ascending: false }).limit(5),
          supabase.schema("portfolio").from("contact_messages").select("id,name,email,subject,status,created_at").order("created_at", { ascending: false }).limit(5),
          supabase.schema("portfolio").from("projects").select("views_count"),
        ]);

        const totalViews = (viewsData || []).reduce((acc: number, p: any) => acc + (p.views_count || 0), 0);

        setStats({
          projects: projects || 0,
          posts: posts || 0,
          newMessages: newMessages || 0,
          certificates: certificates || 0,
          apps: apps || 0,
          totalViews,
          recentPosts: recentPosts || [],
          recentMessages: recentMessages || [],
        });
      } catch (e) {
        void e;
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-10">
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <p className="text-xs tracking-[0.3em] mb-2" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)", opacity: 0.6 }}>
            {"// dashboard"}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
            {greeting}, {admin?.name?.split(" ")[0] || "Admin"} 👋
          </h1>
          <p className="text-sm opacity-40 mt-1" style={{ fontFamily: "var(--font-mono)" }}>
            {new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </motion.div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
            <StatCard label="Projetos" value={stats?.projects} icon={FiFolder} href="/admin/projects" delay={0} />
            <StatCard label="Posts" value={stats?.posts} icon={FiFileText} href="/admin/blog" delay={0.05} />
            <StatCard label="Mensagens" value={stats?.newMessages} icon={FiMail} href="/admin/contact" color="#FF9500" delay={0.1} />
            <StatCard label="Certificados" value={stats?.certificates} icon={FiAward} href="/admin/certificates" color="var(--cyan)" delay={0.15} />
            <StatCard label="Apps" value={stats?.apps} icon={FiSmartphone} href="/admin/apps" color="var(--acid)" delay={0.2} />
          </div>

          {/* Total views banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex items-center gap-4 px-6 py-4 rounded-sm mb-10"
            style={{ background: "color-mix(in srgb, var(--neon) 5%, transparent)", border: "1px solid color-mix(in srgb, var(--neon) 15%, transparent)" }}
          >
            <FiEye size={18} style={{ color: "var(--neon)" }} />
            <span className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              Total de views em projetos:{" "}
              <span style={{ color: "var(--neon)", fontWeight: "bold" }}>{stats?.totalViews.toLocaleString()}</span>
            </span>
            <div className="ml-auto flex items-center gap-1">
              <FiTrendingUp size={13} style={{ color: "var(--neon)", opacity: 0.5 }} />
            </div>
          </motion.div>

          {/* Recent activity grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent posts */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold tracking-widest uppercase opacity-60" style={{ fontFamily: "var(--font-mono)" }}>
                  Posts Recentes
                </h2>
                <NextLink href="/admin/blog" className="text-[10px] tracking-widest opacity-40 hover:opacity-80" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>
                  VER TODOS →
                </NextLink>
              </div>
              <div className="space-y-2">
                {stats?.recentPosts.length === 0 && (
                  <p className="text-xs opacity-30 py-4 text-center" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhum post ainda"}</p>
                )}
                {stats?.recentPosts.map((post: any) => (
                  <NextLink
                    key={post.id}
                    href={`/admin/blog/${post.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm transition-all"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                  >
                    <FiFileText size={13} style={{ color: "var(--neon)", opacity: 0.5, flexShrink: 0 }} />
                    <span className="flex-1 text-xs truncate" style={{ fontFamily: "var(--font-body)" }}>{post.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-sm`} style={{
                      fontFamily: "var(--font-mono)",
                      background: post.status === "published" ? "color-mix(in srgb, var(--neon) 10%, transparent)" : "rgba(255,149,0,0.1)",
                      color: post.status === "published" ? "var(--neon)" : "#FF9500",
                      border: `1px solid ${post.status === "published" ? "color-mix(in srgb, var(--neon) 20%, transparent)" : "rgba(255,149,0,0.2)"}`,
                    }}>
                      {post.status}
                    </span>
                  </NextLink>
                ))}
              </div>
            </motion.div>

            {/* Recent messages */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold tracking-widest uppercase opacity-60" style={{ fontFamily: "var(--font-mono)" }}>
                  Mensagens Recentes
                </h2>
                <NextLink href="/admin/contact" className="text-[10px] tracking-widest opacity-40 hover:opacity-80" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>
                  VER TODAS →
                </NextLink>
              </div>
              <div className="space-y-2">
                {stats?.recentMessages.length === 0 && (
                  <p className="text-xs opacity-30 py-4 text-center" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhuma mensagem ainda"}</p>
                )}
                {stats?.recentMessages.map((msg: any) => (
                  <NextLink
                    key={msg.id}
                    href={`/admin/contact`}
                    className="flex items-center gap-3 px-4 py-3 rounded-sm transition-all"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
                  >
                    <div className="w-7 h-7 rounded-sm flex items-center justify-center flex-shrink-0 text-[10px] font-bold" style={{ background: "color-mix(in srgb, var(--neon) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--neon) 15%, transparent)", color: "var(--neon)", fontFamily: "var(--font-mono)" }}>
                      {msg.name[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ fontFamily: "var(--font-body)" }}>{msg.name}</p>
                      <p className="text-[10px] opacity-40 truncate" style={{ fontFamily: "var(--font-mono)" }}>{msg.subject}</p>
                    </div>
                    {msg.status === "new" && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "var(--neon)", boxShadow: "0 0 6px var(--neon)" }} />
                    )}
                  </NextLink>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick actions */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
            <h2 className="text-sm font-bold tracking-widest uppercase opacity-60 mb-4" style={{ fontFamily: "var(--font-mono)" }}>Ações Rápidas</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { label: "NOVO_PROJETO", href: "/admin/projects/new" },
                { label: "NOVO_POST", href: "/admin/blog/new" },
                { label: "NOVO_APP", href: "/admin/apps/new" },
              ].map(({ label, href }) => (
                <NextLink
                  key={href}
                  href={href}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all"
                  style={{
                    fontFamily: "var(--font-mono)",
                    border: "1px solid var(--neon)",
                    color: "var(--neon)",
                    clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "color-mix(in srgb, var(--neon) 8%, transparent)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  + {label}
                </NextLink>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AdminLayout>
  );
}
