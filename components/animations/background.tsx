// components/animations/background.tsx
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const isDark = resolvedTheme === "dark";
    const cols = Math.floor(canvas.width / 20);
    const drops: number[] = Array(cols).fill(1);

    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノ";

    let frame = 0;
    let animId: number;

    const draw = () => {
      frame++;
      if (frame % 3 !== 0) {
        animId = requestAnimationFrame(draw);

        return;
      }

      ctx.fillStyle = isDark
        ? "rgba(5, 8, 15, 0.05)"
        : "rgba(248, 250, 252, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = "14px 'Courier New', monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 20;
        const y = drops[i] * 20;

        const alpha = Math.random() * 0.3 + 0.05;

        ctx.fillStyle = isDark
          ? `rgba(0, 255, 135, ${alpha})`
          : `rgba(0, 180, 90, ${alpha})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none opacity-40"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default AnimatedBackground;
