// components/home/repos.tsx
import { motion } from "framer-motion";
import { FaStar, FaCodeBranch } from "react-icons/fa";

import { formatRepoName } from "@/utils/github/formatRepoName";
import { useReposContext } from "@/contexts/repos";

const SkeletonFeatured = () => (
  <div
    className="rounded-xl animate-pulse p-5"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      height: 220,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}
  >
    <div className="flex gap-3 mb-4">
      <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: "var(--bg-card-alt)" }} />
      <div className="flex-1 flex flex-col gap-2 pt-1">
        <div className="h-4 rounded w-1/2" style={{ background: "var(--bg-card-alt)" }} />
        <div className="h-3 rounded w-1/3" style={{ background: "var(--bg-card-alt)" }} />
      </div>
    </div>
    <div className="h-px mb-4" style={{ background: "var(--border)" }} />
    <div className="h-3 rounded w-full mb-2" style={{ background: "var(--bg-card-alt)" }} />
    <div className="h-3 rounded w-4/5 mb-2" style={{ background: "var(--bg-card-alt)" }} />
    <div className="h-3 rounded w-3/5" style={{ background: "var(--bg-card-alt)" }} />
  </div>
);

const SkeletonRow = () => (
  <div
    className="rounded-xl animate-pulse p-3 flex gap-3"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      minHeight: 64,
    }}
  >
    <div className="w-8 h-8 rounded-lg flex-shrink-0 mt-0.5" style={{ background: "var(--bg-card-alt)" }} />
    <div className="flex-1 flex flex-col gap-2 py-0.5">
      <div className="h-3 rounded w-2/3" style={{ background: "var(--bg-card-alt)" }} />
      <div className="h-2.5 rounded w-full" style={{ background: "var(--bg-card-alt)" }} />
    </div>
  </div>
);

const FeaturedRepo = ({ repo }: { repo: any }) => {
  const slug = formatRepoName(repo.name);
  const initials = slug.slice(0, 2).toUpperCase();

  return (
    <motion.a
      animate={{ opacity: 1, y: 0 }}
      className="group relative rounded-xl block cursor-pointer p-5"
      href={repo.html_url}
      initial={{ opacity: 0, y: 18 }}
      rel="noopener noreferrer"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        height: 220,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        transition: "border-color 0.25s ease, box-shadow 0.25s ease",
      }}
      target="_blank"
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--neon-dim)";
        el.style.boxShadow =
          "0 0 0 1px var(--neon-glow), 0 16px 48px var(--neon-glow), 0 4px 20px rgba(0,0,0,0.2)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.boxShadow = "0 4px 20px rgba(0,0,0,0.3)";
      }}
    >
      {/* Accent line */}
      <div
        className="absolute top-0 inset-x-0 h-0.5 rounded-t-xl scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"
        style={{ background: "linear-gradient(90deg, var(--neon), var(--cyan))" }}
      />

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-sm font-bold"
          style={{
            background: "var(--neon-glow)",
            border: "1px solid var(--neon-dim)",
            color: "var(--neon)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="text-base font-bold truncate transition-colors duration-200 group-hover:text-[var(--neon)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {slug}
          </p>
          <div className="flex items-center gap-3 mt-1">
            {repo.language && (
              <span
                className="text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                {repo.language}
              </span>
            )}
            {repo.stargazers_count > 0 && (
              <span
                className="flex items-center gap-1 text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                <FaStar size={9} /> {repo.stargazers_count}
              </span>
            )}
            {repo.forks_count > 0 && (
              <span
                className="flex items-center gap-1 text-[11px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                <FaCodeBranch size={9} /> {repo.forks_count}
              </span>
            )}
          </div>
        </div>

        <span
          className="text-base opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
          style={{ color: "var(--neon)" }}
        >
          ↗
        </span>
      </div>

      <div className="h-px mb-4" style={{ background: "var(--border)" }} />

      <p
        className="text-sm leading-relaxed line-clamp-3"
        style={{ color: "var(--text-muted)" }}
      >
        {repo.description || "// no description provided"}
      </p>

      {repo.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {repo.skills.slice(0, 4).map((skill: string) => (
            <span key={skill} className="tag-chip">{skill}</span>
          ))}
          {repo.skills.length > 4 && (
            <span
              className="text-[10px] px-1.5"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
            >
              +{repo.skills.length - 4}
            </span>
          )}
        </div>
      )}
    </motion.a>
  );
};

const RepoRow = ({ repo, index }: { repo: any; index: number }) => {
  const slug = formatRepoName(repo.name);
  const initials = slug.slice(0, 2).toUpperCase();

  return (
    <motion.a
      animate={{ opacity: 1, x: 0 }}
      className="group relative rounded-xl flex gap-3 p-3 cursor-pointer"
      href={repo.html_url}
      initial={{ opacity: 0, x: 16 }}
      rel="noopener noreferrer"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
      }}
      target="_blank"
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
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

      {/* Initials icon */}
      <div
        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-[10px] font-bold mt-0.5"
        style={{
          background: "var(--neon-glow)",
          border: "1px solid var(--neon-dim)",
          color: "var(--neon)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-1 mb-0.5">
          <p
            className="text-xs font-semibold truncate transition-colors duration-200 group-hover:text-[var(--neon)]"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            {slug}
          </p>
          <span
            className="text-xs flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            style={{ color: "var(--neon)" }}
          >
            ↗
          </span>
        </div>

        <p className="text-[11px] leading-relaxed line-clamp-1" style={{ color: "var(--text-muted)" }}>
          {repo.description || "// no description"}
        </p>

        <div className="flex items-center gap-2 mt-1">
          {repo.language && (
            <span
              className="text-[10px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
            >
              {repo.language}
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span
              className="flex items-center gap-0.5 text-[10px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
            >
              <FaStar size={7} /> {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span
              className="flex items-center gap-0.5 text-[10px]"
              style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
            >
              <FaCodeBranch size={7} /> {repo.forks_count}
            </span>
          )}
        </div>
      </div>
    </motion.a>
  );
};

const Repositories = () => {
  const { repos, fetchingRepos } = useReposContext();

  const featured = repos[0];
  const rest = repos.slice(1);

  return (
    <div>
      {fetchingRepos ? (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          <SkeletonFeatured />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4 mb-6">
          {/* Featured repo */}
          {featured && <FeaturedRepo repo={featured} />}

          {/* Scrollable list */}
          <div className="flex flex-col gap-2">
            <div
              className="flex flex-col gap-2 overflow-y-auto scrollbar-hide"
              style={{ maxHeight: 220 }}
            >
              {rest.map((repo, index) => (
                <RepoRow key={repo.id} index={index} repo={repo} />
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <a
                className="group flex items-center gap-2 text-xs font-medium transition-colors duration-200"
                href="https://github.com/birdra1n?tab=repositories"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                target="_blank"
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--neon)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                git clone github.com/birdra1n
                <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Repositories;
