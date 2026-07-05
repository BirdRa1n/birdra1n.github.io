// components/ui/dialog.tsx — dialog de confirmação acessível
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "./button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "CONFIRMAR",
  cancelLabel = "CANCELAR",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  const cancelRef = useRef<HTMLButtonElement>(null);

  // Esc fecha; foco inicial no botão de cancelar (ação segura)
  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
          onClick={onCancel}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1, y: 0 }}
            aria-describedby="ui-dialog-message"
            aria-labelledby="ui-dialog-title"
            aria-modal="true"
            className="ui-card w-full max-w-sm p-6"
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            role="alertdialog"
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-lg font-bold mb-2"
              id="ui-dialog-title"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {title}
            </h3>
            <p
              className="text-sm opacity-60 mb-6"
              id="ui-dialog-message"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {message}
            </p>
            <div className="flex gap-3 justify-end">
              <Button ref={cancelRef} variant="ghost" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant="danger" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
