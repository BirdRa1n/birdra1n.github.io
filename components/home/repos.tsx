// components/home/repos.tsx
import { motion } from "framer-motion";
import { FaStar, FaCodeBranch } from "react-icons/fa";

import { formatRepoName } from "@/utils/github/formatRepoName";
import { useReposContext } from "@/contexts/repos";

const RepoSkeleton = () => (
  <div
    className="h-[190px] rounded-sm animate-pulse"
    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
  />
);

const RepoCard = ({ repo, index }: { repo: any; index: number }) => (
  <motion.a
    animate={{ opacity: 1, y: 0 }}
    className="group relative flex flex-col p-4 rounded-sm overflow-hidden cursor-pointer"
    href={repo.html_url}
    initial={{ opacity: 0, y: 16 }}
    rel="noopener noreferrer"
    style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      transition: "border-color 0.25s, box-shadow 0.25s",
      height: 190,
    }}
    target="_blank"
    transition={{ delay: index * 0.04, duration: 0.4 }}
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
    {/* Top bar accent */}
    <div
      className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ background: "linear-gradient(90deg, var(--neon), transparent)" }}
    />

    {/* Header */}
    <div className="flex items-start gap-3 mb-2">
      <div
        className="w-8 h-8 rounded-sm flex-shrink-0 flex items-center justify-center text-[10px] font-bold"
        style={{
          background: "rgba(0,255,135,0.08)",
          border: "1px solid rgba(0,255,135,0.2)",
          color: "var(--neon)",
          fontFamily: "var(--font-mono)",
        }}
      >
        GH
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-semibold truncate group-hover:text-[var(--neon)] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {formatRepoName(repo.name)}
        </p>
        <div className="flex items-center gap-3 mt-0.5">
          {repo.stargazers_count > 0 && (
            <span
              className="flex items-center gap-1 text-[10px] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <FaStar size={9} />
              {repo.stargazers_count}
            </span>
          )}
          {repo.forks_count > 0 && (
            <span
              className="flex items-center gap-1 text-[10px] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <FaCodeBranch size={9} />
              {repo.forks_count}
            </span>
          )}
          {repo.language && (
            <span
              className="text-[10px] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {repo.language}
            </span>
          )}
        </div>
      </div>

      <span
        className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: "var(--neon)", fontFamily: "var(--font-mono)" }}
      >
        ↗
      </span>
    </div>

    {/* Divider */}
    <div className="h-px my-2" style={{ background: "var(--border)" }} />

    {/* Description */}
    <p
      className="text-xs leading-relaxed opacity-40 line-clamp-2 flex-1"
      style={{ fontFamily: "var(--font-body)" }}
    >
      {repo.description || "// no description"}
    </p>

    {/* Skills */}
    {repo.skills?.length > 0 && (
      <div className="flex flex-wrap gap-1 mt-3">
        {repo.skills.slice(0, 4).map((skill: string) => (
          <span key={skill} className="tag-chip">
            {skill}
          </span>
        ))}
        {repo.skills.length > 4 && (
          <span
            className="text-[10px] px-2 py-0.5 opacity-30"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            +{repo.skills.length - 4}
          </span>
        )}
      </div>
    )}
  </motion.a>
);

const Repositories = () => {
  const { repos, fetchingRepos } = useReposContext();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {fetchingRepos
          ? Array.from({ length: 6 }).map((_, i) => <RepoSkeleton key={i} />)
          : repos.map((repo, index) => (
              <RepoCard key={repo.id} index={index} repo={repo} />
            ))}
      </div>

      <div className="flex justify-end">
        <a
          className="flex items-center gap-2 text-xs tracking-widest transition-opacity hover:opacity-100 opacity-50"
          href="https://github.com/birdra1n?tab=repositories"
          rel="noopener noreferrer"
          style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
          target="_blank"
        >
          ALL_REPOS_ON_GITHUB
          <span>↗</span>
        </a>
      </div>
    </div>
  );
};

export default Repositories;
