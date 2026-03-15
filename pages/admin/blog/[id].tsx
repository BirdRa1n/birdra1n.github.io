// pages/admin/blog/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiSave, FiPlus, FiX } from "react-icons/fi";
import dynamic from "next/dynamic";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminInput, AdminTextarea, AdminSelect, AdminToggle, AdminButton, AdminCard } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { BlogTag, Project } from "@/utils/supabase/typed-client";

const MarkdownEditor = dynamic(() => import("@/components/admin/MarkdownEditor"), { ssr: false });

function slugify(text: string) {
  return text.toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 200));
}

export default function AdminBlogEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [allTags, setAllTags] = useState<BlogTag[]>([]);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_url: "",
    status: "draft" as "draft" | "published" | "archived",
    featured: false,
    read_time_min: 1,
  });

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState("");

  useEffect(() => {
    const init = async () => {
      const [{ data: tags }, { data: projects }] = await Promise.all([
        supabase.schema("blog" as any).from("tags").select("*").order("name"),
        supabase.schema("portfolio" as any).from("projects").select("id,title").order("title"),
      ]);

      setAllTags(tags || []);
      setAllProjects((projects || []) as Project[]);

      if (!isNew && id) {
        const { data: post } = await supabase
          .schema("blog" as any)
          .from("posts")
          .select("*, post_tags(tag_id), post_project_mentions(project_id)")
          .eq("id", id)
          .single();

        if (post) {
          setForm({
            title: post.title || "",
            slug: post.slug || "",
            excerpt: post.excerpt || "",
            content: post.content || "",
            cover_url: post.cover_url || "",
            status: post.status || "draft",
            featured: post.featured || false,
            read_time_min: post.read_time_min || 1,
          });
          setSelectedTagIds(post.post_tags?.map((t: any) => t.tag_id) || []);
          setSelectedProjectIds(post.post_project_mentions?.map((m: any) => m.project_id) || []);
        }
        setLoading(false);
      }
    };

    init();
  }, [id, isNew]);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleContentChange = (v: string) => {
    set("content", v);
    set("read_time_min", estimateReadTime(v));
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds(ids => ids.includes(tagId) ? ids.filter(i => i !== tagId) : [...ids, tagId]);
  };

  const toggleProject = (projectId: string) => {
    setSelectedProjectIds(ids => ids.includes(projectId) ? ids.filter(i => i !== projectId) : [...ids, projectId]);
  };

  const createAndAddTag = async () => {
    if (!newTagName.trim()) return;
    const tagSlug = slugify(newTagName);
    const { data, error } = await supabase
      .schema("blog" as any)
      .from("tags")
      .insert({ name: newTagName.trim(), slug: tagSlug })
      .select()
      .single();

    if (!error && data) {
      setAllTags(t => [...t, data]);
      setSelectedTagIds(ids => [...ids, data.id]);
      setNewTagName("");
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      published_at: form.status === "published" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    let postId = id as string;
    let error: any;

    if (isNew) {
      const res = await supabase.schema("blog" as any).from("posts").insert(payload).select().single();

      error = res.error;
      if (!error && res.data) {
        postId = res.data.id;
        router.replace(`/admin/blog/${postId}`);
      }
    } else {
      const res = await supabase.schema("blog" as any).from("posts").update(payload).eq("id", postId);

      error = res.error;
    }

    if (!error && postId) {
      // Sync tags
      await supabase.schema("blog" as any).from("post_tags").delete().eq("post_id", postId);
      if (selectedTagIds.length > 0) {
        await supabase.schema("blog" as any).from("post_tags").insert(selectedTagIds.map(tag_id => ({ post_id: postId, tag_id })));
      }

      // Sync project mentions
      await supabase.schema("blog" as any).from("post_project_mentions").delete().eq("post_id", postId);
      if (selectedProjectIds.length > 0) {
        await supabase.schema("blog" as any).from("post_project_mentions").insert(selectedProjectIds.map(project_id => ({ post_id: postId, project_id })));
      }
    }

    setSaving(false);
    if (error) {
      setToast({ type: "error", msg: error.message });
    } else {
      setToast({ type: "success", msg: isNew ? "Post criado!" : "Post salvo!" });
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
        title={isNew ? "Novo Post" : "Editar Post"}
        subtitle={isNew ? "// blog.posts.insert" : `// blog.posts.update [${id}]`}
        backHref="/admin/blog"
        actions={
          <div className="flex items-center gap-3">
            <span className="text-xs opacity-40" style={{ fontFamily: "var(--font-mono)" }}>~{form.read_time_min} min leitura</span>
            <AdminButton loading={saving} onClick={handleSave}>
              <FiSave size={13} />
              {saving ? "SALVANDO..." : "SALVAR"}
            </AdminButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main */}
        <div className="xl:col-span-2 space-y-6">
          <AdminCard className="p-6 space-y-5">
            <AdminInput
              label="Título"
              required
              value={form.title}
              onChange={e => { set("title", e.target.value); if (isNew) set("slug", slugify(e.target.value)); }}
              placeholder="Título do post..."
            />
            <AdminInput
              label="Slug"
              required
              value={form.slug}
              onChange={e => set("slug", slugify(e.target.value))}
              placeholder="titulo-do-post"
              hint="// URL: /blog/{slug}"
            />
            <AdminTextarea
              label="Excerpt / Resumo"
              value={form.excerpt}
              onChange={e => set("excerpt", e.target.value)}
              rows={2}
              placeholder="Um breve resumo do post para SEO e cards..."
            />
          </AdminCard>

          {/* Markdown Editor */}
          <AdminCard className="p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
                Conteúdo (Markdown) <span style={{ color: "var(--neon)" }}>*</span>
              </p>
              <span className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
                {form.content.split(/\s+/).filter(Boolean).length} palavras
              </span>
            </div>
            <MarkdownEditor
              value={form.content}
              onChange={handleContentChange}
              height={560}
              placeholder={`# Título\n\nEscreva seu post aqui...\n\n## Seção\n\nConteúdo...\n\n\`\`\`typescript\n// código de exemplo\nconst hello = "world";\n\`\`\``}
            />
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Publicação</p>
            <AdminSelect label="Status" value={form.status} onChange={e => set("status", e.target.value)}>
              <option value="draft">draft</option>
              <option value="published">published</option>
              <option value="archived">archived</option>
            </AdminSelect>
            <AdminToggle label="Post em Destaque" description="Exibir no topo do blog" checked={form.featured} onChange={v => set("featured", v)} />
          </AdminCard>

          {/* Cover image */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Capa</p>
            <AdminInput label="URL da Imagem de Capa" value={form.cover_url} onChange={e => set("cover_url", e.target.value)} placeholder="https://..." />
            {form.cover_url && (
              <img src={form.cover_url} alt="" className="w-full h-28 object-cover rounded-sm" style={{ border: "1px solid var(--border)" }} onError={e => (e.currentTarget.style.display = "none")} />
            )}
          </AdminCard>

          {/* Tags */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Tags</p>
            <div className="flex gap-2">
              <input
                value={newTagName}
                onChange={e => setNewTagName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); createAndAddTag(); } }}
                placeholder="Nova tag..."
                style={{
                  flex: 1,
                  background: "var(--bg-card-alt)",
                  border: "1px solid var(--border)",
                  borderRadius: "2px",
                  padding: "8px 10px",
                  fontSize: "12px",
                  color: "inherit",
                  fontFamily: "var(--font-mono)",
                  outline: "none",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "var(--neon)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
              />
              <button onClick={createAndAddTag} className="px-3 py-2 rounded-sm" style={{ background: "rgba(0,255,135,0.1)", border: "1px solid rgba(0,255,135,0.2)", color: "var(--neon)" }}>
                <FiPlus size={14} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className="text-[10px] px-2 py-1 rounded-sm transition-all"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: selectedTagIds.includes(tag.id) ? "rgba(0,255,135,0.12)" : "var(--bg-card-alt)",
                    border: `1px solid ${selectedTagIds.includes(tag.id) ? "var(--neon)" : "var(--border)"}`,
                    color: selectedTagIds.includes(tag.id) ? "var(--neon)" : "inherit",
                    opacity: selectedTagIds.includes(tag.id) ? 1 : 0.5,
                  }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </AdminCard>

          {/* Related Projects */}
          <AdminCard className="p-5 space-y-4">
            <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>Projetos Mencionados</p>
            <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-hide">
              {allProjects.map(project => (
                <label
                  key={project.id}
                  className="flex items-center gap-2.5 cursor-pointer py-1 group"
                >
                  <div
                    className="w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center transition-all"
                    style={{
                      background: selectedProjectIds.includes(project.id) ? "var(--neon)" : "var(--bg-card-alt)",
                      border: `1px solid ${selectedProjectIds.includes(project.id) ? "var(--neon)" : "var(--border)"}`,
                    }}
                    role="checkbox"
                    aria-checked={selectedProjectIds.includes(project.id)}
                    tabIndex={0}
                    onClick={() => toggleProject(project.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleProject(project.id); }}
                  >
                    {selectedProjectIds.includes(project.id) && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4L3 6L7 2" stroke="#05080F" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs opacity-60 group-hover:opacity-100 transition-opacity" style={{ fontFamily: "var(--font-body)" }}>
                    {project.title}
                  </span>
                </label>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  );
}
