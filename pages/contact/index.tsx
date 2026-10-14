// pages/contact/index.tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

import { EASE_OUT, Reveal } from "@/components/motion";
import { PageIntro } from "@/components/page";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n";
import DefaultLayout from "@/layouts/default";
import supabase from "@/utils/supabase/client";

// Valores gravados no banco ficam estáveis (em inglês) independentemente
// do idioma da interface — o admin filtra/lê sempre os mesmos rótulos.
const SUBJECT_KEYS = ["Contact", "Support", "Feedback", "Bug report", "Delete account from app", "Other"];

type Status = { type: "success" | "error"; message: string } | null;

export default function ContactPage() {
  const { t } = useI18n();
  const [subject, setSubject] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const finalSubject = subject === "Other" ? data.subject_other?.trim() || "Other" : subject;

    setSubmitting(true);
    setStatus(null);

    const { error } = await supabase
      .schema("portfolio")
      .from("contact_messages")
      .insert({
        name: data.name.trim(),
        email: data.email.trim(),
        subject: finalSubject,
        message: data.message.trim(),
        status: "new",
      });

    setSubmitting(false);

    if (error) {
      setStatus({ type: "error", message: t.contact.error });

      return;
    }

    setStatus({ type: "success", message: t.contact.success });
    form.reset();
    setSubject("");
  };

  return (
    <DefaultLayout title={t.contact.eyebrow}>
      <PageIntro eyebrow={t.contact.eyebrow} lead={t.contact.lead} title={t.contact.title} />

      <section className="container-x pb-32 grid gap-14 lg:grid-cols-[1fr_320px]">
        <Reveal>
          <form className="surface p-6 sm:p-10 grid gap-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="name">
                  {t.contact.name}
                </label>
                <input required autoComplete="name" className="field" id="name" maxLength={120} name="name" placeholder={t.contact.namePh} />
              </div>
              <div>
                <label className="field-label" htmlFor="email">
                  {t.contact.email}
                </label>
                <input
                  required
                  autoComplete="email"
                  className="field"
                  id="email"
                  maxLength={254}
                  name="email"
                  placeholder={t.contact.emailPh}
                  type="email"
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="subject">
                {t.contact.subject}
              </label>
              <div className="relative">
                <select
                  required
                  className="field pr-10"
                  id="subject"
                  name="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option disabled value="">
                    {t.contact.subjectPh}
                  </option>
                  {SUBJECT_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {t.contact.subjects[key] ?? key}
                    </option>
                  ))}
                </select>
                <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-faint">
                  ▾
                </span>
              </div>
              <AnimatePresence initial={false}>
                {subject === "Other" && (
                  <motion.div
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                    exit={{ opacity: 0, height: 0 }}
                    initial={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  >
                    <input
                      required
                      aria-label={t.contact.subjectOtherPh}
                      className="field mt-3"
                      maxLength={200}
                      name="subject_other"
                      placeholder={t.contact.subjectOtherPh}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="field-label" htmlFor="message">
                {t.contact.message}
              </label>
              <textarea required className="field" id="message" maxLength={5000} name="message" placeholder={t.contact.messagePh} rows={6} />
            </div>

            <AnimatePresence>
              {status && (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2.5 text-[15px] rounded-2xl px-4 py-3"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0, y: -6 }}
                  role="status"
                  style={{
                    color: status.type === "success" ? "var(--success)" : "var(--danger)",
                    background: status.type === "success" ? "color-mix(in srgb, var(--success) 10%, transparent)" : "var(--red-glow)",
                  }}
                >
                  {status.type === "success" ? <FiCheckCircle /> : <FiAlertCircle />}
                  {status.message}
                </motion.p>
              )}
            </AnimatePresence>

            <div>
              <button className="btn btn-accent w-full sm:w-auto" disabled={submitting} type="submit">
                {submitting && <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />}
                {submitting ? t.contact.sending : t.contact.send}
              </button>
            </div>
          </form>
        </Reveal>

        <Reveal className="lg:pt-4" delay={0.1}>
          <p className="text-[13px] font-medium text-faint mb-4">{t.contact.elsewhere}</p>
          <ul className="space-y-3">
            {[
              { label: "GitHub", href: siteConfig.links.github, handle: "@birdra1n" },
              { label: "X / Twitter", href: siteConfig.links.twitter, handle: "@birdra1n" },
              { label: "Discord", href: siteConfig.links.discord, handle: "birdra1n" },
            ].map((s) => (
              <li key={s.label}>
                <a className="surface surface-hover flex items-center justify-between p-5 !rounded-[20px]" href={s.href} rel="noopener noreferrer" target="_blank">
                  <span>
                    <span className="block font-semibold tracking-[-0.01em]">{s.label}</span>
                    <span className="block text-[14px] text-muted">{s.handle}</span>
                  </span>
                  <span aria-hidden className="text-faint">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </DefaultLayout>
  );
}
