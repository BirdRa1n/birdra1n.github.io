export function formatRepoName(repoName: string): string {
    return repoName
        .replace(/[-_]+/g, " ")        // troca "-" ou "_" por espaço
        .replace(/\s+/g, " ")          // remove espaços duplos
        .trim()                        // tira espaços extras no início/fim
        .replace(/\b\w/g, (char) => char.toUpperCase()); // deixa primeira letra de cada palavra maiúscula
}
