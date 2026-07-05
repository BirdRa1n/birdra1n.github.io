// components/ui/badge.tsx
import React from "react";

export type BadgeVariant =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "accent";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge = ({ children, variant = "neutral", className = "" }: BadgeProps) => (
  <span className={`ui-badge ui-badge-${variant} ${className}`}>{children}</span>
);

/** Badge derivado do campo `status` das entidades do banco. */
const STATUS_VARIANT: Record<string, BadgeVariant> = {
  published: "success",
  draft: "warning",
  archived: "neutral",
  new: "info",
  read: "neutral",
  replied: "success",
};

export const StatusBadge = ({ status }: { status: string }) => (
  <Badge variant={STATUS_VARIANT[status] ?? "neutral"}>{status}</Badge>
);
