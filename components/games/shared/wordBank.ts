// components/games/shared/wordBank.ts
// Banco de palavras: termos comuns de programação de várias linguagens
// (JS/TS, Python, Rust, Go, C…). Tudo em minúsculo para manter o jogo
// da nave justo (sem precisar de Shift no meio da ação).

export const WORD_BANK: readonly string[] = [
  // curtas (2–4)
  "if", "for", "let", "var", "fn", "def", "try", "map", "new", "int",
  "and", "not", "get", "set", "key", "val", "ptr", "ref", "nil", "end",
  "use", "mod", "pub", "str", "num", "arr", "obj", "run", "log", "add",
  // médias (5–7)
  "const", "async", "await", "yield", "class", "break", "match", "while",
  "catch", "throw", "print", "range", "slice", "spawn", "defer", "trait",
  "impl", "enum", "stack", "queue", "tuple", "float", "bytes", "macro",
  "token", "route", "hooks", "props", "state", "event", "query", "index",
  "cache", "mutex", "clone", "debug", "panic", "unwrap", "vector", "struct",
  "return", "import", "export", "lambda", "static", "public", "buffer",
  "thread", "socket", "cursor", "schema", "column", "commit", "branch",
  // longas (8–13)
  "function", "promise", "iterator", "closure", "generic", "pointer",
  "boolean", "package", "goroutine", "interface", "lifetime", "borrow",
  "recursion", "decorator", "callback", "reducer", "selector", "component",
  "namespace", "abstract", "override", "readonly", "volatile", "register",
  "template", "inheritance", "serialize", "middleware", "dispatch",
  "constructor", "prototype", "asynchronous", "concurrency", "allocator",
  "compiler", "runtime", "exception", "assertion", "algorithm", "delegate",
] as const;

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/** Palavra aleatória dentro de uma faixa de tamanho (com fallback seguro). */
export function randomWord(minLen = 2, maxLen = 20): string {
  const pool = WORD_BANK.filter((w) => w.length >= minLen && w.length <= maxLen);
  const source = pool.length > 0 ? pool : WORD_BANK;

  return source[randInt(0, source.length - 1)];
}

/** N palavras aleatórias (usado no modo cronometrado). */
export function randomWords(n: number, minLen = 2, maxLen = 20): string[] {
  return Array.from({ length: n }, () => randomWord(minLen, maxLen));
}
