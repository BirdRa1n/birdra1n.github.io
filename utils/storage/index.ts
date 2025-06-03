const storage = {
    getItem: (key: string): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(key);
        }
        return null;
    }
    ,
    setItem: (key: string, value: any): void => {
        if (typeof window !== 'undefined') {
            // verificar se é um objeto e converter para JSON
            if (typeof value === 'object') {
                value = JSON.stringify(value);
            }
            // verificar se é uma string e não está vazia
            if (typeof value === 'string' && value.trim() === '') {
                value = null; // ou lançar um erro, dependendo da lógica desejada
            }
            localStorage.setItem(key, value);
        }
    },
    removeItem: (key: string): void => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(key);
        }
    }
    ,
    clear: (): void => {
        if (typeof window !== 'undefined') {
            localStorage.clear();
        }
    }
};
export default storage;