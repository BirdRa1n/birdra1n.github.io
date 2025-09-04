import GitHubRepo from "@/types/github";

export interface GitHubRepoWithSkills extends GitHubRepo {
    skills: string[];
}

const getRepos = async (): Promise<any[]> => {
    const response = await fetch("api/repos/github");

    if (!response.ok) {
        throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
    }

    const data = await response.json();

    const reposWithSkills = data.repos as GitHubRepoWithSkills[];

    // Ordena os repositórios com base na quantidade de skills em ordem decrescente
    const sortedRepos = reposWithSkills.sort((a, b) => {
        const aSkillsCount = (a.skills && a.skills.length) || 0;
        const bSkillsCount = (b.skills && b.skills.length) || 0;

        return bSkillsCount - aSkillsCount;
    });

    return sortedRepos;
};

export default getRepos;