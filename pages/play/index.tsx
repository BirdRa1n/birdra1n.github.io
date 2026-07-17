// pages/play/index.tsx — Minigame: teste de digitação (WPM)
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiRefreshCw, FiChevronRight, FiZap, FiTarget, FiClock, FiAward } from "react-icons/fi";

import DefaultLayout from "@/layouts/default";

const SNIPPETS = [
  `const greet = (name) => {\n  return \`Hello, \${name}!\`;\n};`,
  `function fib(n) {\n  if (n < 2) return n;\n  return fib(n - 1) + fib(n - 2);\n}`,
  `const total = items.reduce((a, b) => a + b.price, 0);`,
  `type User = {\n  id: string;\n  name: string;\n  active: boolean;\n};`,
  `export async function main() {\n  const res = await fetch("/api/data");\n  return res.json();\n}`,
  `const unique = [...new Set(values)].sort();`,
  `for (let i = 0; i < arr.length; i++) {\n  console.log(arr[i]);\n}`,
  `const [state, setState] = useState(() => ({ ready: false }));`,
];

const BEST_KEY = "typing_best_wpm";

function pickSnippet(exclude?: string) {
  let s = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];

  if (exclude && SNIPPETS.length > 1) {
    while (s === exclude) s = SNIPPETS[Math.floor(Math.random() * SNIPPETS.length)];
  }

  return s;
}

function charStyle(state: "correct" | "wrong" | "pending", current: boolean): React.CSSProperties {
  const base: React.CSSProperties = {
    borderRadius: 2,
    transition: "color 0.08s ease, background 0.08s ease",
  };

  if (current) {
    base.background = "var(--neon-glow)";
    base.boxShadow = "inset 2px 0 0 var(--neon)";
  }
  if (state === "correct") base.color = "var(--neon)";
  else if (state === "wrong") {
    base.color = "var(--red)";
    base.background = current ? "var(--neon-glow)" : "color-mix(in srgb, var(--red) 18%, transparent)";
  } else {
    base.color = "var(--text-muted)";
    base.opacity = 0.55;
  }

  return base;
}

