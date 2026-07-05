// pages/projects/index.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { FiEye, FiAlertTriangle } from "react-icons/fi";

import DefaultLayout from "@/layouts/default";
import supabase from "@/utils/supabase/client";
import type { Project } from "@/utils/supabase/typed-client";

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.article
    animate={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 20 }}
    transition={{ delay: index * 0.08, duration: 0.5 }}
  >
    <NextLink
      className="group flex flex-col md:flex-row gap-5 p-5 rounded-sm cursor-pointer overflow-hidden ui-card-hover"
      href={`/projects/${project.slug}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
      }}
    >
      {project.thumbnail_url && (
        <div
          className="w-full md:w-48 h-32 md:h-auto rounded-sm overflow-hidden flex-shrink-0"
          style={{ border: "1px solid var(--border)" }}
        >
          <img
            alt={project.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            src={project.thumbnail_url}
          />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {project.featured && (
              <span
                className="text-[9px] px-2 py-0.5 tracking-widest"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: "color-mix(in srgb, var(--neon) 8%, transparent)",
                  border: "1px solid color-mix(in srgb, var(--neon) 20%, transparent)",
                  color: "var(--neon)",
                }}
              >
                DESTAQUE
              </span>
            )}
            {project.tech_stack?.slice(0, 3).map((tech) => (
              <span key={tech} className="tag-chip">
                {tech}
              </span>
            ))}
          </div>
          <h2
            className="text-xl font-bold tracking-tight mb-2 group-hover:text-[var(--neon)] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h2>
          {project.description && (
            <p
              className="text-sm opacity-50 leading-relaxed line-clamp-2"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {project.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4 mt-3">
          <span
            className="flex items-center gap-1 text-[10px] opacity-30"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            <FiEye size={10} /> {project.views_count}
          </span>
          <span
            className="text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
            style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
          >
            VER →
          </span>
        </div>
      </div>
    </NextLink>
  </motion.article>
);

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error: queryError } = await supabase
          .schema("portfolio")
          .from("projects")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (queryError) {
          console.error("[Projects] fetch error:", queryError.message);
          setError(queryError.message);

          return;
        }

        setProjects((data || []) as Project[]);
      } catch (err: any) {
        console.error("[Projects] fetch exception:", err);
        setError(err?.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <DefaultLayout>
      <section className="max-w-3xl mx-auto py-12 md:py-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs tracking-[0.3em] opacity-50"
              style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            >
              02
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>
          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Projects
          </h1>
          <p className="text-sm opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
            {"// Trabalhos selecionados e experimentos"}
          </p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-36 rounded-sm animate-pulse"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-24 opacity-50">
            <FiAlertTriangle size={28} style={{ color: "#FF9500" }} />
            <p className="text-sm text-center" style={{ fontFamily: "var(--font-mono)" }}>
              {"// Erro ao carregar projetos"}
            </p>
            <p
              className="text-xs opacity-60 text-center"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {error}
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-24 opacity-30">
            <p className="text-sm" style={{ fontFamily: "var(--font-mono)" }}>
              {"// Nenhum projeto ainda — em breve!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} index={i} project={project} />
            ))}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}
