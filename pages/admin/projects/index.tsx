// pages/admin/projects/index.tsx
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiExternalLink } from "react-icons/fi";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminButton, StatusBadge, ConfirmDialog } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { Project } from "@/utils/supabase/typed-client";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .schema("portfolio" as any)
        .from("projects")
        .select("*, category:categories(*)")
        .order("created_at", { ascending: false });
      setProjects((data || []) as Project[]);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.schema("portfolio" as any).from("projects").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchProjects();
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Projetos"
        subtitle="// portfolio.projects"
        actions={
          <NextLink href="/admin/projects/new">
            <AdminButton><FiPlus size={13} /> NOVO PROJETO</AdminButton>
          </NextLink>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : (
        <div className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--border)" }}>
          {/* Table header */}
          <div
            className="grid grid-cols-12 px-4 py-3 text-[10px] tracking-widest uppercase opacity-40"
            style={{ background: "var(--bg-card-alt)", fontFamily: "var(--font-mono)", borderBottom: "1px solid var(--border)" }}
          >
            <div className="col-span-5">Título</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Views</div>
            <div className="col-span-2">Data</div>
            <div className="col-span-1 text-right">Ações</div>
          </div>

          {projects.length === 0 && (
            <div className="text-center py-16 opacity-30">
              <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhum projeto encontrado"}</p>
            </div>
          )}

          {projects.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-12 items-center px-4 py-4 group"
              style={{
                background: "var(--bg-card)",
                borderBottom: "1px solid var(--border)",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-card-alt)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-card)"}
            >
              <div className="col-span-5 flex items-center gap-3">
                {project.thumbnail_url ? (
                  <img src={project.thumbnail_url} alt="" className="w-10 h-10 rounded-sm object-cover flex-shrink-0" style={{ border: "1px solid var(--border)" }} />
                ) : (
                  <div className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center text-[10px]" style={{ background: "var(--bg-card-alt)", border: "1px solid var(--border)", color: "var(--neon)", fontFamily: "var(--font-mono)" }}>NO</div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ fontFamily: "var(--font-display)" }}>{project.title}</p>
                  <p className="text-[10px] opacity-40 truncate" style={{ fontFamily: "var(--font-mono)" }}>/{project.slug}</p>
                </div>
              </div>
              <div className="col-span-2"><StatusBadge status={project.status ?? ""} /></div>
              <div className="col-span-2 text-xs opacity-50" style={{ fontFamily: "var(--font-mono)" }}>{project.views_count.toLocaleString()}</div>
              <div className="col-span-2 text-xs opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
                {project.created_at ? new Date(project.created_at).toLocaleDateString("pt-BR") : "-"}
              </div>
              <div className="col-span-1 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <NextLink href={`/projects/${project.slug}`} target="_blank" className="p-1 opacity-50 hover:opacity-100" title="Ver">
                  <FiExternalLink size={13} />
                </NextLink>
                <NextLink href={`/admin/projects/${project.id}`} className="p-1 opacity-50 hover:opacity-100" title="Editar">
                  <FiEdit2 size={13} />
                </NextLink>
                <button className="p-1 opacity-50 hover:opacity-100" style={{ color: "#ff5555" }} onClick={() => setDeleteId(project.id)} title="Deletar">
                  <FiTrash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deletar Projeto"
        message="Tem certeza? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
