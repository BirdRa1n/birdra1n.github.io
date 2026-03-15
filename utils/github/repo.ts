// utils/github/repo.ts
import type GitHubRepo from "@/types/github";

export interface GitHubRepoWithSkills extends GitHubRepo {
  skills: string[];
}

const getRepos = async (signal?: AbortSignal): Promise<GitHubRepoWithSkills[]> => {
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://birdra1n.vercel.app"
      : "";

  const response = await fetch(`${baseUrl}/api/repos/github`, { signal });

  if (!response.ok) {
    throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
  }

  const data = await response.json();
  const repos = (data.repos ?? []) as GitHubRepoWithSkills[];

  return repos.sort((a, b) => (b.skills?.length ?? 0) - (a.skills?.length ?? 0));
};

export default getRepos;
