// components/games/shared/useHighScore.ts
import { useCallback, useEffect, useState } from "react";

/**
 * Recorde persistido em localStorage por chave. `submit` só grava se o
 * novo valor for maior que o atual, e retorna se bateu recorde.
 */
export function useHighScore(key: string) {
  const [best, setBest] = useState<number | null>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(key));

    if (stored) setBest(stored);
  }, [key]);

  const submit = useCallback(
    (score: number): boolean => {
      let isRecord = false;

      setBest((prev) => {
        if (prev != null && score <= prev) return prev;
        isRecord = true;
        localStorage.setItem(key, String(score));

        return score;
      });

      return isRecord;
    },
    [key]
  );

  return { best, submit };
}
