// pages/admin/experience/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiSave } from "react-icons/fi";

import { AdminToastWrapper } from "@/components/admin/AdminToast";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminTextarea,
  AdminToggle,
} from "@/components/admin/ui";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { useAdminEditor } from "@/hooks/useAdminEditor";
import { LOCALES, type Locale } from "@/i18n";
import AdminLayout from "@/layouts/admin";
import supabase from "@/utils/supabase/client";

const EMPTY = {
  kind: "work" as "work" | "education",
  organization: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  current: false,
  highlights: "",
  tech: "",
  url: "",
  sort_order: 0,
  locale: "pt" as Locale,
};

type Draft = { role: string; location: string; highlights: string; auto_translated: boolean };

const lines = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export default function AdminExperienceEditor() {
  const router = useRouter();
  const { id } = router.query;
  const isNew = id === "new";
  const { saving, toast, showToast, withSave } = useAdminEditor();
  const [loading, setLoading] = useState(!isNew);
  const [form, setForm] = useState(EMPTY);
  const [drafts, setDrafts] = useState<Partial<Record<Locale, Draft>>>({});

  useEffect(() => {
    if (!id || isNew) {
      setLoading(false);

      return;
    }
    Promise.resolve(
      supabase
        .schema("portfolio")
        .from("experiences")
        .select("*, experience_translations(*)")
        .eq("id", id as string)
        .single(),
    )
      .then(({ data }) => {
        if (!data) return;
        const row = data as any;

        setForm({
          kind: row.kind,
          organization: row.organization,
          role: row.role,
          location: row.location ?? "",
          start_date: row.start_date,
          end_date: row.end_date ?? "",
          current: !row.end_date,
          highlights: (row.highlights ?? []).join("\n"),
          tech: (row.tech ?? []).join(", "),
          url: row.url ?? "",
          sort_order: row.sort_order ?? 0,
          locale: row.locale ?? "pt",
        });
        setDrafts(
          Object.fromEntries(
            (row.experience_translations ?? []).map((tr: any) => [
              tr.locale,
              {
                role: tr.role ?? "",
                location: tr.location ?? "",
                highlights: (tr.highlights ?? []).join("\n"),
                auto_translated: tr.auto_translated,
              },
            ]),
          ),
        );
      })
      .finally(() => setLoading(false));
  }, [id, isNew]);

  const set = (key: keyof typeof EMPTY, value: any) => setForm((f) => ({ ...f, [key]: value }));
  const setDraft = (locale: Locale, patch: Partial<Draft>) =>
    setDrafts((d) => ({
      ...d,
      [locale]: { role: "", location: "", highlights: "", ...d[locale], ...patch, auto_translated: false },
    }));

  const handleSave = () =>
    withSave(async () => {
      if (!form.organization.trim() || !form.role.trim() || !form.start_date) {
        showToast("error", "Preencha organização, cargo e data de início.");

        return;
      }

      const payload = {
        kind: form.kind,
        organization: form.organization.trim(),
        role: form.role.trim(),
        location: form.location.trim() || null,
        start_date: form.start_date,
        end_date: form.current ? null : form.end_date || null,
        highlights: lines(form.highlights),
        tech: form.tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        url: form.url.trim() || null,
        sort_order: Number(form.sort_order) || 0,
        locale: form.locale,
      };

      let itemId = id as string;

      if (isNew) {
        const { data, error } = await supabase.schema("portfolio").from("experiences").insert(payload).select("id").single();

        if (error) {
          showToast("error", error.message);

          return;
        }
        itemId = data.id;
      } else {
        const { error } = await supabase.schema("portfolio").from("experiences").update(payload).eq("id", itemId);

        if (error) {
          showToast("error", error.message);

          return;
        }
      }

      const targets = LOCALES.filter((l) => l.code !== form.locale).map((l) => l.code);
      const upserts = targets
        .filter((l) => drafts[l]?.role.trim())
        .map((l) => ({
          experience_id: itemId,
          locale: l,
          role: drafts[l]!.role.trim(),
          location: drafts[l]!.location.trim() || null,
          highlights: lines(drafts[l]!.highlights),
          auto_translated: drafts[l]!.auto_translated,
        }));
      const removals = LOCALES.map((l) => l.code).filter((l) => !upserts.some((u) => u.locale === l));

      await Promise.all([
        upserts.length
          ? supabase.schema("portfolio").from("experience_translations").upsert(upserts, { onConflict: "experience_id,locale" })
          : null,
        removals.length
          ? supabase.schema("portfolio").from("experience_translations").delete().eq("experience_id", itemId).in("locale", removals)
          : null,
      ]);

      showToast("success", isNew ? "Item criado!" : "Item salvo!");
      if (isNew) router.replace(`/admin/experience/${itemId}`);
    });

  if (loading)
    return (
      <AdminLayout>
        <PageLoader />
      </AdminLayout>
    );

  const targets = LOCALES.filter((l) => l.code !== form.locale);

  return (
    <AdminLayout>
      <AdminToastWrapper toast={toast} />
      <AdminPageHeader
        actions={
          <AdminButton loading={saving} onClick={handleSave}>
            <FiSave size={13} /> {saving ? "SALVANDO..." : "SALVAR"}
          </AdminButton>
        }
        backHref="/admin/experience"
        subtitle={isNew ? "// portfolio.experiences.insert" : `// portfolio.experiences.update [${id}]`}
        title={isNew ? "Novo item" : "Editar item"}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <AdminCard className="p-6 space-y-5">
            <AdminInput required label="Cargo / Curso" value={form.role} onChange={(e) => set("role", e.target.value)} />
            <AdminInput
              required
              label="Empresa / Instituição"
              value={form.organization}
              onChange={(e) => set("organization", e.target.value)}
            />
            <AdminInput label="Local (ex.: Remoto)" value={form.location} onChange={(e) => set("location", e.target.value)} />
            <AdminTextarea
              hint="// um destaque por linha"
              label="Destaques"
              rows={6}
              value={form.highlights}
              onChange={(e) => set("highlights", e.target.value)}
            />
            <AdminInput
              hint="// separadas por vírgula"
              label="Tecnologias"
              value={form.tech}
              onChange={(e) => set("tech", e.target.value)}
            />
          </AdminCard>

          <AdminCard className="p-6 space-y-6">
            <p className="ui-label">Traduções</p>
            {targets.map((l) => {
              const d = drafts[l.code];

              return (
                <div key={l.code} className="space-y-4 pt-4 border-t first:border-t-0 first:pt-0" style={{ borderColor: "var(--border)" }}>
                  <p className="text-xs font-semibold flex items-center gap-2">
                    {l.label}
                    {d?.auto_translated && <span className="ui-badge ui-badge-warning">automática</span>}
                  </p>
                  <AdminInput label="Cargo / Curso" value={d?.role ?? ""} onChange={(e) => setDraft(l.code, { role: e.target.value })} />
                  <AdminInput label="Local" value={d?.location ?? ""} onChange={(e) => setDraft(l.code, { location: e.target.value })} />
                  <AdminTextarea
                    label="Destaques (um por linha)"
                    rows={4}
                    value={d?.highlights ?? ""}
                    onChange={(e) => setDraft(l.code, { highlights: e.target.value })}
                  />
                </div>
              );
            })}
          </AdminCard>
        </div>

        <div className="space-y-6">
          <AdminCard className="p-5 space-y-4">
            <AdminSelect label="Tipo" value={form.kind} onChange={(e) => set("kind", e.target.value)}>
              <option value="work">Experiência profissional</option>
              <option value="education">Formação</option>
            </AdminSelect>
            <AdminInput label="Início" type="date" value={form.start_date} onChange={(e) => set("start_date", e.target.value)} />
            <AdminToggle checked={form.current} label="Atual" description="Ainda em andamento" onChange={(v) => set("current", v)} />
            {!form.current && (
              <AdminInput label="Fim" type="date" value={form.end_date} onChange={(e) => set("end_date", e.target.value)} />
            )}
            <AdminInput
              hint="// menor aparece primeiro"
              label="Ordem"
              type="number"
              value={String(form.sort_order)}
              onChange={(e) => set("sort_order", e.target.value)}
            />
            <AdminSelect label="Idioma original" value={form.locale} onChange={(e) => set("locale", e.target.value)}>
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </AdminSelect>
            <AdminInput label="Site (opcional)" value={form.url} onChange={(e) => set("url", e.target.value)} />
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  );
}
