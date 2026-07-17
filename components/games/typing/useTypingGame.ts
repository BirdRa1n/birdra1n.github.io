// components/games/typing/useTypingGame.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { randomWords, useHighScore } from "@/components/games/shared";

import { pickSnippet } from "./snippets";

export type TypingMode = "snippet" | "timed";

export const TIMED_DURATION = 60; // segundos
const TIMED_CHUNK = 40; // palavras geradas por lote no modo cronometrado

function buildTarget(mode: TypingMode): string {
  return mode === "snippet" ? pickSnippet() : randomWords(TIMED_CHUNK).join(" ");
}

export interface TypingStats {
  wpm: number;
  accuracy: number;
  seconds: string;
  timeLeft: number;
  finished: boolean;
  isRecord: boolean;
}

/**
 * Lógica do teste de digitação, isolada da apresentação.
 * - "snippet": digitar um trecho de código até o fim.
 * - "timed": 60s digitando um fluxo infinito de palavras aleatórias.
 */
export function useTypingGame(mode: TypingMode) {
  const [target, setTarget] = useState("");
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [isRecord, setIsRecord] = useState(false);
  const [now, setNow] = useState(0);

  const { best, submit } = useHighScore(
    mode === "snippet" ? "typing_snippet_best" : "typing_timed_best"
  );

  const startFresh = useCallback(
    (nextTarget: boolean) => {
      if (nextTarget) setTarget(buildTarget(mode));
      setTyped("");
      setStartedAt(null);
      setFinishedAt(null);
      setIsRecord(false);
      setNow(0);
    },
    [mode]
  );

  // (Re)inicializa ao montar e ao trocar de modo.
  useEffect(() => {
    startFresh(true);
  }, [startFresh]);

  const finalize = useCallback(
    (chars: number, start: number, end: number) => {
      const minutes = Math.max((end - start) / 60000, 1 / 60000);
      const wpm = Math.round(chars / 5 / minutes);

      setFinishedAt(end);
      setIsRecord(submit(wpm));
    },
    [submit]
  );

  // Timer: atualiza o relógio e encerra o modo cronometrado aos 60s.
  useEffect(() => {
    if (!startedAt || finishedAt) return;

    const id = setInterval(() => {
      const t = Date.now();

      setNow(t);
      if (mode === "timed" && t - startedAt >= TIMED_DURATION * 1000) {
        finalize(typed.length, startedAt, startedAt + TIMED_DURATION * 1000);
      }
    }, 100);

    return () => clearInterval(id);
  }, [startedAt, finishedAt, mode, typed.length, finalize]);

  const handleType = useCallback(
    (value: string) => {
      if (finishedAt) return;

      let v = value;

      if (mode === "snippet" && v.length > target.length) v = v.slice(0, target.length);
      if (!startedAt && v.length > 0) setStartedAt(Date.now());

      // No modo cronometrado, estende o alvo antes de o usuário alcançar o fim.
      if (mode === "timed" && v.length > target.length - 20) {
        setTarget((t) => `${t} ${randomWords(TIMED_CHUNK).join(" ")}`);
      }

      setTyped(v);

      if (mode === "snippet" && v.length === target.length && target.length > 0) {
        finalize(target.length, startedAt ?? Date.now(), Date.now());
      }
    },
    [finishedAt, mode, target.length, startedAt, finalize]
  );

  const reset = useCallback((nextTarget = true) => startFresh(nextTarget), [startFresh]);

  const correctChars = useMemo(() => {
    let n = 0;

    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === target[i]) n++;
    }

    return n;
  }, [typed, target]);

  const stats: TypingStats = useMemo(() => {
    const finished = finishedAt != null;
    const endT = finished ? finishedAt! : now;
    const activeMs = startedAt ? Math.max(0, endT - startedAt) : 0;
    const minutes = activeMs / 60000;
    const wpm = minutes > 0 ? Math.round(typed.length / 5 / minutes) : 0;
    const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100;
    const timeLeft =
      mode === "timed" ? Math.max(0, Math.ceil(TIMED_DURATION - activeMs / 1000)) : 0;

    return {
      wpm,
      accuracy,
      seconds: (activeMs / 1000).toFixed(1),
      timeLeft,
      finished,
      isRecord,
    };
  }, [finishedAt, now, startedAt, typed.length, correctChars, mode, isRecord]);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const focus = useCallback(() => inputRef.current?.focus(), []);

  return { mode, target, typed, stats, best, handleType, reset, inputRef, focus };
}
