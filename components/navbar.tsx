// components/navbar.tsx
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";

import { GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

const FILE_LABELS: Record<string, string> = {
  "/": "~/home",
  "/blog": "blog.md",
  "/contact": "contact.sh",
};

const NavLogo = () => (
  <div className="flex items-center gap-2.5 select-none">
    <div
      className="w-8 h-8 rounded flex items-center justify-center text-xs font-bold"
      style={{
        background: "var(--neon)",
        color: "#000",
        fontFamily: "var(--font-mono)",
        boxShadow: "0 0 14px var(--neon-glow)",
      }}
    >
      BR
    </div>
    <div className="leading-none">
      <span
        className="font-bold text-sm block"
        style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
      >
        BirdRa1n
      </span>
      <span
        className="text-[9px] block"
        style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
      >
        dev portfolio
      </span>
    </div>
  </div>
);

export const Navbar = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fecha o menu mobile ao navegar
  useEffect(() => {
    const close = () => setMenuOpen(false);

    router.events.on("routeChangeComplete", close);

    return () => router.events.off("routeChangeComplete", close);
  }, [router.events]);

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        background: "color-mix(in srgb, var(--bg-primary) 88%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderColor: "var(--border)",
      }}
    >
      <nav
        aria-label="Navegação principal"
        className="container mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-4"
      >
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-10 min-w-0">
          <NextLink aria-label="Página inicial" href="/">
            <NavLogo />
          </NextLink>

          <div className="hidden lg:flex gap-6">
            {siteConfig.navItems.map((item) => {
              const isActive = router.pathname === item.href;
              const label = FILE_LABELS[item.href] ?? item.label;

              return (
                <NextLink
                  key={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="relative text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1"
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--neon)" : "var(--text-muted)",
                    textShadow: isActive ? "0 0 10px var(--neon-glow)" : "none",
                  }}
                >
                  {isActive && <span style={{ color: "var(--neon)" }}>▸</span>}
                  {label}
                </NextLink>
              );
            })}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <a
            aria-label="GitHub"
            className="hidden sm:block opacity-45 transition-opacity hover:opacity-100"
            href={siteConfig.links.github}
            rel="noopener noreferrer"
            target="_blank"
            title="GitHub"
          >
            <GithubIcon
              className="w-5 h-5"
              style={{ color: "var(--text-primary)" }}
            />
          </a>
          <ThemeSwitch />
          <button
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-sm opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: "var(--text-primary)" }}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden overflow-hidden border-t"
            exit={{ opacity: 0, height: 0 }}
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            style={{
              background:
                "color-mix(in srgb, var(--bg-primary) 96%, transparent)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderColor: "var(--border)",
            }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {siteConfig.navMenuItems.map((item) => {
                const isActive = router.pathname === item.href;
                const label = FILE_LABELS[item.href] ?? item.label;

                return (
                  <NextLink
                    key={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="text-sm font-medium transition-colors"
                    href={item.href}
                    style={{
                      fontFamily: "var(--font-mono)",
                      color: isActive ? "var(--neon)" : "var(--text-muted)",
                    }}
                  >
                    {isActive && "▸ "}
                    {label}
                  </NextLink>
                );
              })}
              <a
                className="text-sm font-medium sm:hidden"
                href={siteConfig.links.github}
                rel="noopener noreferrer"
                style={{
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-muted)",
                }}
                target="_blank"
              >
                github ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
