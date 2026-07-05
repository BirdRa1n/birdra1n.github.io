// pages/admin/certificates/index.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPlus, FiTrash2, FiEdit2, FiAward, FiX, FiSave } from "react-icons/fi";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, AdminInput, AdminButton, AdminCard, AdminSelect, ConfirmDialog } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { Certificate, Organization } from "@/utils/supabase/typed-client";

const EMPTY_FORM = { organization_id: "", title: "", emission: "", url: "", skills: [] as string[], skillInput: "" };

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const fetch = async () => {
    setLoading(true);
    try {
      const [{ data: certsData }, { data: orgsData }] = await Promise.all([
        supabase.schema("portfolio").from("certificates").select("*, organization:organizations(*)").order("emission", { ascending: false }),
        supabase.schema("portfolio").from("organizations").select("*").order("name"),
      ]);
      setCerts((certsData || []) as Certificate[]);
      setOrgs((orgsData || []) as Organization[]);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const addSkill = () => {
    if (!form.skillInput.trim()) return;
    const skills = form.skillInput.split(",").map(s => s.trim()).filter(Boolean);

    set("skills", [...form.skills, ...skills.filter(s => !form.skills.includes(s))]);
    set("skillInput", "");
  };

  const handleEdit = (cert: Certificate) => {
    setEditId(cert.id);
    setForm({
      organization_id: cert.organization_id || "",
      title: cert.title,
      emission: cert.emission ?? "",
      url: cert.url || "",
      skills: cert.skills || [],
      skillInput: "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      organization_id: form.organization_id || null,
      title: form.title,
      emission: form.emission,
      url: form.url || null,
      skills: form.skills,
    };

    if (editId) {
      await supabase.schema("portfolio").from("certificates").update(payload).eq("id", editId);
    } else {
      await supabase.schema("portfolio").from("certificates").insert(payload);
    }

    setSaving(false);
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    fetch();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.schema("portfolio").from("certificates").delete().eq("id", deleteId);
    setDeleteId(null);
    fetch();
  };

  return (
    <AdminLayout>
      <AdminPageHeader
        title="Certificados"
        subtitle="// portfolio.certificates"
        actions={
          <AdminButton onClick={() => { setEditId(null); setForm(EMPTY_FORM); setShowForm(true); }}>
            <FiPlus size={13} /> NOVO
          </AdminButton>
        }
      />

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl rounded-sm"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="font-bold text-sm" style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}>
                {editId ? "// EDITAR CERTIFICADO" : "// NOVO CERTIFICADO"}
              </h2>
              <button onClick={() => setShowForm(false)} className="opacity-40 hover:opacity-80"><FiX size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <AdminInput label="Título" required value={form.title} onChange={e => set("title", e.target.value)} placeholder="AWS Cloud Practitioner" />
              <AdminSelect label="Organização" value={form.organization_id} onChange={e => set("organization_id", e.target.value)}>
                <option value="">Selecione...</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
              </AdminSelect>
              <AdminInput label="Data de Emissão" type="date" value={form.emission} onChange={e => set("emission", e.target.value)} />
              <AdminInput label="URL do Certificado" value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />

              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase opacity-50 mb-2" style={{ fontFamily: "var(--font-mono)" }}>Skills</p>
                <div className="flex gap-2 mb-2">
                  <input
                    value={form.skillInput}
                    onChange={e => set("skillInput", e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                    placeholder="React, TypeScript..."
                    style={{
                      flex: 1, background: "var(--bg-card-alt)", border: "1px solid var(--border)",
                      borderRadius: "2px", padding: "8px 12px", fontSize: "12px", color: "inherit", fontFamily: "var(--font-mono)", outline: "none",
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = "var(--neon)"}
                    onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
                  />
                  <button onClick={addSkill} className="px-3 rounded-sm" style={{ background: "color-mix(in srgb, var(--neon) 10%, transparent)", border: "1px solid color-mix(in srgb, var(--neon) 20%, transparent)", color: "var(--neon)" }}><FiPlus size={14} /></button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {form.skills.map(skill => (
                    <span key={skill} className="tag-chip flex items-center gap-1">
                      {skill}
                      <button onClick={() => set("skills", form.skills.filter(s => s !== skill))} className="opacity-50 hover:opacity-100"><FiX size={9} /></button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <AdminButton variant="outline" onClick={() => setShowForm(false)}>CANCELAR</AdminButton>
                <AdminButton loading={saving} onClick={handleSave}><FiSave size={12} /> SALVAR</AdminButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-sm p-5 group relative"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)", transition: "border-color 0.25s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
            >
              {/* Actions */}
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1.5 rounded-sm" style={{ background: "color-mix(in srgb, var(--neon) 10%, transparent)" }} onClick={() => handleEdit(cert)}>
                  <FiEdit2 size={11} style={{ color: "var(--neon)" }} />
                </button>
                <button className="p-1.5 rounded-sm" style={{ background: "rgba(255,85,85,0.1)" }} onClick={() => setDeleteId(cert.id)}>
                  <FiTrash2 size={11} style={{ color: "#ff5555" }} />
                </button>
              </div>

              <div className="flex items-start gap-3 mb-3">
                {(cert.organization as any)?.logo ? (
                  <img src={(cert.organization as any).logo} alt="" className="w-10 h-10 object-contain rounded-sm p-1" style={{ border: "1px solid var(--border)", background: "var(--bg-card-alt)" }} />
                ) : (
                  <div className="w-10 h-10 rounded-sm flex-shrink-0 flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--neon) 8%, transparent)", border: "1px solid color-mix(in srgb, var(--neon) 15%, transparent)" }}>
                    <FiAward size={16} style={{ color: "var(--neon)" }} />
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-12">
                  <p className="text-xs font-semibold line-clamp-2 leading-snug" style={{ fontFamily: "var(--font-display)" }}>{cert.title}</p>
                  <p className="text-[10px] opacity-40 mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>{(cert.organization as any)?.name}</p>
                </div>
              </div>

              <p className="text-[10px] opacity-30 mb-3" style={{ fontFamily: "var(--font-mono)" }}>
                {new Date(cert.emission + "T00:00:00").toLocaleDateString("pt-BR", { year: "numeric", month: "long" })}
              </p>

              {(cert.skills ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {(cert.skills ?? []).slice(0, 4).map(skill => <span key={skill} className="tag-chip">{skill}</span>)}
                  {(cert.skills ?? []).length > 4 && <span className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>+{(cert.skills ?? []).length - 4}</span>}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Deletar Certificado"
        message="Tem certeza? Esta ação não pode ser desfeita."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </AdminLayout>
  );
}
