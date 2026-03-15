// components/home/featured-projects.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import storage from "@/utils/storage";
import supabase from "@/utils/supabase/client";

interface Project {
  id: string;
  title: string;
  description: string;
  status: string;
  views_count: number;
  thumbnail_url: string;
  slug: string;
}

const Skeleton = () => (
  <div
    className="h-32 rounded-sm animate-pulse"
    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
  />
);

function ProjectCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex gap-4 p-4 rounded-sm cursor-pointer overflow-hidden"
      href={`/projects/${project.slug}`}
      initial={{ opacity: 0, y: 20 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        transition: "border-color 0.25s, box-shadow 0.25s",
      }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -3 }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--neon)";
        el.style.boxShadow = "0 8px 32px rgba(0,255,135,0.1)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "none";
      }}
    >
      <div
        className="w-20 h-20 rounded-sm flex-shrink-0 overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        {project.thumbnail_url ? (
          <img
            alt={project.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            loading="lazy"
            src={project.thumbnail_url}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-xs"
            style={{
              background: "var(--bg-card-alt)",
              color: "var(--neon)",
              fontFamily: "var(--font-mono)",
            }}
          >
            NO_IMG
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="text-sm font-semibold truncate group-hover:text-[var(--neon)] transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.title}
          </h3>
          <span
            className="opacity-0 group-hover:opacity-100 transition-opacity text-xs flex-shrink-0"
            style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
          >
            →
          </span>
        </div>
        <p
          className="text-xs leading-relaxed opacity-50 line-clamp-2"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {project.description}
        </p>
        {(project.views_count ?? 0) > 0 && (
          <span
            className="mt-2 text-[10px] opacity-30"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.views_count} views
          </span>
        )}
      </div>
    </motion.a>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    // Tenta cache primeiro
    const cached = storage.getItem("lastProjects");
    if (cached) {
      try {
        setProjects(JSON.parse(cached));
        setIsLoading(false);
        return;
      } catch { /* ignora */ }
    }

    const controller = new AbortController();

    Promise.resolve(
      supabase
        .from("projects")
        .select("id,title,description,status,views_count,thumbnail_url,slug")
        .order("created_at", { ascending: false })
        .limit(3)
        .abortSignal(controller.signal)
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (data) {
          storage.setItem("lastProjects", data);
          setProjects(data as Project[]);
        }
      })
      .catch((err) => {
        if (err?.name !== "AbortError")
          console.error("[FeaturedProjects]", err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)
          : projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} />
            ))}
      </div>

      <div className="flex justify-end">
        <a
          className="flex items-center gap-2 text-xs tracking-widest transition-opacity hover:opacity-100 opacity-50"
          href="/projects"
          style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
        >
          ALL_PROJECTS <span>→</span>
        </a>
      </div>
    </div>
  );
}
