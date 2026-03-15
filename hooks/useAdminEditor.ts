// hooks/useAdminEditor.ts
import { useState, useCallback } from "react";

type ToastType = "success" | "error";
interface Toast { type: ToastType; msg: string }

/**
 * Estado compartilhado por todas as páginas de edição do admin:
 * saving, toast, e handlers de save genéricos.
 */
export function useAdminEditor() {
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = useCallback((type: ToastType, msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const withSave = useCallback(
    async (fn: () => Promise<void>) => {
      setSaving(true);
      try {
        await fn();
      } finally {
        setSaving(false);
      }
    },
    []
  );

  return { saving, toast, showToast, withSave };
}
