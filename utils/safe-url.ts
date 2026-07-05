// utils/safe-url.ts
// Só permite http(s) em URLs vindas do banco (defesa contra
// javascript:/data: em href caso uma conta admin seja comprometida).
export function safeUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;

  try {
    const parsed = new URL(url, "https://placeholder.invalid");

    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {
    /* URL inválida */
  }

  return undefined;
}
