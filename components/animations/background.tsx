// components/animations/background.tsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const AnimatedBackground: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const el = spotlightRef.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      el.style.background = `radial-gradient(650px at ${e.clientX}px ${e.clientY}px, rgba(139,92,246,0.07), transparent 80%)`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mounted]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden dot-grid"
    >
      {/* Mouse spotlight */}
      <div ref={spotlightRef} className="absolute inset-0" />

      {/* Neon orb — top left */}
      <div
        style={{
          position: "absolute",
          top: "-8%",
          left: "-8%",
          width: "45vw",
          height: "45vw",
          maxWidth: 620,
          maxHeight: 620,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(139,92,246,0.13) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 68%)",
          animation: "orbA 24s ease-in-out infinite",
        }}
      />

      {/* Neon orb — bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "-8%",
          right: "-8%",
          width: "50vw",
          height: "50vw",
          maxWidth: 700,
          maxHeight: 700,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(232,121,249,0.09) 0%, transparent 68%)"
            : "radial-gradient(circle, rgba(168,85,247,0.05) 0%, transparent 68%)",
          animation: "orbB 30s ease-in-out infinite",
        }}
      />

      {/* Base background overlay to tint the dot grid in dark mode */}
      {isDark && (
        <div
          className="absolute inset-0"
          style={{ background: "var(--bg-primary)" }}
        />
      )}

      <style>{`
        @keyframes orbA {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.06); }
          66%      { transform: translate(-20px,25px) scale(0.95); }
        }
        @keyframes orbB {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-50px,35px) scale(1.08); }
          66%      { transform: translate(30px,-40px) scale(0.94); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
