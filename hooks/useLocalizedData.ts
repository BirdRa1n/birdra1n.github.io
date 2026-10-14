// hooks/useLocalizedData.ts
// Busca dados dependentes do idioma: espera o idioma real ser resolvido
// (evita buscar em pt e logo depois em en), cancela requests obsoletas
// e mantém o conteúdo anterior na tela enquanto troca de idioma.
import { useCallback, useEffect, useRef, useState } from "react";

import { useI18n, type Locale } from "@/i18n";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useLocalizedData<T>(
  fetcher: (locale: Locale, signal: AbortSignal) => Promise<T>,
  deps: unknown[] = [],
  { enabled = true }: { enabled?: boolean } = {},
): State<T> {
  const { locale, ready } = useI18n();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  const fetcherRef = useRef(fetcher);

  fetcherRef.current = fetcher;

  useEffect(() => {
    if (!ready || !enabled) return;

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetcherRef
      .current(locale, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((err) => {
        if (controller.signal.aborted || err?.name === "AbortError") return;
        console.error("[useLocalizedData]", err);
        setError(err?.message ?? "error");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, ready, enabled, nonce, ...deps]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data, loading, error, reload };
}