const Stat = ({ icon: Icon, label, value, accent }: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  label: string;
  value: string | number;
  accent?: boolean;
}) => (
  <div className="flex items-center gap-2.5">
    <Icon size={14} style={{ color: accent ? "var(--neon)" : "var(--text-muted)", opacity: accent ? 1 : 0.5 }} />
    <div className="leading-none">
      <span
        className="text-lg font-bold"
        style={{ fontFamily: "var(--font-mono)", color: accent ? "var(--neon)" : "var(--text-primary)" }}
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

export default function PlayPage() {
  const [snippet, setSnippet] = useState("");
  const [typed, setTyped] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Escolhe snippet só no cliente (evita mismatch de hidratação com Math.random)
  useEffect(() => {
    setSnippet(pickSnippet());
    const stored = Number(localStorage.getItem(BEST_KEY));

    if (stored) setBest(stored);
  }, []);

  // Timer ao vivo enquanto digita
  useEffect(() => {
    if (!startedAt || finishedAt) return;
    const id = setInterval(() => setNow(Date.now()), 150);

    return () => clearInterval(id);
  }, [startedAt, finishedAt]);

  const focus = useCallback(() => inputRef.current?.focus(), []);

  const reset = useCallback(
    (next?: boolean) => {
      setTyped("");
      setStartedAt(null);
      setFinishedAt(null);
      setNow(0);
      if (next) setSnippet((s) => pickSnippet(s));
      setTimeout(focus, 0);
    },
    [focus]
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (finishedAt) return;
    let v = e.target.value;

    if (v.length > snippet.length) v = v.slice(0, snippet.length);
    if (!startedAt && v.length > 0) setStartedAt(Date.now());
    setTyped(v);

    if (v.length === snippet.length && snippet.length > 0) {
      const end = Date.now();
      const start = startedAt ?? end;
      const minutes = Math.max((end - start) / 60000, 1 / 60000);
      const wpm = Math.round(snippet.length / 5 / minutes);

      setFinishedAt(end);
      setBest((prev) => {
        const nb = prev ? Math.max(prev, wpm) : wpm;

        localStorage.setItem(BEST_KEY, String(nb));

        return nb;
      });
    }
  };

  const correctChars = useMemo(() => {
    let n = 0;

    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === snippet[i]) n++;
    }

    return n;
  }, [typed, snippet]);

  const accuracy = typed.length ? Math.round((correctChars / typed.length) * 100) : 100;
  const elapsedMs = startedAt ? (finishedAt ?? now) - startedAt : 0;
  const seconds = (elapsedMs / 1000).toFixed(1);
  const minutes = elapsedMs / 60000;
  const wpm = minutes > 0 ? Math.round((finishedAt ? snippet.length : typed.length) / 5 / minutes) : 0;

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
            Typing Test
          </h1>
          <p className="text-sm opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
            {"// Digite o código o mais rápido (e preciso) que conseguir"}
          </p>
        </motion.div>

        {/* Terminal */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="terminal-window"
          initial={{ opacity: 0, y: 24 }}
          transition={{ delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
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
              typing_test.sh
            </span>
          </div>

          {/* Stats bar */}
          <div
            className="flex flex-wrap items-center gap-6 px-5 py-3"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <Stat accent icon={FiZap} label="WPM" value={wpm} />
            <Stat icon={FiTarget} label="ACC" value={`${accuracy}%`} />
            <Stat icon={FiClock} label="SEG" value={seconds} />
            <div className="ml-auto">
              <Stat icon={FiAward} label="BEST" value={best ?? "—"} />
            </div>
          </div>

          {/* Typing area */}
          <div
            className="relative p-5 sm:p-6 cursor-text"
            role="textbox"
            tabIndex={-1}
            onClick={focus}
          >
            <div
              aria-hidden
              className="text-sm sm:text-base leading-[2] select-none"
              style={{ fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {snippet.split("").map((ch, i) => {
                const state =
                  i < typed.length ? (typed[i] === ch ? "correct" : "wrong") : "pending";
                const isCurrent = i === typed.length && !finishedAt;
                const display = ch === "\n" ? "↵\n" : ch;

                return (
                  <span key={i} style={charStyle(state, isCurrent)}>
                    {display}
                  </span>
                );
              })}
            </div>

            {/* Hint before start */}
            {!startedAt && snippet && (
              <motion.p
                animate={{ opacity: 1 }}
                className="mt-5 text-[11px] tracking-wider"
                initial={{ opacity: 0 }}
                style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
              >
                <span className="cursor-blink">▌</span> clique aqui e comece a digitar…
              </motion.p>
            )}

            {/* Invisible capture input */}
            <textarea
              ref={inputRef}
              aria-label="Área de digitação do teste"
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="absolute inset-0 w-full h-full resize-none opacity-0"
              spellCheck={false}
              style={{ caretColor: "transparent" }}
              value={typed}
              onChange={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Tab") e.preventDefault();
              }}
            />
          </div>

          {/* Results */}
          {finishedAt && (
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
                    {wpm}
                    <span className="text-sm ml-1.5 opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
                      wpm
                    </span>
                  </p>
                  <p
                    className="text-[10px] tracking-widest uppercase mt-1 opacity-40"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {accuracy}% precisão · {seconds}s
                    {best === wpm && wpm > 0 ? " · 🏆 novo recorde!" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                  <button className="ui-btn ui-btn-ghost-muted" type="button" onClick={() => reset(false)}>
                    <FiRefreshCw size={13} /> REPETIR
                  </button>
                  <button className="ui-btn ui-btn-primary" type="button" onClick={() => reset(true)}>
                    PRÓXIMO <FiChevronRight size={13} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Controls hint */}
        <div className="mt-5 flex items-center justify-between">
          <button
            className="text-xs ui-link-muted inline-flex items-center gap-1.5"
            type="button"
            onClick={() => reset(true)}
          >
            <FiRefreshCw size={11} /> novo snippet
          </button>
          <p className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
            recorde salvo localmente
          </p>
        </div>
      </section>
    </DefaultLayout>
  );
}
