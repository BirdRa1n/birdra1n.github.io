import GitHubRepo from "@/types/github";

const getRepos = async (): Promise<GitHubRepo[]> => {
    const response = await fetch('https://api.github.com/users/BirdRa1n/repos');

    if (!response.ok) {
        throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
    }

    const data: GitHubRepo[] = await response.json();
    return data;
};

export default getRepos;