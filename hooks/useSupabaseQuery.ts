// hooks/useSupabaseQuery.ts
import { useEffect, useRef, useState } from "react";

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook genérico para queries Supabase com:
 * - AbortController automático
 * - Sem re-fetch em StrictMode (ref guard)
 * - Estado de loading/error centralizado
 */
export function useSupabaseQuery<T>(
  queryFn: (signal: AbortSignal) => Promise<{ data: T | null; error: any }>,
  deps: any[] = []
): QueryState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const counterRef = useRef(0);

  const execute = () => {
    const controller = new AbortController();
    const id = ++counterRef.current;
    setLoading(true);
    setError(null);

    queryFn(controller.signal)
      .then(({ data: result, error: err }) => {
        if (controller.signal.aborted || id !== counterRef.current) return;
        if (err) setError(err.message ?? "Erro desconhecido");
        else setData(result);
      })
      .catch((err) => {
        if (controller.signal.aborted || id !== counterRef.current) return;
        setError(err?.message ?? "Erro desconhecido");
      })
      .finally(() => {
        if (!controller.signal.aborted && id === counterRef.current) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  };

  useEffect(() => {
    return execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch: execute };
}
