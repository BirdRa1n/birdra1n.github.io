// pages/admin/apps/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiSave, FiPlus, FiTrash2, FiX } from "react-icons/fi";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, AdminCard, ConfirmDialog } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { AppVersion } from "@/utils/supabase/typed-client";

export default function AdminAppEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [deleteVersionId, setDeleteVersionId] = useState<string | null>(null);
  const [showAddVersion, setShowAddVersion] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    name: "", bundle_id: "", developer: "BirdRa1n", subtitle: "", description: "",
    icon_url: "", category: "utilities", min_ios_version: "15.0",
    is_beta: false, featured: false, status: "draft" as "draft" | "published" | "archived",
  });

  const [versionForm, setVersionForm] = useState({
    version: "", build_number: 1, download_url: "", sha256: "",
    size_bytes: "", changelog: "", min_ios_version: "",
  });

  useEffect(() => {
    if (!isNew && id) {
      supabase.schema("store" as any).from("apps").select("*").eq("id", id).single().then(({ data }) => {
        if (data) setForm({
          name: data.name || "", bundle_id: data.bundle_id || "", developer: data.developer || "BirdRa1n",
          subtitle: data.subtitle || "", description: data.description || "", icon_url: data.icon_url || "",
          category: data.category || "utilities", min_ios_version: data.min_ios_version || "15.0",
          is_beta: data.is_beta || false, featured: data.featured || false, status: data.status || "draft",
        });
        setLoading(false);
      });

      supabase.schema("store" as any).from("app_versions").select("*").eq("app_id", id).order("published_at", { ascending: false }).then(({ data }) => {
        setVersions((data || []) as AppVersion[]);
      });
    }
  }, [id, isNew]);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));
  const setVer = (key: string, value: any) => setVersionForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    let error: any;
    let appId = id as string;

    if (isNew) {
      const res = await supabase.schema("store" as any).from("apps").insert(form).select().single();

      error = res.error;
      if (!error && res.data) {
        appId = res.data.id;
        router.replace(`/admin/apps/${appId}`);
      }
    } else {
      const res = await supabase.schema("store" as any).from("apps").update({ ...form, updated_at: new Date().toISOString() }).eq("id", appId);

      error = res.error;
    }

    setSaving(false);
    setToast(error
      ? { type: "error", msg: error.message }
      : { type: "success", msg: isNew ? "App criado!" : "App salvo!" }
    );
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddVersion = async () => {
    const payload = {
      app_id: id,
      version: versionForm.version,
      build_number: Number(versionForm.build_number),
      download_url: versionForm.download_url,
      sha256: versionForm.sha256 || null,
      size_bytes: versionForm.size_bytes ? Number(versionForm.size_bytes) : null,
      changelog: versionForm.changelog || null,
      min_ios_version: versionForm.min_ios_version || null,
      published_at: new Date().toISOString(),
    };
    const { error, data } = await supabase.schema("store" as any).from("app_versions").insert(payload).select().single();

    if (!error && data) {
      setVersions(v => [data as AppVersion, ...v]);
      setVersionForm({ version: "", build_number: 1, download_url: "", sha256: "", size_bytes: "", changelog: "", min_ios_version: "" });
      setShowAddVersion(false);
    }
  };

  const handleDeleteVersion = async () => {
    if (!deleteVersionId) return;
    await supabase.schema("store" as any).from("app_versions").delete().eq("id", deleteVersionId);
    setVersions(v => v.filter(ver => ver.id !== deleteVersionId));
    setDeleteVersionId(null);
  };

  const APP_CATEGORIES = ["utilities", "social", "productivity", "developer-tools", "entertainment", "games", "education", "finance", "health-fitness", "lifestyle", "music", "photo-video", "shopping", "sports", "travel", "weather"];

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--neon)", borderTopColor: "transparent" }} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-6 right-6 z-50 px-5 py-3 rounded-sm text-xs"
          style={{
            fontFamily: "var(--font-mono)",
            background: toast.type === "success" ? "rgba(0,255,135,0.12)" : "rgba(255,85,85,0.12)",
            border: `1px solid ${toast.type === "success" ? "var(--neon)" : "#ff5555"}`,
            color: toast.type === "success" ? "var(--neon)" : "#ff5555",
          }}
        >
          {toast.type === "success" ? "✓" : "✗"} {toast.msg}
        </motion.div>
      )}

      <AdminPageHeader
        title={isNew ? "Novo App" : `Editar: ${form.name || "App"}`}
        subtitle="// store.apps"
        backHref="/admin/apps"
        actions={<AdminButton loading={saving} onClick={handleSave}><FiSave size={13} />{saving ? "SALVANDO..." : "SALVAR"}</AdminButton>}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main */}
        <div className="xl:col-span-2 space-y-6">
          <AdminCard className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <AdminInput label="Nome do App" required value={form.name} onChange={e => set("name", e.target.value)} placeholder="MyApp" />
              <AdminInput label="Bundle ID" required value={form.bundle_id} onChange={e => set("bundle_id", e.target.value)} placeholder="com.birdra1n.myapp" />
            </div>
            <AdminInput label="Developer" value={form.developer} onChange={e => set("developer", e.target.value)} />
            <AdminInput label="Subtítulo" value={form.subtitle} onChange={e => set("subtitle", e.target.value)} placeholder="Uma linha sobre o app..." />
            <AdminTextarea label="Descrição" value={form.description} onChange={e => set("description", e.target.value)} rows={5} placeholder="Descrição completa do app..." />
          </AdminCard>

          {/* Versions */}
          {!isNew && (
            <AdminCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Versões</p>
                <AdminButton variant="outline" onClick={() => setShowAddVersion(true)}>
                  <FiPlus size={12} /> NOVA VERSÃO
                </AdminButton>
              </div>

              {showAddVersion && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-sm p-5 mb-4 space-y-4"
                  style={{ background: "var(--bg-card-alt)", border: "1px solid var(--neon)", boxShadow: "0 0 20px rgba(0,255,135,0.05)" }}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>+ Nova Versão</p>
                    <button onClick={() => setShowAddVersion(false)} className="opacity-40 hover:opacity-100"><FiX size={14} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput label="Versão" value={versionForm.version} onChange={e => setVer("version", e.target.value)} placeholder="1.0.0" />
                    <AdminInput label="Build Number" type="number" value={String(versionForm.build_number)} onChange={e => setVer("build_number", e.target.value)} />
                  </div>
                  <AdminInput label="Download URL" required value={versionForm.download_url} onChange={e => setVer("download_url", e.target.value)} placeholder="https://..." />
                  <div className="grid grid-cols-2 gap-4">
                    <AdminInput label="SHA256" value={versionForm.sha256} onChange={e => setVer("sha256", e.target.value)} placeholder="hash..." />
                    <AdminInput label="Tamanho (bytes)" type="number" value={versionForm.size_bytes} onChange={e => setVer("size_bytes", e.target.value)} placeholder="1024000" />
                  </div>
                  <AdminInput label="iOS Mínimo (override)" value={versionForm.min_ios_version} onChange={e => setVer("min_ios_version", e.target.value)} placeholder="deixe vazio para usar o padrão" />
                  <AdminTextarea label="Changelog" value={versionForm.changelog} onChange={e => setVer("changelog", e.target.value)} rows={3} placeholder="O que mudou nesta versão..." />
                  <div className="flex justify-end gap-3">
                    <AdminButton variant="outline" onClick={() => setShowAddVersion(false)}>CANCELAR</AdminButton>
                    <AdminButton onClick={handleAddVersion}><FiPlus size={12} /> ADICIONAR</AdminButton>
                  </div>
                </motion.div>
              )}

              {versions.length === 0 ? (
                <p className="text-xs opacity-30 text-center py-8" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhuma versão ainda"}</p>
              ) : (
                <div className="space-y-3">
                  {versions.map((ver, i) => (
                    <div
                      key={ver.id}
                      className="flex items-start justify-between gap-3 px-4 py-3 rounded-sm group"
                      style={{ background: "var(--bg-card-alt)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>v{ver.version}</span>
                          <span className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>build {ver.build_number}</span>
                          {i === 0 && <span className="text-[9px] px-1.5 py-0.5 rounded-sm" style={{ background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.2)", color: "var(--neon)", fontFamily: "var(--font-mono)" }}>LATEST</span>}
                        </div>
                        {ver.changelog && <p className="text-xs opacity-40 line-clamp-1" style={{ fontFamily: "var(--font-body)" }}>{ver.changelog}</p>}
                        <p className="text-[10px] opacity-20 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                          {new Date(ver.published_at).toLocaleDateString("pt-BR")} · {ver.size_bytes ? `${(ver.size_bytes / 1024 / 1024).toFixed(1)} MB` : ""}
                        </p>
                      </div>
                      <button
                        className="opacity-0 group-hover:opacity-100 p-1.5 transition-opacity"
                        style={{ color: "#ff5555" }}
                        onClick={() => setDeleteVersionId(ver.id)}
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </AdminCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Publicação</p>
            <AdminSelect label="Status" value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </AdminSelect>
            <AdminToggle label="Em Destaque" description="Mostrar na seção featured" checked={form.featured} onChange={v => set("featured", v)} />
            <AdminToggle label="Beta" description="Marcar como versão beta" checked={form.is_beta} onChange={v => set("is_beta", v)} />
          </AdminCard>

          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Ícone</p>
            <AdminInput label="URL do Ícone" value={form.icon_url} onChange={e => set("icon_url", e.target.value)} placeholder="https://..." />
            {form.icon_url && (
              <img src={form.icon_url} alt="" className="w-20 h-20 rounded-xl object-cover" style={{ border: "1px solid var(--border)" }} onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </AdminCard>

          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Detalhes</p>
            <AdminSelect label="Categoria" value={form.category} onChange={e => set("category", e.target.value)}>
              {APP_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </AdminSelect>
            <AdminInput label="iOS Mínimo" value={form.min_ios_version} onChange={e => set("min_ios_version", e.target.value)} placeholder="15.0" />
          </AdminCard>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteVersionId}
        title="Remover Versão"
        message="Tem certeza? Esta versão será removida do AltStore source."
        onConfirm={handleDeleteVersion}
        onCancel={() => setDeleteVersionId(null)}
      />
    </AdminLayout>
  );
}
