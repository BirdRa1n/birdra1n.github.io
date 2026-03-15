// pages/admin/login.tsx
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiTerminal } from "react-icons/fi";

import { useAdminAuth } from "@/contexts/admin-auth";
import AdminLayout from "@/layouts/admin";

export default function AdminLoginPage() {
  const { signIn, isAdmin, isLoading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && isAdmin) router.push("/admin");
  }, [isAdmin, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);

    if (error) { setError(error); setLoading(false);

 return; }
    router.push("/admin");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-card-alt)",
    border: "1px solid var(--border)",
    borderRadius: "2px",
    padding: "12px 16px 12px 42px",
    fontSize: "13px",
    color: "inherit",
    fontFamily: "var(--font-mono)",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  if (!mounted) return null;

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "var(--bg-primary)" }}>
        {/* Background grid */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "linear-gradient(var(--neon) 1px, transparent 1px), linear-gradient(90deg, var(--neon) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div className="rounded-sm overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-5 py-3" style={{ background: "var(--bg-card-alt)", borderBottom: "1px solid var(--border)" }}>
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              <div className="flex-1 flex items-center justify-center gap-2">
                <FiTerminal size={11} style={{ color: "var(--neon)", opacity: 0.6 }} />
                <span className="text-[10px] opacity-40" style={{ fontFamily: "var(--font-mono)" }}>admin.sh — bash</span>
              </div>
            </div>

            <div className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <div
                  className="inline-flex w-14 h-14 rounded-sm items-center justify-center mb-4"
                  style={{ background: "rgba(0,255,135,0.08)", border: "1px solid rgba(0,255,135,0.2)" }}
                >
                  <FiLock size={22} style={{ color: "var(--neon)" }} />
                </div>
                <h1 className="text-2xl font-extrabold tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  Access Required
                </h1>
                <p className="text-xs opacity-40" style={{ fontFamily: "var(--font-mono)" }}>
                  {"// authenticate to continue"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-email" className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
                    Email
                  </label>
                  <div className="relative">
                    <FiMail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@example.com"
                      required
                      style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--neon), 0 0 16px rgba(0,255,135,0.1)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="login-password" className="text-[10px] tracking-[0.3em] uppercase opacity-50" style={{ fontFamily: "var(--font-mono)" }}>
                    Password
                  </label>
                  <div className="relative">
                    <FiLock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-30" />
                    <input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      style={inputStyle}
                      onFocus={e => { e.currentTarget.style.borderColor = "var(--neon)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--neon), 0 0 16px rgba(0,255,135,0.1)"; }}
                      onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="px-4 py-3 rounded-sm text-xs"
                    style={{ background: "rgba(255,85,85,0.08)", border: "1px solid rgba(255,85,85,0.3)", color: "#ff5555", fontFamily: "var(--font-mono)" }}
                  >
                    {"// Error:"} {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 font-bold text-sm tracking-widest uppercase transition-all mt-2 disabled:opacity-50"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background: "var(--neon)",
                    color: "#05080F",
                    clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                    boxShadow: loading ? "none" : "0 0 24px rgba(0,255,135,0.35)",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                      AUTHENTICATING...
                    </span>
                  ) : "ENTER_PANEL →"}
                </button>
              </form>
            </div>
          </div>

          <p className="text-center text-[10px] opacity-20 mt-6" style={{ fontFamily: "var(--font-mono)" }}>
            RESTRICTED ACCESS — AUTHORIZED PERSONNEL ONLY
          </p>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
