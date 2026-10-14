// utils/github/repo.ts
// Chama a Edge Function direto (sem passar por uma API route da Vercel),
// o que também funciona no export estático do GitHub Pages.
import type GitHubRepo from "@/types/github";

export interface GitHubRepoWithSkills extends GitHubRepo {
  skills: string[];
}

const getRepos = async (signal?: AbortSignal): Promise<GitHubRepoWithSkills[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/github-repos`,
    { signal },
  );

  if (!response.ok) {
    throw new Error(`Erro ao buscar repositórios: ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data) ? (data as GitHubRepoWithSkills[]) : [];
};

export default getRepos;
