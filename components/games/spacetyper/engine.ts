// components/games/spacetyper/engine.ts
// Regras puras do Space Typer (config de dificuldade, spawn, pontuação).
// Coordenadas em porcentagem do campo de jogo (0–100) para ser responsivo.

import { randomWord } from "@/components/games/shared";

export interface Comet {
  id: number;
  word: string;
  x: number; // 0–100 (horizontal)
  y: number; // 0–100 (vertical, cresce descendo)
  typed: number; // nº de letras já digitadas corretamente
  dead: boolean;
}

export interface Laser {
  id: number;
  x: number;
  y: number;
  start: number; // performance.now() do disparo
}

export interface LevelConfig {
  speed: number; // % por segundo
  spawnMs: number; // intervalo entre spawns
  maxComets: number;
  minLen: number;
  maxLen: number;
}

export const SHIP_X = 50;
export const SHIP_Y = 96;
export const LASER_MS = 200; // duração do feixe

export function levelForScore(score: number): number {
  return 1 + Math.floor(score / 60);
}

export function levelConfig(level: number): LevelConfig {
  return {
    speed: 5.5 + level * 1.8,
    spawnMs: Math.max(2200 - level * 200, 650),
    maxComets: Math.min(3 + level, 9),
    minLen: Math.min(3 + Math.floor(level / 3), 6),
    maxLen: Math.min(4 + level, 13),
  };
}

let cometSeq = 0;

export function spawnComet(level: number): Comet {
  const { minLen, maxLen } = levelConfig(level);

  return {
    id: ++cometSeq,
    word: randomWord(minLen, maxLen),
    x: 8 + Math.random() * 84, // margem das bordas
    y: -4,
    typed: 0,
    dead: false,
  };
}

/** Pontos por cometa destruído (palavras maiores valem mais). */
export function cometScore(word: string): number {
  return word.length;
}
