// pages/projects/[slug].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import {
  FiArrowLeft,
  FiExternalLink,
  FiGithub,
  FiEye,
  FiAlertTriangle,
} from "react-icons/fi";

import DefaultLayout from "@/layouts/default";
import supabase from "@/utils/supabase/client";
import type { Project } from "@/utils/supabase/typed-client";

const MDPreview = dynamic(
  () => import("@uiw/react-md-editor").then((m) => m.default.Markdown),
  { ssr: false }
);

export default function ProjectPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchProject = async () => {
      try {
        const { data, error: queryError } = await supabase
          .schema("portfolio")
          .from("projects")
          .select("*")
          .eq("slug", slug)
          .eq("status", "published")
          .single();

        if (queryError) {
          if (queryError.code === "PGRST116") {
            setNotFound(true);
          } else {
            console.error("[Project] fetch error:", queryError.message);
            setError(queryError.message);
          }

          return;
        }

        if (!data) {
          setNotFound(true);

          return;
        }

        setProject(data as Project);

        // Incrementa views de forma silenciosa
        // (a função vive no schema "portfolio")
        Promise.resolve(
          supabase
            .schema("portfolio")
            .rpc("increment_project_views", { project_slug: String(slug) })
        ).catch(() => {});
      } catch (err: any) {
        console.error("[Project] fetch exception:", err);
        setError(err?.message || "Erro inesperado");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading)
    return (
      <DefaultLayout>
        <div className="max-w-3xl mx-auto py-20 space-y-4">
          <div
            className="h-12 w-2/3 rounded-sm animate-pulse"
            style={{ background: "var(--bg-card)" }}
          />
          <div
            className="h-4 w-1/3 rounded-sm animate-pulse"
            style={{ background: "var(--bg-card)" }}
          />
          <div
            className="h-96 rounded-sm animate-pulse mt-8"
            style={{ background: "var(--bg-card)" }}
          />
        </div>
      </DefaultLayout>
    );

  if (error)
    return (
      <DefaultLayout>
        <div className="max-w-3xl mx-auto py-20 text-center">
          <FiAlertTriangle
            className="mx-auto mb-4"
            size={32}
            style={{ color: "#FF9500", opacity: 0.6 }}
          />
          <p
            className="text-sm font-bold mb-2 opacity-60"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {"// Erro ao carregar projeto"}
          </p>
          <p
            className="text-xs opacity-40 mb-6"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {error}
          </p>
          <NextLink
            className="inline-block text-xs"
            href="/projects"
            style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
          >
            ← VOLTAR AOS PROJETOS
          </NextLink>
        </div>
      </DefaultLayout>
    );

  if (notFound)
    return (
      <DefaultLayout>
        <div className="max-w-3xl mx-auto py-20 text-center opacity-40">
          <p
            className="text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {"// 404"}
          </p>
          <p className="text-sm opacity-60" style={{ fontFamily: "var(--font-mono)" }}>
            Projeto não encontrado
          </p>
          <NextLink
            className="inline-block mt-6 text-xs"
            href="/projects"
            style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
          >
            ← VOLTAR AOS PROJETOS
          </NextLink>
        </div>
      </DefaultLayout>
    );

  if (!project) return null;

  return (
    <DefaultLayout>
      <article className="max-w-3xl mx-auto py-12 md:py-20">
        {/* Back */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
          initial={{ opacity: 0, x: -12 }}
        >
          <NextLink
            className="inline-flex items-center gap-2 text-xs opacity-40 hover:opacity-80 transition-opacity"
            href="/projects"
            style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
          >
            <FiArrowLeft size={12} /> PROJECTS
          </NextLink>
        </motion.div>

        {/* Header */}
        <motion.header
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
        >
          {project.tech_stack?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.tech_stack.map((tech) => (
                <span key={tech} className="tag-chip">
                  {tech}
                </span>
              ))}
            </div>
          )}

          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h1>

          {project.description && (
            <p
              className="text-base opacity-50 leading-relaxed mb-5"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {project.description}
            </p>
          )}

          <div
            className="flex flex-wrap items-center gap-3 py-4"
            style={{
              borderTop: "1px solid var(--border)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {project.demo_url && (
              <a
                className="ui-btn ui-btn-primary"
                href={project.demo_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FiExternalLink size={13} /> DEMO
              </a>
            )}
            {project.repo_url && (
              <a
                className="ui-btn ui-btn-outline"
                href={project.repo_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <FiGithub size={13} /> REPOSITÓRIO
              </a>
            )}
            <span
              className="flex items-center gap-1 text-xs opacity-30 ml-auto"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <FiEye size={11} /> {project.views_count} views
            </span>
          </div>
        </motion.header>

        {/* Cover */}
        {project.thumbnail_url && (
          <motion.div
            animate={{ opacity: 1 }}
            className="mb-10 rounded-sm overflow-hidden"
            initial={{ opacity: 0 }}
            style={{ border: "1px solid var(--border)" }}
            transition={{ delay: 0.2 }}
          >
            <img
              alt={project.title}
              className="w-full h-64 object-cover"
              src={project.thumbnail_url}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="prose-custom"
          data-color-mode="dark"
          initial={{ opacity: 0, y: 16 }}
          style={
            {
              "--color-canvas-default": "transparent",
              "--color-border-default": "var(--border)",
              "--color-fg-default": "var(--text-primary)",
            } as any
          }
          transition={{ delay: 0.25 }}
        >
          <MDPreview
            source={project.content ?? ""}
            style={{
              background: "transparent",
              color: "inherit",
              fontFamily: "var(--font-body)",
              fontSize: "15px",
              lineHeight: "1.8",
            }}
          />
        </motion.div>
      </article>
    </DefaultLayout>
  );
}
