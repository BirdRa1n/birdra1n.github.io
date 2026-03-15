// pages/admin/tags/index.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiTag } from "react-icons/fi";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminInput, AdminButton, ConfirmDialog } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { BlogTag } from "@/utils/supabase/typed-client";

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const fetch = async () => {
    setLoading(true);
    const { data } = await supabase.schema("blog" as any).from("tags").select("*").order("name");

    setTags((data || []) as BlogTag[]);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await supabase.schema("blog" as any).from("tags").insert({ name: name.trim(), slug: slugify(name) });
    setName("");
    setSaving(false);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.schema("blog" as any).from("tags").delete().eq("id", deleteId);
    setDeleteId(null);
    fetch();
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Tags" subtitle="// blog.tags" />

      {/* Add form */}
      <div className="flex gap-3 mb-8 max-w-md">
        <div className="flex-1">
          <AdminInput
            label="Nova Tag"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="nome-da-tag"
          />
        </div>
        <div className="flex items-end">
          <AdminButton loading={saving} onClick={handleAdd}><FiPlus size={13} /> CRIAR</AdminButton>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 w-24 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <div className="text-center py-16 opacity-30">
          <FiTag size={24} className="mx-auto mb-3" />
          <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhuma tag ainda"}</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag, i) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-2 px-4 py-2 rounded-sm group"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
            >
              <FiTag size={11} style={{ color: "var(--neon)", opacity: 0.6 }} />
              <span className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>{tag.name}</span>
              <span className="text-[9px] opacity-30 ml-1" style={{ fontFamily: "var(--font-mono)" }}>/{tag.slug}</span>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                style={{ color: "#ff5555" }}
                onClick={() => setDeleteId(tag.id)}
              >
                <FiTrash2 size={11} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deletar Tag"
        message="A tag será removida de todos os posts. Deseja continuar?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
