// components/games/typing/TypingGame.tsx
import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiChevronRight, FiZap, FiTarget, FiClock, FiAward } from "react-icons/fi";

import { GameStat, TerminalWindow } from "@/components/games/shared";

import { TypingMode, useTypingGame } from "./useTypingGame";

const LINE_HEIGHT = "2rem";

function charStyle(
  state: "correct" | "wrong" | "pending",
  current: boolean
): React.CSSProperties {
  const base: React.CSSProperties = { borderRadius: 2 };

  if (current) {
    base.background = "var(--neon-glow)";
    base.boxShadow = "inset 2px 0 0 var(--neon)";
  }
  if (state === "correct") base.color = "var(--neon)";
  else if (state === "wrong") {
    base.color = "var(--red)";
    base.background = current
      ? "var(--neon-glow)"
      : "color-mix(in srgb, var(--red) 18%, transparent)";
  } else {
    base.color = "var(--text-muted)";
    base.opacity = 0.55;
  }

  return base;
}

const ModeButton = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    className="text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-sm transition-all"
    style={{
      fontFamily: "var(--font-mono)",
      background: active ? "var(--neon-glow)" : "transparent",
      border: `1px solid ${active ? "var(--neon)" : "var(--border)"}`,
      color: active ? "var(--neon)" : "var(--text-muted)",
    }}
    type="button"
    onClick={onClick}
  >
    {children}
  </button>
);

export function TypingGame() {
  const [mode, setMode] = useState<TypingMode>("snippet");
  const { target, typed, stats, best, handleType, reset, inputRef, focus } =
    useTypingGame(mode);

  // Scroll do fluxo de palavras (modo cronometrado): mantém a linha atual no topo.
  const currentRef = useRef<HTMLSpanElement>(null);
  const [offset, setOffset] = useState(0);

  useLayoutEffect(() => {
    if (mode !== "timed") {
      setOffset(0);

      return;
    }
    if (currentRef.current) setOffset(currentRef.current.offsetTop);
  }, [typed, target, mode]);

  const timedFinished = stats.finished;

  return (
    <div>
      {/* Seletor de modo */}
      <div className="flex items-center gap-2 mb-4">
        <ModeButton active={mode === "snippet"} onClick={() => setMode("snippet")}>
          código
        </ModeButton>
        <ModeButton active={mode === "timed"} onClick={() => setMode("timed")}>
          60s
        </ModeButton>
      </div>

      <TerminalWindow title="typing_test.sh">
        {/* Stats */}
        <div
          className="flex flex-wrap items-center gap-6 px-5 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <GameStat accent icon={FiZap} label="WPM" value={stats.wpm} />
          <GameStat icon={FiTarget} label="ACC" value={`${stats.accuracy}%`} />
          {mode === "timed" ? (
            <GameStat icon={FiClock} label="TEMPO" value={`${stats.timeLeft}s`} />
          ) : (
            <GameStat icon={FiClock} label="SEG" value={stats.seconds} />
          )}
          <div className="ml-auto">
            <GameStat icon={FiAward} label="BEST" value={best ?? "—"} />
          </div>
        </div>

        {/* Área de digitação */}
        <div className="relative p-5 sm:p-6 cursor-text" onClick={focus}>
          <div
            aria-hidden
            style={{
              height: mode === "timed" ? "6rem" : undefined,
              overflow: "hidden",
            }}
          >
            <div
              className="text-sm sm:text-base select-none"
              style={{
                fontFamily: "var(--font-mono)",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                lineHeight: LINE_HEIGHT,
                transform: `translateY(-${offset}px)`,
                transition: "transform 0.15s ease",
              }}
            >
              {target.split("").map((ch, i) => {
                const state =
                  i < typed.length ? (typed[i] === ch ? "correct" : "wrong") : "pending";
                const isCurrent = i === typed.length && !timedFinished;
                const display = ch === "\n" ? "↵\n" : ch;

                return (
                  <span
                    key={i}
                    ref={isCurrent ? currentRef : undefined}
                    style={charStyle(state, isCurrent)}
                  >
                    {display}
                  </span>
                );
              })}
            </div>
          </div>

          {!typed && (
            <motion.p
              animate={{ opacity: 1 }}
              className="mt-5 text-[11px] tracking-wider"
              initial={{ opacity: 0 }}
              style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            >
              <span className="cursor-blink">▌</span>{" "}
              {mode === "timed"
                ? "clique e digite o máximo de palavras em 60s…"
                : "clique aqui e comece a digitar…"}
            </motion.p>
          )}

          <textarea
            ref={inputRef}
            aria-label="Área de digitação do teste"
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full resize-none opacity-0"
            maxLength={mode === "snippet" ? target.length : undefined}
            spellCheck={false}
            style={{ caretColor: "transparent" }}
            value={typed}
            onChange={(e) => handleType(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Tab") e.preventDefault();
            }}
          />
        </div>

        {/* Resultado */}
        {timedFinished && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="overflow-hidden"
            initial={{ opacity: 0, height: 0 }}
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <div className="p-5 sm:p-6 flex flex-wrap items-center gap-x-8 gap-y-4">
              <div>
                <p
                  className="text-4xl font-extrabold leading-none"
                  style={{ fontFamily: "var(--font-display)", color: "var(--neon)" }}
                >
                  {stats.wpm}
                  <span
                    className="text-sm ml-1.5 opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    wpm
                  </span>
                </p>
                <p
                  className="text-[10px] tracking-widest uppercase mt-1 opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {stats.accuracy}% precisão
                  {mode === "timed" ? " · 60s" : ` · ${stats.seconds}s`}
                  {stats.isRecord && stats.wpm > 0 ? " · 🏆 novo recorde!" : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {mode === "snippet" ? (
                  <>
                    <button
                      className="ui-btn ui-btn-ghost-muted"
                      type="button"
                      onClick={() => {
                        reset(false);
                        setTimeout(focus, 0);
                      }}
                    >
                      <FiRefreshCw size={13} /> REPETIR
                    </button>
                    <button
                      className="ui-btn ui-btn-primary"
                      type="button"
                      onClick={() => {
                        reset(true);
                        setTimeout(focus, 0);
                      }}
                    >
                      PRÓXIMO <FiChevronRight size={13} />
                    </button>
                  </>
                ) : (
                  <button
                    className="ui-btn ui-btn-primary"
                    type="button"
                    onClick={() => {
                      reset(true);
                      setTimeout(focus, 0);
                    }}
                  >
                    <FiRefreshCw size={13} /> JOGAR DE NOVO
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </TerminalWindow>

      <div className="mt-5 flex items-center justify-between">
        <button
          className="text-xs ui-link-muted inline-flex items-center gap-1.5"
          type="button"
          onClick={() => {
            reset(true);
            setTimeout(focus, 0);
          }}
        >
          <FiRefreshCw size={11} /> {mode === "timed" ? "reiniciar" : "novo snippet"}
        </button>
        <p className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
          recorde salvo localmente
        </p>
      </div>
    </div>
  );
}
