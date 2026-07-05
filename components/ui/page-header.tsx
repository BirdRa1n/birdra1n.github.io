// components/ui/page-header.tsx
import React from "react";
import NextLink from "next/link";
import { FiArrowLeft } from "react-icons/fi";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}

export const PageHeader = ({
  title,
  subtitle,
  backHref,
  backLabel = "VOLTAR",
  actions,
}: PageHeaderProps) => (
  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
    <div>
      {backHref && (
        <NextLink
          className="inline-flex items-center gap-1.5 text-xs opacity-40 hover:opacity-80 mb-3 transition-opacity"
          href={backHref}
          style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
        >
          <FiArrowLeft size={12} />
          {backLabel}
        </NextLink>
      )}
      <h1
        className="text-3xl font-extrabold tracking-tight"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="text-xs opacity-40 mt-1"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {subtitle}
        </p>
      )}
    </div>
    {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
  </div>
);
