// components/admin/MarkdownEditor.tsx
import React from "react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";

// Dynamic import to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

export default function MarkdownEditor({
  value,
  onChange,
  height = 500,
  placeholder = "// Write your content in Markdown...",
}: MarkdownEditorProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div
      data-color-mode={resolvedTheme === "dark" ? "dark" : "light"}
      style={{
        "--color-canvas-default": "var(--bg-card-alt)",
        "--color-border-default": "var(--border)",
        "--color-fg-default": "var(--text-primary)",
        "--color-accent-fg": "var(--neon)",
        fontFamily: "var(--font-mono)",
      } as React.CSSProperties}
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
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
      />
    </div>
  );
}
