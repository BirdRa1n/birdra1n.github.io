// components/page.tsx — blocos compartilhados pelas páginas internas.
import { motion } from "framer-motion";
import NextLink from "next/link";
import type { ReactNode } from "react";
import { FiArrowLeft, FiGlobe } from "react-icons/fi";

import { EASE_OUT } from "@/components/motion";
import { useI18n } from "@/i18n";

export function PageIntro({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-36 md:pt-44 pb-14 md:pb-20">
      <div aria-hidden className="aurora opacity-50" />
      <div className="container-x relative">
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow"
          initial={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.8, ease: EASE_OUT }}
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          className="display-xl mt-3"
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          transition={{ duration: 1, delay: 0.05, ease: EASE_OUT }}
        >
          {title}
        </motion.h1>
        {lead && (
          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="lead mt-6 max-w-[44ch]"
            initial={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE_OUT }}
          >
            {lead}
          </motion.p>
        )}
        {children}
      </div>
    </header>
  );
}

export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <NextLink
      className="inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-[var(--fg)] transition-colors"
      href={href}
    >
      <FiArrowLeft size={14} /> {label}
    </NextLink>
  );
}

export function StateMessage({
  title,
  detail,
  action,
}: {
  title: string;
  detail?: string | null;
  action?: ReactNode;
}) {
  return (
    <div className="py-28 text-center flex flex-col items-center gap-3">
      <p className="display-sm">{title}</p>
      {detail && <p className="text-[14px] text-faint max-w-md">{detail}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/** Aviso exibido quando o conteúdo não está no idioma da interface. */
export function TranslationNotice({
  contentLocale,
  autoTranslated,
}: {
  contentLocale: string;
  autoTranslated?: boolean;
}) {
  const { t, locale } = useI18n();
  const untranslated = contentLocale !== locale;

  if (!untranslated && !autoTranslated) return null;

  return (
    <p className="inline-flex items-center gap-2 chip !whitespace-normal">
      <FiGlobe className="shrink-0" size={13} />
      {untranslated ? t.common.originalOnly : t.common.machineTranslated}
    </p>
  );
}
