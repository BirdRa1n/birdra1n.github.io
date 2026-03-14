// components/home/featured-projects.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import storage from "@/utils/storage";
import supabase from "@/utils/supabase/client";

interface Project {
  id: string;
  title: string;
  content: string;
  status: string;
  views_count: number;
  thumbnail_url: string;
  slug: string;
  category_id: string;
  created_at: string;
  description: string;
}

const ProjectCardSkeleton = () => (
  <div
    className="h-32 rounded-sm animate-pulse"
    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
  />
);

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.a
    href={`/projects/${project.slug}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative flex gap-4 p-4 rounded-sm cursor-pointer overflow-hidden"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      transition: "border-color 0.25s, box-shadow 0.25s, transform 0.25s",
    }}
    whileHover={{ y: -3 }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)";
      (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(0,255,135,0.1)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      (e.currentTarget as HTMLElement).style.boxShadow = "none";
    }}
  >
    {/* Neon corner accent */}
    <div
      className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity"
      style={{
        background: "linear-gradient(135deg, var(--neon) 0%, transparent 70%)",
        opacity: 0,
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
    />

    {/* Thumbnail */}
    <div
      className="w-20 h-20 rounded-sm flex-shrink-0 overflow-hidden"
      style={{ border: "1px solid var(--border)" }}
    >
      {project.thumbnail_url ? (
        <img
          src={project.thumbnail_url}
          alt={project.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center text-xs"
          style={{ background: "var(--bg-card-alt)", color: "var(--neon)", fontFamily: "var(--font-mono)" }}
        >
          NO_IMG
        </div>
      )}
    </div>

    {/* Content */}
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
      {project.views_count > 0 && (
        <div className="mt-2 flex items-center gap-1">
          <span
            className="text-[10px] opacity-30"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {project.views_count} views
          </span>
        </div>
      )}
    </div>
  </motion.a>
);

const FeaturedProjects = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const fetchLastProjects = async () => {
      const cachedProjects = storage.getItem("lastProjects");
      if (cachedProjects) {
        setProjects(JSON.parse(cachedProjects) as Project[]);
        setIsLoading(false);
        return;
      }
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(3);
      if (data) {
        storage.setItem("lastProjects", data);
        setProjects(data);
      }
      setIsLoading(false);
    };
    fetchLastProjects();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 mb-6">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => <ProjectCardSkeleton key={i} />)
          : projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
      </div>

      <div className="flex justify-end">
        <a
          href="/projects"
          className="flex items-center gap-2 text-xs tracking-widest transition-opacity hover:opacity-100 opacity-50"
          style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
        >
          ALL_PROJECTS
          <span>→</span>
        </a>
      </div>
    </div>
  );
};

export default FeaturedProjects;
