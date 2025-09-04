import GitHubRepo from "@/types/github";

export interface GitHubRepoWithSkills extends GitHubRepo {
    skills: string[];
}

const getRepos = async (): Promise<GitHubRepoWithSkills[]> => {
    const response = await fetch("https://api.github.com/users/BirdRa1n/repos");

    if (!response.ok) {
        throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
    }

    const repos: GitHubRepo[] = await response.json();

    // Faz fetch das skills de cada repo em paralelo
    const reposWithSkills = await Promise.all(
        repos.map(async (repo) => {
            try {
                const langResponse = await fetch(repo.languages_url);
                const langs = langResponse.ok ? await langResponse.json() : {};
                const skills = Object.keys(langs);

                return { ...repo, skills };
            } catch (err) {
                console.error(`Erro ao buscar skills do repo ${repo.name}:`, err);
                return { ...repo, skills: [] };
            }
        })
    );

    // Ordena: primeiro quem tem descrição + mais skills, depois os outros
    reposWithSkills.sort((a, b) => {
        const aScore = (a.description ? 1 : 0) + a.skills.length;
        const bScore = (b.description ? 1 : 0) + b.skills.length;
        return bScore - aScore; // maior score primeiro
    });

    return reposWithSkills;
};

export default getRepos;
