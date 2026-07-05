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
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="ui-icon-btn"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <SunFilledIcon size={14} /> : <MoonFilledIcon size={14} />}
    </button>
  );
};
