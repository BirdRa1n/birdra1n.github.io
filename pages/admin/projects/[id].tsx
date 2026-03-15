// pages/admin/projects/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiSave, FiPlus, FiX } from "react-icons/fi";
import dynamic from "next/dynamic";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, AdminCard } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { Project, Category } from "@/utils/supabase/typed-client";

const MarkdownEditor = dynamic(() => import("@/components/admin/MarkdownEditor"), { ssr: false });

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminProjectEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    thumbnail_url: "",
    demo_url: "",
    repo_url: "",
    tech_stack: [] as string[],
    category_id: "",
    featured: false,
    status: "draft" as "draft" | "published" | "archived",
  });
  const [techInput, setTechInput] = useState("");

  useEffect(() => {
    supabase.schema("portfolio" as any).from("categories").select("*").then(({ data }) => setCategories(data || []));
    if (!isNew && id) {
      supabase.schema("portfolio" as any).from("projects").select("*").eq("id", id).single().then(({ data }) => {
        if (data) {
          setForm({
            title: data.title || "",
            slug: data.slug || "",
            description: data.description || "",
            content: data.content || "",
            thumbnail_url: data.thumbnail_url || "",
            demo_url: data.demo_url || "",
            repo_url: data.repo_url || "",
            tech_stack: data.tech_stack || [],
            category_id: data.category_id || "",
            featured: data.featured || false,
            status: data.status || "draft",
          });
        }
        setLoading(false);
      });
    }
  }, [id, isNew]);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const addTech = () => {
    if (!techInput.trim()) return;
    const items = techInput.split(",").map(s => s.trim()).filter(Boolean);
    set("tech_stack", [...form.tech_stack, ...items.filter(t => !form.tech_stack.includes(t))]);
    setTechInput("");
  };

  const removeTech = (tech: string) => set("tech_stack", form.tech_stack.filter(t => t !== tech));

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (isNew) {
      const res = await supabase.schema("portfolio" as any).from("projects").insert(payload).select().single();
      error = res.error;
      if (!error && res.data) router.replace(`/admin/projects/${res.data.id}`);
    } else {
      const res = await supabase.schema("portfolio" as any).from("projects").update(payload).eq("id", id);
      error = res.error;
    }

    setSaving(false);
    if (error) {
      setToast({ type: "error", msg: error.message });
    } else {
      setToast({ type: "success", msg: isNew ? "Projeto criado!" : "Projeto salvo!" });
      setTimeout(() => setToast(null), 3000);
    }
  };

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--neon)", borderTopColor: "transparent" }} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      {/* Toast */}
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
        title={isNew ? "Novo Projeto" : "Editar Projeto"}
        subtitle={isNew ? "// portfolio.projects.insert" : `// portfolio.projects.update [${id}]`}
        backHref="/admin/projects"
        actions={
          <AdminButton loading={saving} onClick={handleSave}>
            <FiSave size={13} />
            {saving ? "SALVANDO..." : "SALVAR"}
          </AdminButton>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-6">
          <AdminCard className="p-6 space-y-5">
            <AdminInput
              label="Título"
              required
              value={form.title}
              onChange={e => {
                set("title", e.target.value);
                if (isNew) set("slug", slugify(e.target.value));
              }}
              placeholder="Meu Projeto Incrível"
            />
            <AdminInput
              label="Slug"
              required
              value={form.slug}
              onChange={e => set("slug", slugify(e.target.value))}
              placeholder="meu-projeto-incrivel"
              hint="// URL: /projects/{slug}"
            />
            <AdminTextarea
              label="Descrição"
              value={form.description}
              onChange={e => set("description", e.target.value)}
              rows={3}
              placeholder="Uma breve descrição do projeto..."
            />
          </AdminCard>

          {/* Markdown editor */}
          <AdminCard className="p-6">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
              Conteúdo (Markdown) <span style={{ color: "var(--neon)" }}>*</span>
            </p>
            <MarkdownEditor
              value={form.content}
              onChange={v => set("content", v)}
              height={480}
              placeholder="# Título do Projeto&#10;&#10;Escreva sobre o projeto aqui..."
            />
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & publishing */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Publicação</p>
            <AdminSelect
              label="Status"
              value={form.status}
              onChange={e => set("status", e.target.value)}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </AdminSelect>
            <AdminToggle
              label="Destaque"
              description="Mostrar na seção de projetos em destaque"
              checked={form.featured}
              onChange={v => set("featured", v)}
            />
          </AdminCard>

          {/* Media */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Mídia</p>
            <AdminInput label="URL da Thumbnail" value={form.thumbnail_url} onChange={e => set("thumbnail_url", e.target.value)} placeholder="https://..." />
            {form.thumbnail_url && (
              <img src={form.thumbnail_url} alt="" className="w-full h-32 object-cover rounded-sm" style={{ border: "1px solid var(--border)" }} onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </AdminCard>

          {/* Links */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Links</p>
            <AdminInput label="Demo URL" value={form.demo_url} onChange={e => set("demo_url", e.target.value)} placeholder="https://..." type="url" />
            <AdminInput label="Repositório" value={form.repo_url} onChange={e => set("repo_url", e.target.value)} placeholder="https://github.com/..." type="url" />
          </AdminCard>

          {/* Tech stack */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Tech Stack</p>
            <div className="flex gap-2">
              <input
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTech(); } }}
                placeholder="React, TypeScript..."
                style={{
                  flex: 1,
                  background: "var(--bg-card-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  padding: "8px 12px",
                  fontSize: "12px",
                  color: "inherit",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--neon)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
              />
              <button onClick={addTech} className="px-3 py-2 rounded-sm" style={{ background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.2)", color: "var(--neon)" }}>
                <FiPlus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.tech_stack.map(tech => (
                <span key={tech} className="tag-chip flex items-center gap-1.5">
                  {tech}
                  <button onClick={() => removeTech(tech)} className="opacity-50 hover:opacity-100">
                    <FiX size={10} />
                  </button>
                </span>
              ))}
            </div>
          </AdminCard>

          {/* Category */}
          <AdminCard className="p-5">
            <AdminSelect
              label="Categoria"
              value={form.category_id}
              onChange={e => set("category_id", e.target.value)}
            >
              <option value="">Sem categoria</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </AdminSelect>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  );
}
