// components/games/spacetyper/useSpaceTyper.ts
import { useCallback, useEffect, useReducer, useRef } from "react";

import { useHighScore } from "@/components/games/shared";
import type { GameStatus } from "@/components/games/shared";

import {
  Comet,
  Laser,
  LASER_MS,
  cometScore,
  levelConfig,
  levelForScore,
  spawnComet,
} from "./engine";

const HIT_Y = 93; // altura em que o cometa atinge a nave
const START_LIVES = 3;

interface Engine {
  status: GameStatus;
  comets: Comet[];
  lasers: Laser[];
  activeId: number | null;
  score: number;
  lives: number;
  level: number;
  lastTime: number;
  lastSpawn: number;
}

function createEngine(): Engine {
  return {
    status: "idle",
    comets: [],
    lasers: [],
    activeId: null,
    score: 0,
    lives: START_LIVES,
    level: 1,
    lastTime: 0,
    lastSpawn: 0,
  };
}

export function useSpaceTyper() {
  const engineRef = useRef<Engine>(createEngine());
  const rafRef = useRef<number | null>(null);
  const [, render] = useReducer((c: number) => c + 1, 0);
  const { best, submit } = useHighScore("spacetyper_best");

  const stop = useCallback(() => {
    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const loop = useCallback(
    (t: number) => {
      const e = engineRef.current;

      if (e.status !== "playing") return;

      const dt = e.lastTime ? Math.min((t - e.lastTime) / 1000, 0.05) : 0;

      e.lastTime = t;

      const cfg = levelConfig(e.level);

      // Move os cometas
      for (const c of e.comets) if (!c.dead) c.y += cfg.speed * dt;

      // Colisão com a nave → perde vida
      for (const c of e.comets) {
        if (!c.dead && c.y >= HIT_Y) {
          c.dead = true;
          e.lives -= 1;
          if (e.activeId === c.id) e.activeId = null;
        }
      }

      // Remove destruídos
      e.comets = e.comets.filter((c) => !c.dead);

      // Spawn
      if (t - e.lastSpawn > cfg.spawnMs && e.comets.length < cfg.maxComets) {
        e.lastSpawn = t;
        e.comets.push(spawnComet(e.level));
      }

      // Nível pela pontuação
      e.level = levelForScore(e.score);

      // Feixes de laser expiram
      e.lasers = e.lasers.filter((l) => t - l.start < LASER_MS);

      // Fim de jogo
      if (e.lives <= 0) {
        e.status = "over";
        submit(e.score);
        render();
        stop();

        return;
      }

      render();
      rafRef.current = requestAnimationFrame(loop);
    },
    [stop, submit]
  );

  const start = useCallback(() => {
    stop();
    const e = createEngine();

    e.status = "playing";
    e.lastSpawn = performance.now();
    e.comets.push(spawnComet(1));
    engineRef.current = e;
    render();
    rafRef.current = requestAnimationFrame(loop);
  }, [loop, stop]);

  const handleKey = useCallback(
    (key: string) => {
      const e = engineRef.current;

      if (e.status !== "playing") return;

      if (key === "Backspace") {
        const active = e.comets.find((c) => c.id === e.activeId);

        if (active) active.typed = 0;
        e.activeId = null;
        render();

        return;
      }

      // Só caracteres simples imprimíveis
      if (key.length !== 1) return;

      let active = e.comets.find((c) => c.id === e.activeId && !c.dead) ?? null;

      // Trava no cometa mais próximo da nave cuja palavra começa com a tecla
      if (!active) {
        const candidates = e.comets.filter((c) => !c.dead && c.word[0] === key);

        if (candidates.length === 0) return; // erro: ignorado
        active = candidates.reduce((a, b) => (b.y > a.y ? b : a));
        active.typed = 0;
        e.activeId = active.id;
      }

      if (active.word[active.typed] === key) {
        active.typed += 1;

        if (active.typed >= active.word.length) {
          // Destrói: dispara laser + pontua
          e.score += cometScore(active.word);
          e.lasers.push({
            id: active.id,
            x: active.x,
            y: active.y,
            start: performance.now(),
          });
          active.dead = true;
          e.activeId = null;
          e.comets = e.comets.filter((c) => !c.dead);
        }
      }
      // tecla errada com cometa travado: ignora (sem penalidade)

      render();
    },
    []
  );

  useEffect(() => stop, [stop]);

  return { engine: engineRef.current, start, handleKey, best };
}
