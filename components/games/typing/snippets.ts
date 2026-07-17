// components/games/typing/snippets.ts
export const SNIPPETS: readonly string[] = [
  `const greet = (name) => {\n  return \`Hello, \${name}!\`;\n};`,
  `function fib(n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}`,
  `const total = items.reduce((a, b) => a + b.price, 0);`,
  `type User = {\n  id: string;\n  name: string;\n  active: boolean;\n};`,
  `export async function main() {\n  const res = await fetch("/api/data");\n  return res.json();\n}`,
  `const unique = [...new Set(values)].sort();`,
  `for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}`,
  `const [state, setState] = useState(() => ({ ready: false }));`,
] as const;

export function pickSnippet(exclude?: string): string {
  let s = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];

  if (exclude && SNIPPETS.length > 1) {
    while (s === exclude) s = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
  }

  return s;
}
