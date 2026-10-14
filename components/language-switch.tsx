// components/language-switch.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiGlobe } from "react-icons/fi";

import { LOCALES, useI18n } from "@/i18n";

export function LanguageSwitch() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  // Fecha ao clicar fora ou apertar Esc
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${t.nav.language}: ${current.label}`}
        className="ui-icon-btn !w-auto px-2.5 gap-1.5 text-[13px] font-medium"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        <FiGlobe size={15} />
        {current.short}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="absolute right-0 top-[calc(100%+8px)] min-w-[168px] p-1.5 rounded-2xl glass border hairline shadow-[var(--shadow-lg)] origin-top-right"
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            role="listbox"
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          >
            {LOCALES.map((l) => {
              const active = l.code === locale;

              return (
                <li key={l.code}>
                  <button
                    aria-selected={active}
                    className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-sm transition-colors hover:bg-[var(--bg-subtle)]"
                    lang={l.code}
                    role="option"
                    type="button"
                    onClick={() => {
                      setLocale(l.code);
                      setOpen(false);
                    }}
                  >
                    <span className={active ? "font-medium" : "text-muted"}>{l.label}</span>
                    {active && <FiCheck className="text-[var(--accent)]" size={14} />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
