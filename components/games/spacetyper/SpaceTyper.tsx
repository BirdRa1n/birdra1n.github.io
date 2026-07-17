// components/games/spacetyper/SpaceTyper.tsx
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiZap, FiTrendingUp, FiHeart, FiAward, FiPlay } from "react-icons/fi";

import { GameStat } from "@/components/games/shared";

import { LASER_MS, SHIP_X, SHIP_Y } from "./engine";
import { useSpaceTyper } from "./useSpaceTyper";

const START_LIVES = 3;

// Fundo sempre escuro (cena espacial), independente do tema.
const FIELD_BG =
  "radial-gradient(circle at 50% 120%, #1a1430 0%, #0a0812 60%, #060409 100%)";

export function SpaceTyper() {
  const { engine, start, handleKey, best } = useSpaceTyper();
  const statusRef = useRef(engine.status);

  statusRef.current = engine.status;

  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      if (ev.metaKey || ev.ctrlKey || ev.altKey) return;

      if (statusRef.current === "playing") {
        if (ev.key === "Backspace" || ev.key === " " || ev.key.length === 1) {
          ev.preventDefault();
          handleKey(ev.key);
        }
      } else if (ev.key === " " || ev.key === "Enter") {
        ev.preventDefault();
        start();
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [handleKey, start]);

  const now = typeof performance !== "undefined" ? performance.now() : 0;

  return (
    <div>
      {/* HUD */}
      <div className="flex flex-wrap items-center gap-6 mb-4">
        <GameStat accent icon={FiZap} label="SCORE" value={engine.score} />
        <GameStat icon={FiTrendingUp} label="NÍVEL" value={engine.level} />
        <div className="flex items-center gap-1.5">
          {Array.from({ length: START_LIVES }).map((_, i) => (
            <FiHeart
              key={i}
              size={15}
              style={{
                color: i < engine.lives ? "var(--red)" : "var(--text-muted)",
                fill: i < engine.lives ? "var(--red)" : "transparent",
                opacity: i < engine.lives ? 1 : 0.3,
              }}
            />
          ))}
        </div>
        <div className="ml-auto">
          <GameStat icon={FiAward} label="BEST" value={best ?? "—"} />
        </div>
      </div>

      {/* Campo de jogo */}
      <div
        className="relative w-full overflow-hidden rounded-sm"
        style={{
          height: "clamp(360px, 58vh, 520px)",
          background: FIELD_BG,
          border: "1px solid var(--border)",
        }}
      >
        {/* Cometas */}
        {engine.comets.map((c) => {
          const isActive = c.id === engine.activeId;

          return (
            <div
              key={c.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 px-2 py-1 rounded-sm whitespace-nowrap"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                fontFamily: "var(--font-mono)",
                fontSize: "clamp(12px, 2.6vw, 15px)",
                background: isActive ? "rgba(167,139,250,0.12)" : "rgba(0,0,0,0.35)",
                border: `1px solid ${isActive ? "var(--neon)" : "rgba(167,139,250,0.25)"}`,
                boxShadow: isActive ? "0 0 16px var(--neon-glow)" : "none",
              }}
            >
              <span style={{ color: "var(--neon)", fontWeight: 700 }}>
                {c.word.slice(0, c.typed)}
              </span>
              <span style={{ color: "#c9c6e0" }}>{c.word.slice(c.typed)}</span>
            </div>
          );
        })}

        {/* Lasers + explosões (SVG esticado ao campo) */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          {engine.lasers.map((l) => {
            const p = Math.min((now - l.start) / LASER_MS, 1);

            return (
              <g key={l.id}>
                <line
                  opacity={1 - p}
                  stroke="var(--neon)"
                  strokeWidth={0.5}
                  x1={SHIP_X}
                  x2={l.x}
                  y1={SHIP_Y}
                  y2={l.y}
                />
                <circle
                  cx={l.x}
                  cy={l.y}
                  fill="none"
                  opacity={1 - p}
                  r={1.5 + p * 4}
                  stroke="var(--cyan)"
                  strokeWidth={0.6}
                />
              </g>
            );
          })}
        </svg>

        {/* Nave */}
        <div
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${SHIP_X}%`, top: `${SHIP_Y}%` }}
        >
          <svg height="26" viewBox="0 0 24 24" width="26">
            <path
              d="M12 2 L22 22 L12 17 L2 22 Z"
              fill="var(--neon)"
              style={{ filter: "drop-shadow(0 0 6px var(--neon-glow))" }}
            />
          </svg>
        </div>

        {/* Overlays */}
        <AnimatePresence>
          {engine.status !== "playing" && (
            <motion.div
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center gap-4 px-6"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              style={{ background: "rgba(6,4,9,0.72)", backdropFilter: "blur(2px)" }}
            >
              {engine.status === "over" ? (
                <>
                  <p
                    className="text-xs tracking-[0.3em] uppercase"
                    style={{ fontFamily: "var(--font-mono)", color: "var(--red)" }}
                  >
                    // game over
                  </p>
                  <p
                    className="text-5xl font-extrabold leading-none"
                    style={{ fontFamily: "var(--font-display)", color: "var(--neon)" }}
                  >
                    {engine.score}
                    <span
                      className="text-base ml-2 opacity-50"
                      style={{ fontFamily: "var(--font-mono)" }}
                    >
                      pts
                    </span>
                  </p>
                  <p
                    className="text-[11px] opacity-50"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    nível {engine.level} · recorde {best ?? engine.score}
                    {best === engine.score && engine.score > 0 ? " · 🏆 novo recorde!" : ""}
                  </p>
                </>
              ) : (
                <>
                  <p
                    className="text-2xl font-extrabold"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Space Typer
                  </p>
                  <p
                    className="text-xs opacity-50 max-w-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    Digite as palavras dos cometas para destruí-los antes que
                    atinjam sua nave. Palavras maiores valem mais pontos.
                  </p>
                </>
              )}

              <button className="ui-btn ui-btn-primary mt-1" type="button" onClick={start}>
                <FiPlay size={13} />
                {engine.status === "over" ? "JOGAR DE NOVO" : "INICIAR"}
              </button>
              <p
                className="text-[10px] opacity-30"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                use o teclado · Enter/Espaço para iniciar
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
          {"// digite a palavra do cometa mais próximo para travar a mira"}
        </p>
        <p className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
          recorde salvo localmente
        </p>
      </div>
    </div>
  );
}
