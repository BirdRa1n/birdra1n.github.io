// components/admin/ResumeUploadCard.tsx
import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiFileText, FiUploadCloud, FiExternalLink, FiCheckCircle } from "react-icons/fi";

import { Button } from "@/components/ui";
import {
  useResume,
  resumeDownloadUrl,
  RESUME_SETTING_KEY,
} from "@/hooks/useResume";
import supabase from "@/utils/supabase/client";

const RESUME_PATH = "curriculo.pdf";
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function ResumeUploadCard() {
  const { resume, loading, refetch } = useResume();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const flash = (type: "success" | "error", msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      flash("error", "O arquivo precisa ser um PDF.");

      return;
    }
    if (file.size > MAX_BYTES) {
      flash("error", "Arquivo muito grande (máx. 10 MB).");

      return;
    }

    setUploading(true);
    try {
      const { error: uploadError } = await supabase.storage
        .from("resume")
        .upload(RESUME_PATH, file, {
          upsert: true,
          contentType: "application/pdf",
          cacheControl: "3600",
        });

      if (uploadError) {
        flash("error", uploadError.message);

        return;
      }

      const { data: pub } = supabase.storage.from("resume").getPublicUrl(RESUME_PATH);

      const { error: settingError } = await supabase
        .schema("portfolio")
        .from("site_settings")
        .upsert(
          { key: RESUME_SETTING_KEY, value: pub.publicUrl, updated_at: new Date().toISOString() },
          { onConflict: "key" }
        );

      if (settingError) {
        flash("error", settingError.message);

        return;
      }

      await refetch();
      flash("success", "Currículo atualizado com sucesso!");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="rounded-sm p-6"
      initial={{ opacity: 0, y: 12 }}
      style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      transition={{ delay: 0.28 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-sm flex items-center justify-center"
            style={{
              background: "color-mix(in srgb, var(--neon) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--neon) 30%, transparent)",
            }}
          >
            <FiFileText size={18} style={{ color: "var(--neon)" }} />
          </div>
          <div>
            <h2
              className="text-sm font-bold tracking-widest uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Currículo (CV)
            </h2>
            <p
              className="text-[10px] opacity-40"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {loading
                ? "// carregando..."
                : resume
                  ? `// atualizado em ${new Date(resume.updatedAt).toLocaleString("pt-BR")}`
                  : "// nenhum CV enviado ainda"}
            </p>
          </div>
        </div>

        {resume && (
          <a
            className="inline-flex items-center gap-1.5 text-[10px] tracking-widest opacity-50 hover:opacity-100 transition-opacity"
            href={resumeDownloadUrl(resume)}
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
            target="_blank"
          >
            <FiExternalLink size={11} /> VER ATUAL
          </a>
        )}
      </div>

      <input
        ref={inputRef}
        accept="application/pdf"
        className="hidden"
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) handleFile(file);
        }}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button
          loading={uploading}
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
        >
          <FiUploadCloud size={13} />
          {uploading ? "ENVIANDO..." : resume ? "SUBSTITUIR CV" : "ENVIAR CV (PDF)"}
        </Button>

        {feedback && (
          <span
            className="inline-flex items-center gap-1.5 text-xs"
            style={{
              fontFamily: "var(--font-mono)",
              color: feedback.type === "success" ? "var(--green-dot)" : "var(--red)",
            }}
          >
            {feedback.type === "success" && <FiCheckCircle size={13} />}
            {feedback.msg}
          </span>
        )}
      </div>
    </motion.div>
  );
}
