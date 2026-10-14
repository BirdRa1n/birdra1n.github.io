// components/theme-switch.tsx
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

import { useI18n } from "@/i18n";

export const ThemeSwitch: FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const { t } = useI18n();

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return <div className="w-9 h-9" />;

  const isDark = resolvedTheme === "dark";

  return (
    <button
      aria-label={isDark ? t.nav.lightMode : t.nav.darkMode}
      className="ui-icon-btn"
      title={isDark ? t.nav.lightMode : t.nav.darkMode}
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
    </button>
  );
};
