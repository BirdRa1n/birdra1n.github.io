// pages/admin/contact/index.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMail, FiX, FiCheck } from "react-icons/fi";

import AdminLayout from "@/layouts/admin";
import { AdminPageHeader, StatusBadge, AdminSelect } from "@/components/admin/ui";
import supabase from "@/utils/supabase/client";
import { ContactMessage } from "@/utils/supabase/typed-client";

export default function AdminContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState("all");

  const fetchMessages = async () => {
    setLoading(true);
    let query = supabase.schema("portfolio").from("contact_messages").select("*").order("created_at", { ascending: false });

    if (filter !== "all") query = query.eq("status", filter);
    const { data } = await query;

    setMessages((data || []) as ContactMessage[]);
    setLoading(false);
  };

  useEffect(() => { fetchMessages(); }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await supabase.schema("portfolio").from("contact_messages").update({ status }).eq("id", id);
    setMessages(msgs => msgs.map(m => m.id === id ? { ...m, status: status as any } : m));
    if (selected?.id === id) setSelected(s => s ? { ...s, status: status as any } : null);
  };

  const statusColor: Record<string, string> = {
    new: "var(--cyan)",
    read: "#888",
    replied: "var(--neon)",
    archived: "#555",
  };

  return (
    <AdminLayout>
      <AdminPageHeader title="Mensagens" subtitle="// portfolio.contact_messages" />

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-6">
        {["all", "new", "read", "replied", "archived"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="text-[10px] px-3 py-1.5 rounded-sm tracking-widest uppercase transition-all"
            style={{
              fontFamily: "var(--font-mono)",
              background: filter === f ? "color-mix(in srgb, var(--neon) 10%, transparent)" : "var(--bg-card)",
              border: `1px solid ${filter === f ? "var(--neon)" : "var(--border)"}`,
              color: filter === f ? "var(--neon)" : "inherit",
              opacity: filter === f ? 1 : 0.5,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex gap-6 h-[calc(100vh-280px)]">
        {/* List */}
        <div className="w-96 flex-shrink-0 overflow-y-auto space-y-2 pr-1">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 rounded-sm animate-pulse" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }} />
            ))
          ) : messages.length === 0 ? (
            <div className="text-center py-16 opacity-30">
              <FiMail size={24} className="mx-auto mb-3" />
              <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>{"// Nenhuma mensagem"}</p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSelected(msg);
                  if (msg.status === "new") updateStatus(msg.id, "read");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    setSelected(msg);
                    if (msg.status === "new") updateStatus(msg.id, "read");
                  }
                }}
                className="px-4 py-3 rounded-sm cursor-pointer transition-all"
                style={{
                  background: selected?.id === msg.id ? "color-mix(in srgb, var(--neon) 6%, transparent)" : "var(--bg-card)",
                  border: `1px solid ${selected?.id === msg.id ? "var(--neon)" : "var(--border)"}`,
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {msg.status === "new" && <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--cyan)", boxShadow: "0 0 6px var(--cyan)" }} />}
                    <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-body)" }}>{msg.name}</p>
                  </div>
                  <p className="text-[9px] opacity-30 flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
                    {msg.created_at ? new Date(msg.created_at).toLocaleDateString("pt-BR") : "-"}
                  </p>
                </div>
                <p className="text-xs opacity-50 truncate mb-1" style={{ fontFamily: "var(--font-mono)" }}>{msg.subject}</p>
                <p className="text-[11px] opacity-30 line-clamp-1" style={{ fontFamily: "var(--font-body)" }}>{msg.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Detail panel */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
                className="h-full rounded-sm flex flex-col"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
              >
                {/* Header */}
                <div className="px-6 py-5 flex items-start justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-display)" }}>{selected.name}</h2>
                      <StatusBadge status={selected.status ?? ""} />
                    </div>
                    <p className="text-xs opacity-40" style={{ fontFamily: "var(--font-mono)" }}>{selected.email}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="opacity-30 hover:opacity-70"><FiX size={16} /></button>
                </div>

                {/* Subject */}
                <div className="px-6 py-4" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-card-alt)" }}>
                  <p className="text-[10px] tracking-widest uppercase opacity-40 mb-1" style={{ fontFamily: "var(--font-mono)" }}>Assunto</p>
                  <p className="text-sm font-semibold" style={{ fontFamily: "var(--font-body)" }}>{selected.subject}</p>
                </div>

                {/* Message */}
                <div className="flex-1 overflow-y-auto px-6 py-5">
                  <p className="text-sm leading-relaxed opacity-80" style={{ fontFamily: "var(--font-body)", whiteSpace: "pre-wrap" }}>
                    {selected.message}
                  </p>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ borderTop: "1px solid var(--border)" }}>
                  <p className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
                    {selected.created_at ? new Date(selected.created_at).toLocaleString("pt-BR") : "-"}
                  </p>
                  <div className="flex-1" />
                  {["new", "read", "replied", "archived"].map(status => (
                    <button
                      key={status}
                      onClick={() => updateStatus(selected.id, status)}
                      className="text-[10px] px-3 py-1.5 rounded-sm tracking-widest uppercase transition-all"
                      style={{
                        fontFamily: "var(--font-mono)",
                        background: selected.status === status ? "color-mix(in srgb, var(--neon) 10%, transparent)" : "var(--bg-card-alt)",
                        border: `1px solid ${selected.status === status ? "var(--neon)" : "var(--border)"}`,
                        color: selected.status === status ? "var(--neon)" : "inherit",
                        opacity: selected.status === status ? 1 : 0.5,
                      }}
                    >
                      {status}
                    </button>
                  ))}
                  <a
                    href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                    className="flex items-center gap-1.5 text-xs px-4 py-2 tracking-widest uppercase"
                    style={{
                      fontFamily: "var(--font-mono)",
                      background: "var(--neon)",
                      color: "#05080F",
                      fontWeight: "bold",
                      clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
                    }}
                    onClick={() => updateStatus(selected.id, "replied")}
                  >
                    <FiMail size={12} />
                    RESPONDER
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex items-center justify-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "2px" }}
              >
                <div className="text-center opacity-20">
                  <FiMail size={32} className="mx-auto mb-3" />
                  <p className="text-xs" style={{ fontFamily: "var(--font-mono)" }}>{"// Selecione uma mensagem"}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  );
}
