// components/ui/empty-state.tsx
import React from "react";
import { motion } from "framer-motion";
import { FiInbox } from "react-icons/fi";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const EmptyState = ({ title, description, icon, action }: EmptyStateProps) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center text-center py-16 px-6"
    initial={{ opacity: 0, y: 12 }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="mb-4 opacity-30" style={{ color: "var(--neon)" }}>
      {icon ?? <FiInbox size={32} />}
    </div>
    <p
      className="text-sm font-bold mb-1"
      style={{ fontFamily: "var(--font-mono)" }}
    >
      {title}
    </p>
    {description && (
      <p
        className="text-xs opacity-40 max-w-sm"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </motion.div>
);
