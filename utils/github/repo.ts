import GitHubRepo from "@/types/github";

export interface GitHubRepoWithSkills extends GitHubRepo {
    skills: string[];
}

const getRepos = async (): Promise<any[]> => {
    const response = await fetch("api/repos/github"); // rota que chama a Edge Function

    if (!response.ok) {
        throw new Error(`Erro ao buscar repositórios: ${response.statusText}`);
    }

    const data = await response.json();

    // data.repos contém os repositórios
    return data.repos as GitHubRepoWithSkills[];
};

export default getRepos;
