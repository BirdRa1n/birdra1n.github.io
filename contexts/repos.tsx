// contexts/repos.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useMemo,
  ReactNode,
} from "react";

import type GitHubRepo from "@/types/github";
import getRepos from "@/utils/github/repo";
import storage from "@/utils/storage";

interface ReposContextType {
  repos: GitHubRepo[];
  fetchingRepos: boolean;
}

const ReposContext = createContext<ReposContextType | undefined>(undefined);

export function ReposProvider({ children }: { children: ReactNode }) {
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [fetchingRepos, setFetchingRepos] = useState(true);

  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const cached = storage.getItem("repos");
    if (cached) {
      try {
        setRepos(JSON.parse(cached) as GitHubRepo[]);
        setFetchingRepos(false);
      } catch { /* ignora */ }
    }

    const controller = new AbortController();

    getRepos(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setRepos(data);
        storage.setItem("repos", data);
      })
      .catch((err) => {
        if (err?.name === "AbortError") return;
        console.error("[Repos] fetch error:", err);
      })
      .finally(() => {
        if (!controller.signal.aborted) setFetchingRepos(false);
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(() => ({ repos, fetchingRepos }), [repos, fetchingRepos]);

  return <ReposContext.Provider value={value}>{children}</ReposContext.Provider>;
}

export function useReposContext() {
  const context = useContext(ReposContext);
  if (!context) throw new Error("useReposContext must be used within ReposProvider");
  return context;
}
