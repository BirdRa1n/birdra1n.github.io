// components/admin/AdminToast.tsx
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  type: "success" | "error";
  msg: string;
}

export function AdminToast({ type, msg }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="fixed top-6 right-6 z-50 px-5 py-3 rounded-sm text-xs"
      style={{
        fontFamily: "var(--font-mono)",
        background:
          type === "success"
            ? "rgba(0,255,135,0.12)"
            : "rgba(255,85,85,0.12)",
        border: `1px solid ${type === "success" ? "var(--neon)" : "#ff5555"}`,
        color: type === "success" ? "var(--neon)" : "#ff5555",
      }}
    >
      {type === "success" ? "✓" : "✗"} {msg}
    </motion.div>
  );
}

/** Wrapper com AnimatePresence — use este no layout */
export function AdminToastWrapper({
  toast,
}: {
  toast: { type: "success" | "error"; msg: string } | null;
}) {
  return (
    <AnimatePresence>
      {toast && <AdminToast key="toast" type={toast.type} msg={toast.msg} />}
    </AnimatePresence>
  );
}
