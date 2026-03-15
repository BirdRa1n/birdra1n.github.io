// pages/admin/apps/index.tsx
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiSmartphone, FiCopy, FiCheck } from "react-icons/fi";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminButton, StatusBadge, ConfirmDialog } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { StoreApp } from "@/utils/supabase/typed-client";

export default function AdminAppsPage() {
  const [apps, setApps] = useState<StoreApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sourceUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/altstore/source.json`
    : "/api/altstore/source.json";

  const fetchApps = async () => {
    setLoading(true);
    const { data } = await supabase
      .schema("store" as any)
      .from("apps")
      .select("*, versions:app_versions(*)")
      .order("created_at", { ascending: false });
    setApps((data || []) as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.schema("store" as any).from("apps").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchApps();
  };

  const copySourceUrl = () => {
    navigator.clipboard.writeText(sourceUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Apps"
        subtitle="// store.apps — AltStore Source"
        actions={
          <NextLink href="/admin/apps/new">
            <AdminButton><FiPlus size={13} /> NOVO APP</AdminButton>
          </NextLink>
        }
      />

      {/* AltStore source URL banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 px-5 py-4 rounded-sm mb-6"
        style={{ background: "rgba(0,229,255,0.05)", border: "1px solid rgba(0,229,255,0.2)" }}
      >
        <FiSmartphone size={16} style={{ color: "var(--cyan-neon)", flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-widest uppercase opacity-50 mb-0.5" style={{ fontFamily: "var(--font-mono)" }}>AltStore Source URL</p>
          <p className="text-xs truncate" style={{ fontFamily: "var(--font-mono)", color: "var(--cyan-neon)" }}>{sourceUrl}</p>
        </div>
        <button
          onClick={copySourceUrl}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-sm transition-all flex-shrink-0"
          style={{
            fontFamily: "var(--font-mono)",
            background: "rgba(0,229,255,0.1)",
            border: "1px solid rgba(0,229,255,0.2)",
            color: "var(--cyan-neon)",
          }}
        >
          {copied ? <FiCheck size={12} /> : <FiCopy size={12} />}
          {copied ? "COPIADO!" : "COPIAR"}
        </button>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-40 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : apps.length === 0 ? (
        <div className="text-center py-24 opacity-30">
          <FiSmartphone size={32} className="mx-auto mb-4" />
          <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>// Nenhum app ainda</p>
          <NextLink href="/admin/apps/new" className="inline-block mt-4 text-xs" style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}>
            + Adicionar primeiro app →
          </NextLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-sm overflow-hidden group"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", transition: "border-color 0.25s, box-shadow 0.25s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,255,135,0.08)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  {app.icon_url ? (
                    <img src={app.icon_url} alt={app.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" style={{ border: "1px solid var(--border)" }} />
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: "rgba(0,229,255,0.1)", border: "1px solid rgba(0,229,255,0.2)" }}>
                      <FiSmartphone size={22} style={{ color: "var(--cyan-neon)" }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-bold text-sm truncate" style={{ fontFamily: "var(--font-display)" }}>{app.name}</h3>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-[10px] opacity-40 truncate" style={{ fontFamily: "var(--font-mono)" }}>{app.bundle_id}</p>
                    {app.is_beta && (
                      <span className="inline-block text-[9px] px-1.5 py-0.5 mt-1 rounded-sm" style={{ background: "rgba(255,149,0,0.1)", border: "1px solid rgba(255,149,0,0.2)", color: "#FF9500", fontFamily: "var(--font-mono)" }}>BETA</span>
                    )}
                  </div>
                </div>

                <p className="text-xs opacity-40 line-clamp-2 mb-3" style={{ fontFamily: "var(--font-body)" }}>
                  {app.subtitle || app.description || "Sem descrição"}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
                      iOS {app.min_ios_version}+
                    </span>
                    {(app.versions as any[])?.length > 0 && (
                      <span className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
                        v{(app.versions as any[])[0]?.version}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <NextLink href={`/admin/apps/${app.id}`} className="p-1.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity" style={{ background: "rgba(0,255,135,0.08)" }}>
                      <FiEdit2 size={13} style={{ color: "var(--neon)" }} />
                    </NextLink>
                    <button className="p-1.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity" style={{ background: "rgba(255,85,85,0.08)" }} onClick={() => setDeleteId(app.id)}>
                      <FiTrash2 size={13} style={{ color: "#ff5555" }} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deletar App"
        message="Tem certeza? Esta ação também removerá todas as versões do app."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
