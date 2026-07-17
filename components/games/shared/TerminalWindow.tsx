// components/games/shared/TerminalWindow.tsx
import React from "react";

export interface TerminalWindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

/** Janela estilo terminal reutilizada pelos minigames. */
export function TerminalWindow({ title, children, className = "" }: TerminalWindowProps) {
  return (
    <div className={`terminal-window ${className}`}>
      <div className="terminal-header">
        <div className="terminal-dots">
          <div className="terminal-dot" style={{ background: "#FF5F57" }} />
          <div className="terminal-dot" style={{ background: "#FEBC2E" }} />
          <div className="terminal-dot" style={{ background: "#28C840" }} />
        </div>
        <span
          className="text-xs"
          style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
        >
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
