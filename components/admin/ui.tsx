// components/admin/ui.tsx
import React from "react";
import { motion } from "framer-motion";
import NextLink from "next/link";
import { FiArrowLeft, FiLoader } from "react-icons/fi";

// ─── Page header ─────────────────────────────────────────────
export const AdminPageHeader = ({
  title,
  subtitle,
  backHref,
  actions,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  actions?: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 mb-8">
    <div>
      {backHref && (
        <NextLink
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs opacity-40 hover:opacity-80 mb-3 transition-opacity"
          style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
        >
          <FiArrowLeft size={12} />
          VOLTAR
        </NextLink>
      )}
      <h1 className="text-3xl font-extrabold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs opacity-40 mt-1" style={{ fontFamily: "var(--font-mono)" }}>{subtitle}</p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);

// ─── Input ───────────────────────────────────────────────────
export const AdminInput = ({
  label,
  required,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
      {label}{required && <span style={{ color: "var(--neon)" }}> *</span>}
    </label>
    <input
      required={required}
      style={{
        width: "100%",
        background: "var(--bg-card-alt)",
        border: "1px solid var(--border)",
        borderRadius: "2px",
        padding: "10px 14px",
        fontSize: "13px",
        color: "inherit",
        fontFamily: "var(--font-mono)",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--neon)"; }}
      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
      {...props}
    />
    {hint && <p className="text-[10px] opacity-30" style={{ fontFamily: "var(--font-mono)" }}>{hint}</p>}
  </div>
);

// ─── Textarea ────────────────────────────────────────────────
export const AdminTextarea = ({
  label,
  required,
  rows = 4,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
      {label}{required && <span style={{ color: "var(--neon)" }}> *</span>}
    </label>
    <textarea
      required={required}
      rows={rows}
      style={{
        width: "100%",
        background: "var(--bg-card-alt)",
        border: "1px solid var(--border)",
        borderRadius: "2px",
        padding: "10px 14px",
        fontSize: "13px",
        color: "inherit",
        fontFamily: "var(--font-mono)",
        outline: "none",
        resize: "vertical",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--neon)"; }}
      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
      {...props}
    />
  </div>
);

// ─── Select ──────────────────────────────────────────────────
export const AdminSelect = ({
  label,
  required,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
      {label}{required && <span style={{ color: "var(--neon)" }}> *</span>}
    </label>
    <select
      required={required}
      style={{
        width: "100%",
        background: "var(--bg-card-alt)",
        border: "1px solid var(--border)",
        borderRadius: "2px",
        padding: "10px 14px",
        fontSize: "13px",
        color: "inherit",
        fontFamily: "var(--font-mono)",
        outline: "none",
        cursor: "pointer",
        transition: "border-color 0.2s",
      }}
      onFocus={e => { e.currentTarget.style.borderColor = "var(--neon)"; }}
      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
      {...props}
    >
      {children}
    </select>
  </div>
);

// ─── Toggle (checkbox styled) ─────────────────────────────────
export const AdminToggle = ({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  description?: string;
}) => (
  <label className="flex items-center gap-3 cursor-pointer group">
    <div
      className="relative w-10 h-5 rounded-sm transition-all"
      style={{
        background: checked ? "var(--neon)" : "var(--bg-card-alt)",
        border: `1px solid ${checked ? "var(--neon)" : "var(--border)"}`,
        boxShadow: checked ? "0 0 10px var(--neon-glow)" : "none",
      }}
      onClick={() => onChange(!checked)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onChange(!checked); }}
    >
      <div
        className="absolute top-0.5 w-4 h-4 rounded-sm transition-all"
        style={{
          left: checked ? "calc(100% - 18px)" : "2px",
          background: checked ? "#05080F" : "var(--text-muted)",
        }}
      />
    </div>
    <div>
      <p className="text-xs font-semibold" style={{ fontFamily: "var(--font-mono)" }}>{label}</p>
      {description && <p className="text-[10px] opacity-40" style={{ fontFamily: "var(--font-mono)" }}>{description}</p>}
    </div>
  </label>
);

// ─── Primary button ───────────────────────────────────────────
export const AdminButton = ({
  children,
  loading,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: "primary" | "outline" | "danger";
}) => {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: "var(--neon)",
      color: "#05080F",
      boxShadow: "0 0 20px rgba(0,255,135,0.25)",
      clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
    },
    outline: {
      background: "transparent",
      color: "var(--neon)",
      border: "1px solid var(--neon)",
      clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
    },
    danger: {
      background: "rgba(255,85,85,0.1)",
      color: "#ff5555",
      border: "1px solid rgba(255,85,85,0.3)",
    },
  };

  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-widest uppercase transition-all disabled:opacity-50 ${props.className || ""}`}
      style={{ fontFamily: "var(--font-mono)", cursor: loading ? "not-allowed" : "pointer", ...styles[variant], ...props.style }}
    >
      {loading && <FiLoader size={12} className="animate-spin" />}
      {children}
    </button>
  );
};

// ─── Card ─────────────────────────────────────────────────────
export const AdminCard = ({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <div
    className={`rounded-sm ${className}`}
    style={{ background: "var(--bg-card)", border: "1px solid var(--border)", ...style }}
  >
    {children}
  </div>
);

// ─── Badge ────────────────────────────────────────────────────
export const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    published: { bg: "rgba(0,255,135,0.1)", color: "var(--neon)", border: "rgba(0,255,135,0.2)" },
    draft: { bg: "rgba(255,149,0,0.1)", color: "#FF9500", border: "rgba(255,149,0,0.2)" },
    archived: { bg: "rgba(150,150,150,0.1)", color: "#888", border: "rgba(150,150,150,0.2)" },
    new: { bg: "rgba(0,229,255,0.1)", color: "var(--cyan-neon)", border: "rgba(0,229,255,0.2)" },
    read: { bg: "rgba(150,150,150,0.1)", color: "#888", border: "rgba(150,150,150,0.2)" },
    replied: { bg: "rgba(0,255,135,0.1)", color: "var(--neon)", border: "rgba(0,255,135,0.2)" },
  };
  const c = colors[status] || colors.draft;

  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-sm"
      style={{ fontFamily: "var(--font-mono)", background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {status}
    </span>
  );
};

// ─── Confirm dialog ───────────────────────────────────────────
export const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm rounded-sm p-6"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      >
        <h3 className="text-lg font-bold mb-2" style={{ fontFamily: "var(--font-display)" }}>{title}</h3>
        <p className="text-sm opacity-60 mb-6" style={{ fontFamily: "var(--font-body)" }}>{message}</p>
        <div className="flex gap-3 justify-end">
          <AdminButton variant="outline" onClick={onCancel}>CANCELAR</AdminButton>
          <AdminButton variant="danger" onClick={onConfirm}>CONFIRMAR</AdminButton>
        </div>
      </motion.div>
    </div>
  );
};
