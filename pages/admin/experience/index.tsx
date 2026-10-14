// pages/admin/experience/index.tsx
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { FiEdit2, FiPlus, FiTrash2 } from "react-icons/fi";

import { AdminButton, AdminPageHeader, ConfirmDialog } from "@/components/admin/ui";
import AdminLayout from "@/layouts/admin";
import type { Experience } from "@/types/database";
import supabase from "@/utils/supabase/client";

const fmt = (d: string | null) =>
  d ? new Date(d).toLocaleDateString("pt-BR", { month: "short", year: "numeric", timeZone: "UTC" }) : "atual";

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .schema("portfolio")
      .from("experiences")
      .select("*")
      .order("kind", { ascending: false })
      .order("sort_order")
      .order("start_date", { ascending: false });

    setItems((data ?? []) as Experience[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.schema("portfolio").from("experiences").delete().eq("id", deleteId);
    setDeleteId(null);
    load();
  };

  const groups: { label: string; kind: Experience["kind"] }[] = [
    { label: "Experiência profissional", kind: "work" },
    { label: "Formação", kind: "education" },
  ];

  return (
    <AdminLayout>
      <AdminPageHeader
        actions={
          <NextLink href="/admin/experience/new">
            <AdminButton>
              <FiPlus size={13} /> NOVO ITEM
            </AdminButton>
          </NextLink>
        }
        subtitle="// portfolio.experiences"
        title="Experiência & Formação"
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="ui-skeleton h-16" />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map((g) => (
            <section key={g.kind}>
              <p className="ui-label mb-3">{g.label}</p>
              <div className="ui-card overflow-hidden">
                {items.filter((i) => i.kind === g.kind).length === 0 && (
                  <p className="text-xs opacity-40 p-6 text-center">Nenhum item.</p>
                )}
                {items
                  .filter((i) => i.kind === g.kind)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="group flex items-center gap-4 px-4 py-4 border-b last:border-b-0"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <span className="text-[10px] opacity-40 w-6 text-center" style={{ fontFamily: "var(--font-mono)" }}>
                        {item.sort_order}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold truncate">{item.role}</p>
                        <p className="text-xs opacity-50 truncate">
                          {item.organization} · {fmt(item.start_date)} — {fmt(item.end_date)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <NextLink className="p-1" href={`/admin/experience/${item.id}`} title="Editar">
                          <FiEdit2 size={14} />
                        </NextLink>
                        <button className="p-1" style={{ color: "var(--red)" }} title="Excluir" type="button" onClick={() => setDeleteId(item.id)}>
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <ConfirmDialog
        message="Tem certeza? As traduções deste item também serão removidas."
        open={!!deleteId}
        title="Excluir item"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </AdminLayout>
  );
}
