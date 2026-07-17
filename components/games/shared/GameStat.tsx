// components/games/shared/GameStat.tsx
import React from "react";

export interface GameStatProps {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  accent?: boolean;
}

/** Métrica compacta (ícone + valor + label) usada nas HUDs dos jogos. */
export function GameStat({ icon: Icon, label, value, accent }: GameStatProps) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon
        size={14}
        style={{ color: accent ? "var(--neon)" : "var(--text-muted)", opacity: accent ? 1 : 0.5 }}
      />
      <div className="leading-none">
        <span
          className="text-lg font-bold"
          style={{
            fontFamily: "var(--font-mono)",
            color: accent ? "var(--neon)" : "var(--text-primary)",
          }}
        >
          {value}
        </span>
        <span
          className="text-[9px] tracking-widest uppercase ml-1.5"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
