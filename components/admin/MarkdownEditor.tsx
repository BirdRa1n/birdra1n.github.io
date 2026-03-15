// components/admin/MarkdownEditor.tsx
import React, { useCallback } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import supabase from "@/utils/supabase/client";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

async function uploadImageToSupabase(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    console.error("[MarkdownEditor] upload error:", error.message);
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export default function MarkdownEditor({
  value,
  onChange,
  height = 500,
  placeholder = "// Write your content in Markdown...",
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();

  const onImageUpload = useCallback(async (file: File) => {
    const url = await uploadImageToSupabase(file);
    return url;
  }, []);

  return (
    <div
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
      style={
        {
          "--color-canvas-default": "var(--bg-card-alt)",
          "--color-border-default": "var(--border)",
          "--color-fg-default": "var(--text-primary)",
          "--color-accent-fg": "var(--neon)",
          fontFamily: "var(--font-mono)",
        } as React.CSSProperties
      }
    >
      <MDEditor
        height={height}
        preview="live"
        style={{
          background: "var(--bg-card-alt)",
          border: "1px solid var(--border)",
          borderRadius: "2px",
          fontFamily: "var(--font-mono)",
        }}
        textareaProps={{
          placeholder,
          style: {
            fontFamily: "var(--font-mono)",
            fontSize: "13px",
          },
        }}
        value={value}
        onChange={(val) => onChange(val || "")}
        onPaste={async (event) => {
          // Upload de imagens coladas (Ctrl+V)
          const items = event.clipboardData?.items;
          if (!items) return;

          for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
              event.preventDefault();
              const file = item.getAsFile();
              if (!file) continue;
              try {
                const url = await onImageUpload(file);
                const imageMarkdown = `\n![image](${url})\n`;
                onChange(value + imageMarkdown);
              } catch (err) {
                console.error("[MarkdownEditor] paste upload failed:", err);
              }
            }
          }
        }}
        onDrop={async (event) => {
          // Upload de imagens arrastadas (drag & drop)
          const files = event.dataTransfer?.files;
          if (!files || files.length === 0) return;

          const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
          if (imageFiles.length === 0) return;

          event.preventDefault();
          try {
            const urls = await Promise.all(imageFiles.map(onImageUpload));
            const imageMarkdown = urls.map(url => `\n![image](${url})\n`).join("");
            onChange(value + imageMarkdown);
          } catch (err) {
            console.error("[MarkdownEditor] drop upload failed:", err);
          }
        }}
      />
    </div>
  );
}