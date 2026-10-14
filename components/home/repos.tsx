// components/home/repos.tsx
// Carrossel horizontal nativo (scroll-snap): inércia e rubber-band do
// próprio sistema, sem reimplementar física.
import { FaCodeBranch, FaStar } from "react-icons/fa";

import { Reveal } from "@/components/motion";
import { siteConfig } from "@/config/site";
import { useReposContext } from "@/contexts/repos";
import { useI18n } from "@/i18n";
import { formatRepoName } from "@/utils/github/formatRepoName";

export default function Repositories() {
  const { t } = useI18n();
  const { repos, fetchingRepos } = useReposContext();

  if (!fetchingRepos && repos.length === 0) return null;

  return (
    <section className="section-y overflow-hidden">
      <div className="container-x">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="eyebrow">{t.home.reposEyebrow}</p>
            <h2 className="display-lg mt-3 max-w-[14ch]">{t.home.reposTitle}</h2>
          </div>
          <a className="link-arrow shrink-0" href={siteConfig.links.github} rel="noopener noreferrer" target="_blank">
            {t.home.reposCta} <span className="arrow">↗</span>
          </a>
        </Reveal>
      </div>

      <Reveal delay={0.1}>
        <ul
          className="mt-12 flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 px-5 md:px-[max(40px,calc((100vw-1200px)/2+40px))] scroll-px-5 md:scroll-px-[max(40px,calc((100vw-1200px)/2+40px))]"
        >
          {fetchingRepos && repos.length === 0
            ? Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="ui-skeleton shrink-0 w-[300px] h-[220px] !rounded-[28px]" />
              ))
            : repos.slice(0, 12).map((repo) => (
                <li key={repo.id} className="snap-start shrink-0 w-[78vw] sm:w-[320px]">
                  <a
                    className="surface surface-hover flex flex-col h-[230px] p-6"
                    href={repo.html_url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-center justify-between">
                      <span className="w-10 h-10 rounded-xl grid place-items-center text-[13px] font-semibold text-[var(--accent)] bg-[var(--accent-soft)]">
                        {formatRepoName(repo.name).slice(0, 2).toUpperCase()}
                      </span>
                      <span aria-hidden className="text-faint">
                        ↗
                      </span>
                    </div>
                    <h3 className="mt-4 text-[18px] font-semibold tracking-[-0.02em] truncate">
                      {formatRepoName(repo.name)}
                    </h3>
                    <p className="mt-2 text-[14px] text-muted leading-relaxed line-clamp-2">
                      {repo.description ?? "—"}
                    </p>
                    <div className="mt-auto flex items-center gap-4 text-[13px] text-faint">
                      {repo.language && <span>{repo.language}</span>}
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <FaStar size={11} /> {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          <FaCodeBranch size={11} /> {repo.forks_count}
                        </span>
                      )}
                    </div>
                  </a>
                </li>
              ))}
        </ul>
      </Reveal>
    </section>
  );
}
