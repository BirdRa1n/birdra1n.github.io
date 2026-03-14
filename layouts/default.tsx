// layouts/default.tsx
import { Head } from "./head";
import { Navbar } from "@/components/navbar";
import AnimatedBackground from "@/components/animations/background";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "var(--bg-primary)" }}
    >
      <Head />
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="container mx-auto max-w-7xl px-6 flex-grow pt-12">
          {children}
        </main>

        <footer
          className="relative z-10 mt-24"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <div className="container mx-auto max-w-7xl px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs tracking-widest opacity-40"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  BUILT BY
                </span>
                <span
                  className="text-sm font-bold"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
                >
                  DÁRIO JR
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="text-xs opacity-30"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  © {new Date().getFullYear()} — ALL RIGHTS RESERVED
                </span>
                <span
                  className="w-1.5 h-1.5 rounded-full cursor-blink"
                  style={{ background: "var(--neon)", boxShadow: "0 0 6px var(--neon)" }}
                />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
