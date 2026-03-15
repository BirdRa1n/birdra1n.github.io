// pages/contact/index.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";

import supabase from "@/utils/supabase/client";
import DefaultLayout from "@/layouts/default";

const SUBJECTS = [
  "Contact",
  "Support",
  "Feedback",
  "Bug report",
  "Delete account from app",
  "Other",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--bg-card-alt)",
  border: "1px solid var(--border)",
  borderRadius: "2px",
  padding: "12px 16px",
  fontSize: "13px",
  color: "inherit",
  fontFamily: "var(--font-body)",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

const focusStyle = {
  borderColor: "var(--neon)",
  boxShadow: "0 0 0 1px var(--neon), 0 0 16px rgba(0,255,135,0.1)",
};
const blurStyle = { borderColor: "var(--border)", boxShadow: "none" };

function TerminalInput({
  label,
  name,
  type = "text",
  placeholder,
  required,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  [key: string]: any;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className="text-[10px] tracking-[0.3em] uppercase opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        style={inputStyle}
        onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
        onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
        {...props}
      />
    </div>
  );
}

export default function ContactPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    const formData = new FormData(e.currentTarget);
    const { name, email, subject, message } = Object.fromEntries(
      formData
    ) as { name: string; email: string; subject: string; message: string };

    // Usa o schema correto — portfolio.contact_messages
    const { error } = await supabase
      .schema("portfolio" as any)
      .from("contact_messages")
      .insert({ name, email, subject, message, status: "new" });

    setIsSubmitting(false);

    if (error) {
      setSubmitStatus({
        type: "error",
        message: "// Error: failed to send. Retry?",
      });
      return;
    }

    setSubmitStatus({
      type: "success",
      message: "// Success: message queued. I'll respond soon.",
    });
    (e.target as HTMLFormElement).reset();
    setSelectedSubject("");
  };

  return (
    <DefaultLayout>
      <section className="max-w-2xl mx-auto py-12 md:py-20">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
        >
          <div className="flex items-center gap-4 mb-4">
            <span
              className="text-xs tracking-[0.3em] opacity-50"
              style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            >
              04
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
          </div>
          <h1
            className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get in Touch
          </h1>
        </motion.div>

        <motion.div
          animate={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 24 }}
          transition={{ delay: 0.2 }}
        >
          <div
            className="p-6 sm:p-8 rounded-sm"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            {/* Terminal bar */}
            <div
              className="flex items-center gap-2 mb-8 pb-4"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <div className="w-3 h-3 rounded-full" style={{ background: "#FF5F57" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#FEBC2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ background: "#28C840" }} />
              <span className="ml-3 text-xs opacity-30" style={{ fontFamily: "var(--font-mono)" }}>
                contact.sh
              </span>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <TerminalInput required label="Name" name="name" placeholder="John Doe" />
                <TerminalInput required label="Email" name="email" type="email" placeholder="john@example.com" />
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="subject"
                  className="text-[10px] tracking-[0.3em] uppercase opacity-50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Subject
                </label>
                {selectedSubject === "Other" ? (
                  <input
                    required
                    id="subject"
                    name="subject"
                    placeholder="Enter your subject"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                  />
                ) : (
                  <select
                    required
                    id="subject"
                    name="subject"
                    value={selectedSubject}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                  >
                    <option value="">Select a subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="message"
                  className="text-[10px] tracking-[0.3em] uppercase opacity-50"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Message
                </label>
                <textarea
                  required
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="// Tell me about your project or question..."
                  style={{ ...inputStyle, resize: "vertical", minHeight: 140 }}
                  onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.currentTarget.style, blurStyle)}
                />
              </div>

              {submitStatus.type && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: -8 }}
                  className="py-3 px-4 rounded-sm text-xs"
                  style={{
                    fontFamily: "var(--font-mono)",
                    background:
                      submitStatus.type === "success"
                        ? "rgba(0, 255, 135, 0.08)"
                        : "rgba(255, 80, 80, 0.08)",
                    border: `1px solid ${
                      submitStatus.type === "success"
                        ? "var(--neon)"
                        : "rgba(255,80,80,0.4)"
                    }`,
                    color:
                      submitStatus.type === "success" ? "var(--neon)" : "#FF5555",
                  }}
                >
                  {submitStatus.message}
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-3 py-3.5 font-semibold text-sm tracking-widest uppercase transition-all duration-300 disabled:opacity-50"
                style={{
                  fontFamily: "var(--font-mono)",
                  background: isSubmitting ? "var(--neon-dim)" : "var(--neon)",
                  color: "#05080F",
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  boxShadow: isSubmitting ? "none" : "0 0 24px rgba(0,255,135,0.35)",
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                }}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                    SENDING...
                  </span>
                ) : (
                  <>
                    SEND_MESSAGE
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </section>
    </DefaultLayout>
  );
}
