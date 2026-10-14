// i18n/index.tsx
// Tradução da interface (pt / en / es) detectada pelo idioma do sistema.
// Sem rotas por idioma: o site é exportado estático, então a detecção
// acontece no client — a escolha manual do usuário fica no localStorage.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import en from "./locales/en";
import es from "./locales/es";
import pt, { type Dictionary } from "./locales/pt";

import type { Locale } from "@/types/database";

export type { Locale };

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "pt", label: "Português", short: "PT" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
];

const DICTIONARIES: Record<Locale, Dictionary> = { pt, en, es };

/** Tag BCP 47 usada em <html lang> e no Intl. */
export const INTL_TAG: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
};

const DEFAULT_LOCALE: Locale = "pt";
const FALLBACK_LOCALE: Locale = "en";
const STORAGE_KEY = "locale";

function isLocale(value: unknown): value is Locale {
  return value === "pt" || value === "en" || value === "es";
}

/** Primeiro idioma do sistema que o site suporta; inglês para o resto. */
export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;

  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];

  for (const pref of prefs) {
    const base = pref?.slice(0, 2).toLowerCase();

    if (isLocale(base)) return base;
  }

  return FALLBACK_LOCALE;
}

function readStoredLocale(): Locale | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

// useLayoutEffect no client (troca antes do paint), useEffect no SSR.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

interface I18nContextValue {
  locale: Locale;
  t: Dictionary;
  setLocale: (locale: Locale) => void;
  /** true depois que o idioma real do usuário foi resolvido. */
  ready: boolean;
  formatDate: (date: string | Date, opts?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (n: number) => string;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const [ready, setReady] = useState(false);

  useIsoLayoutEffect(() => {
    setLocaleState(readStoredLocale() ?? detectLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = INTL_TAG[locale];
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* modo privado — segue só em memória */
    }
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const tag = INTL_TAG[locale];

    return {
      locale,
      t: DICTIONARIES[locale],
      setLocale,
      ready,
      formatDate: (date, opts = { day: "numeric", month: "short", year: "numeric" }) => {
        // Datas puras ("2025-11-01") são meia-noite UTC: formatar no fuso
        // local mostraria o dia/mês anterior no Brasil.
        const dateOnly = typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date);

        return new Intl.DateTimeFormat(tag, dateOnly ? { ...opts, timeZone: "UTC" } : opts).format(new Date(date));
      },
      formatNumber: (n) => new Intl.NumberFormat(tag).format(n),
    };
  }, [locale, ready, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);

  if (!ctx) throw new Error("useI18n must be used within I18nProvider");

  return ctx;
}
