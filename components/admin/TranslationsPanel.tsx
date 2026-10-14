// components/admin/TranslationsPanel.tsx
// Edição das traduções de um post/projeto. O idioma original fica nos
// campos principais do editor; aqui ficam só os outros idiomas.
import dynamic from "next/dynamic";
import { useState } from "react";

import { AdminCard, AdminInput, AdminTextarea } from "@/components/admin/ui";
import { LOCALES, type Locale } from "@/i18n";

const MarkdownEditor = dynamic(() => import("@/components/admin/MarkdownEditor"), { ssr: false });

export interface TranslationDraft {
  title: string;
  summary: string;
  content: string;
  auto_translated: boolean;
}

export type TranslationDrafts = Partial<Record<Locale, TranslationDraft>>;

export const EMPTY_DRAFT: TranslationDraft = { title: "", summary: "", content: "", auto_translated: false };

/** Locales que devem ser gravados (têm título) e os que devem ser apagados. */
export function splitDrafts(drafts: TranslationDrafts, original: Locale) {
  const upsert: [Locale, TranslationDraft][] = [];
  const remove: Locale[] = [];

  for (const { code } of LOCALES) {
    const d = drafts[code];

    if (code === original || !d || !d.title.trim()) remove.push(code);
    else upsert.push([code, d]);
  }

  return { upsert, remove };
}

export function TranslationsPanel({
  original,
  drafts,
  onChange,
  summaryLabel,
}: {
  original: Locale;
  drafts: TranslationDrafts;
  onChange: (next: TranslationDrafts) => void;
  summaryLabel: string;
}) {
  const targets = LOCALES.filter((l) => l.code !== original);
  const [active, setActive] = useState<Locale>(targets[0].code);
  const current = targets.some((l) => l.code === active) ? active : targets[0].code;
  const draft = drafts[current] ?? EMPTY_DRAFT;

  // Qualquer edição manual marca a tradução como revisada
  const update = (patch: Partial<TranslationDraft>) =>
    onChange({ ...drafts, [current]: { ...draft, ...patch, auto_translated: false } });

  return (
    <AdminCard className="p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
          Traduções
        </p>
        <div className="flex gap-1 p-1 rounded-full" style={{ background: "var(--bg-card-alt)" }}>
          {targets.map((l) => {
            const d = drafts[l.code];
            const filled = Boolean(d?.title.trim());

            return (
              <button
                key={l.code}
                className="px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 transition-colors"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: current === l.code ? "var(--bg-card)" : "transparent",
                  color: current === l.code ? "var(--text-primary)" : "var(--text-muted)",
                }}
                type="button"
                onClick={() => setActive(l.code)}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: filled ? (d?.auto_translated ? "var(--yellow)" : "var(--green-dot)") : "var(--border)" }}
                />
                {l.short}
              </button>
            );
          })}
        </div>
      </div>

      {draft.auto_translated && draft.title && (
        <div
          className="flex flex-wrap items-center justify-between gap-3 text-xs px-3 py-2 rounded-lg"
          style={{ background: "color-mix(in srgb, var(--yellow-dot) 12%, transparent)", color: "var(--yellow)" }}
        >
          <span>Tradução automática — revise antes de considerar final.</span>
          <button className="underline" type="button" onClick={() => update({})}>
            Marcar como revisada
          </button>
        </div>
      )}

      <p className="text-xs opacity-50">
        Deixe o título vazio para não ter tradução neste idioma — o site exibe o original com um aviso.
      </p>

      <AdminInput label="Título" placeholder="Título traduzido" value={draft.title} onChange={(e) => update({ title: e.target.value })} />
      <AdminTextarea
        label={summaryLabel}
        rows={2}
        value={draft.summary}
        onChange={(e) => update({ summary: e.target.value })}
      />
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
          Conteúdo (Markdown)
        </p>
        <MarkdownEditor key={current} height={420} value={draft.content} onChange={(v) => update({ content: v })} />
      </div>
    </AdminCard>
  );
}
