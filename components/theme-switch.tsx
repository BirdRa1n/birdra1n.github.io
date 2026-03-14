// components/theme-switch.tsx
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";

import { MoonFilledIcon, SunFilledIcon } from "@/components/icons";

export const ThemeSwitch: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <div className="w-8 h-8" />;

  const isDark = theme === "dark";

  return (
    <button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-200 opacity-50 hover:opacity-100"
      style={{
        border: "1px solid var(--border)",
        background: "transparent",
        color: "var(--neon)",
      }}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--neon)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 0 12px var(--neon-glow)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      {isDark ? <SunFilledIcon size={14} /> : <MoonFilledIcon size={14} />}
    </button>
  );
};
