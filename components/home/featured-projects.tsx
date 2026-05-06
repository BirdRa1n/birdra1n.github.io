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

const SkeletonFeatured = () => (
  <div
    className="rounded-xl overflow-hidden animate-pulse"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      height: 380,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}
  >
    <div className="h-full" style={{ background: "var(--bg-card-alt)" }} />
  </div>
);

const SkeletonRow = () => (
  <div
    className="rounded-xl animate-pulse p-3 flex gap-3"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      minHeight: 72,
    }}
  >
    <div className="w-16 h-16 rounded-lg flex-shrink-0" style={{ background: "var(--bg-card-alt)" }} />
    <div className="flex-1 flex flex-col gap-2 py-1">
      <div className="h-3 rounded w-2/3" style={{ background: "var(--bg-card-alt)" }} />
      <div className="h-2.5 rounded w-full" style={{ background: "var(--bg-card-alt)" }} />
      <div className="h-2.5 rounded w-3/4" style={{ background: "var(--bg-card-alt)" }} />
    </div>
  </div>
);

function FeaturedCard({ project }: { project: Project }) {
  return (
    <motion.a
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl overflow-hidden block cursor-pointer"
      href={`/projects/${project.slug}`}
      initial={{ opacity: 0, y: 28 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        height: 380,
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--neon-dim)";
        el.style.boxShadow =
          "0 0 0 1px var(--neon-glow), 0 20px 56px var(--neon-glow), 0 4px 24px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.2)";
      }}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 inset-x-0 h-0.5 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 z-10"
        style={{ background: "linear-gradient(90deg, var(--neon), var(--cyan))" }}
      />

      {/* Full-bleed image */}
      <div className="absolute inset-0">
        {project.thumbnail_url ? (
          <img
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
            src={project.thumbnail_url}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--bg-card-alt)" }}
          >
            <span
              className="text-9xl font-extrabold select-none leading-none"
              style={{ fontFamily: "var(--font-display)", color: "var(--neon)", opacity: 0.12 }}
            >
              {project.title.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Gradient overlay — always-dark so text is legible regardless of theme */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(9,8,15,0.96) 0%, rgba(9,8,15,0.55) 50%, transparent 100%)" }}
      />

      {/* Status badge */}
      {project.status && (
        <div className="absolute top-4 left-4 z-10">
          <span
            className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded"
            style={{
              fontFamily: "var(--font-mono)",
              background: "rgba(167,139,250,0.18)",
              border: "1px solid rgba(167,139,250,0.35)",
              color: "#A78BFA",
              backdropFilter: "blur(6px)",
            }}
          >
            {project.status}
          </span>
        </div>
      )}

      {/* Content anchored to bottom */}
      <div className="absolute inset-x-0 bottom-0 p-5 z-10">
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p
              className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5"
              style={{ fontFamily: "var(--font-mono)", color: "#A78BFA", opacity: 0.8 }}
            >
              featured project
            </p>
            <h3
              className="text-xl font-bold leading-snug mb-1.5 transition-colors duration-200 group-hover:text-[#A78BFA]"
              style={{ fontFamily: "var(--font-display)", color: "#EDE9FE" }}
            >
              {project.title}
            </h3>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#7C7A9A" }}>
              {project.description}
            </p>
            {(project.views_count ?? 0) > 0 && (
              <p
                className="mt-2 text-[10px]"
                style={{ fontFamily: "var(--font-mono)", color: "#7C7A9A", opacity: 0.6 }}
              >
                {project.views_count} views
              </p>
            )}
          </div>
          <span
            className="text-xl flex-shrink-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
            style={{ color: "#A78BFA" }}
          >
            →
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      animate={{ opacity: 1, x: 0 }}
      className="group relative rounded-xl flex gap-3 p-3 cursor-pointer"
      href={`/projects/${project.slug}`}
      initial={{ opacity: 0, x: 16 }}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--neon-dim)";
        el.style.boxShadow = "0 0 0 1px var(--neon-glow), 0 8px 24px var(--neon-glow)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "none";
      }}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 inset-x-0 h-0.5 rounded-t-xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-400"
        style={{ background: "linear-gradient(90deg, var(--neon), var(--cyan))" }}
      />

      {/* Thumbnail */}
      <div
        className="w-16 h-16 rounded-lg flex-shrink-0 overflow-hidden"
        style={{ border: "1px solid var(--border)", background: "var(--bg-card-alt)" }}
      >
        {project.thumbnail_url ? (
          <img
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            src={project.thumbnail_url}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-lg font-extrabold select-none"
            style={{ fontFamily: "var(--font-display)", color: "var(--neon)", opacity: 0.25 }}
          >
            {project.title.slice(0, 1).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-start justify-between gap-1 mb-1">
          <p
            className="text-xs font-semibold leading-snug truncate transition-colors duration-200 group-hover:text-[var(--neon)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {project.title}
          </p>
          <span
            className="text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: "var(--neon)" }}
          >
            →
          </span>
        </div>
        <p className="text-[11px] leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
          {project.description}
        </p>
        {project.status && (
          <span
            className="mt-1.5 inline-block w-fit text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
            style={{
              fontFamily: "var(--font-mono)",
              background: "var(--neon-glow)",
              border: "1px solid var(--neon-dim)",
              color: "var(--neon)",
            }}
          >
            {project.status}
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

    const cached = storage.getItem("lastProjects");
    if (cached) {
      try {
        setProjects(JSON.parse(cached));
        setIsLoading(false);
        return;
      } catch { /* ignore */ }
    }

    const controller = new AbortController();

    Promise.resolve(
      supabase
        .schema('portfolio')
        .from("projects")
        .select("id,title,description,status,views_count,thumbnail_url,slug")
        .order("created_at", { ascending: false })
        .limit(6)
        .abortSignal(controller.signal),
    )
      .then(({ data }) => {
        if (controller.signal.aborted) return;
        if (data) {
          storage.setItem("lastProjects", data);
          setProjects(data as Project[]);
        }
      })
      .catch((err) => {
        if (err?.name !== "AbortError") console.error("[FeaturedProjects]", err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const featured = projects[0];
  const rest = projects.slice(1);

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <SkeletonFeatured />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      ) : projects.length === 0 ? null : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          {/* Featured large card */}
          {featured && <FeaturedCard project={featured} />}

          {/* Scrollable compact list */}
          <div className="flex flex-col gap-2">
            <div
              className="flex flex-col gap-2 overflow-y-auto scrollbar-hide"
              style={{ maxHeight: 340 }}
            >
              {rest.map((p, i) => (
                <ProjectRow key={p.id} index={i} project={p} />
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <a
                className="group flex items-center gap-2 text-xs font-medium transition-colors duration-200"
                href="/projects"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--neon)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                ls ./projects --all
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
