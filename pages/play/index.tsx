// pages/play/index.tsx — Hub de minigames
import { useState } from "react";
import { motion } from "framer-motion";
import { FiType, FiTarget } from "react-icons/fi";

import { SpaceTyper, TypingGame } from "@/components/games";
import DefaultLayout from "@/layouts/default";

type GameId = "typing" | "space";

const GAMES: {
  id: GameId;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  tagline: string;
}[] = [
  { id: "typing", label: "Typing Test", icon: FiType, tagline: "velocidade & precisão" },
  { id: "space", label: "Space Typer", icon: FiTarget, tagline: "destrua os cometas" },
];

export default function PlayPage() {
  const [active, setActive] = useState<GameId>("typing");

  return (
    <DefaultLayout>
      <section className="max-w-3xl mx-auto py-12 md:py-20">
        {/* Header */}
        <motion.div animate={{ opacity: 1, y: 0 }} className="mb-8" initial={{ opacity: 0, y: 20 }}>
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs tracking-[0.3em] opacity-50"
              style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            >
              ~/play
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>
          <h1
            className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Arcade
          </h1>
          <p className="text-sm opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
            {"// Dois minigames pra treinar os dedos"}
          </p>
        </motion.div>

        {/* Seletor de jogo */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {GAMES.map((game) => {
            const isActive = active === game.id;
            const Icon = game.icon;

            return (
              <button
                key={game.id}
                className="flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-all"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isActive ? "var(--neon-glow)" : "var(--bg-card)",
                  border: `1px solid ${isActive ? "var(--neon)" : "var(--border)"}`,
                }}
                type="button"
                onClick={() => setActive(game.id)}
              >
                <div
                  className="w-9 h-9 rounded-sm flex items-center justify-center flex-shrink-0"
                  style={{
                    background: isActive
                      ? "color-mix(in srgb, var(--neon) 15%, transparent)"
                      : "var(--bg-card-alt)",
                    border: `1px solid ${isActive ? "var(--neon)" : "var(--border)"}`,
                    color: isActive ? "var(--neon)" : "var(--text-muted)",
                  }}
                >
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p
                    className="text-sm font-bold truncate"
                    style={{ color: isActive ? "var(--neon)" : "var(--text-primary)" }}
                  >
                    {game.label}
                  </p>
                  <p className="text-[10px] opacity-40 truncate">{game.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Jogo ativo */}
        <motion.div
          key={active}
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {active === "typing" ? <TypingGame /> : <SpaceTyper />}
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
