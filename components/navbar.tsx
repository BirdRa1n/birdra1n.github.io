// components/navbar.tsx
import { AnimatePresence, motion } from "framer-motion";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { LanguageSwitch } from "@/components/language-switch";
import { useScrolled } from "@/components/motion";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n";

const Logo = () => (
  <span className="flex items-center gap-2.5 select-none">
    <span
      aria-hidden
      className="w-7 h-7 rounded-[9px] grid place-items-center text-[11px] font-bold text-white"
      style={{ background: "var(--grad)", fontFamily: "var(--font-display)" }}
    >
      DJ
    </span>
    <span className="font-display font-semibold tracking-[-0.02em] text-[15px]">
      {siteConfig.name}
    </span>
  </span>
);

export const Navbar = () => {
  const router = useRouter();
  const { t } = useI18n();
  const scrolled = useScrolled();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const close = () => setMenuOpen(false);

    router.events.on("routeChangeStart", close);

    return () => router.events.off("routeChangeStart", close);
  }, [router.events]);

  // Trava o scroll do body com o menu mobile aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <a
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 btn btn-solid btn-sm z-[70]"
        href="#main"
      >
        {t.nav.skip}
      </a>

      <div
        className="glass transition-[border-color,box-shadow] duration-300 border-b"
        style={{
          borderColor: scrolled || menuOpen ? "var(--line)" : "transparent",
        }}
      >
        <nav
          aria-label="Principal"
          className="container-x h-14 flex items-center justify-between gap-6"
        >
          <NextLink aria-label={t.nav.home} href="/">
            <Logo />
          </NextLink>

          <ul className="hidden md:flex items-center gap-1">
            {siteConfig.navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <li key={item.href}>
                  <NextLink
                    aria-current={active ? "page" : undefined}
                    className="relative isolate px-3.5 py-2 text-[13.5px] tracking-[-0.01em] rounded-full transition-colors"
                    href={item.href}
                    style={{ color: active ? "var(--fg)" : "var(--fg-muted)" }}
                  >
                    {active && (
                      <motion.span
                        className="absolute inset-0 rounded-full bg-[var(--bg-subtle)] -z-10"
                        layoutId="nav-pill"
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                      />
                    )}
                    {t.nav[item.key]}
                  </NextLink>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1">
            <LanguageSwitch />
            <ThemeSwitch />
            <button
              aria-controls="mobile-menu"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
              className="ui-icon-btn md:hidden"
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative w-4 h-3" aria-hidden>
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  className="absolute left-0 top-0 h-[1.5px] w-4 bg-current rounded"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  className="absolute left-0 bottom-0 h-[1.5px] w-4 bg-current rounded"
                  transition={{ type: "spring", bounce: 0, duration: 0.3 }}
                />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            animate={{ opacity: 1 }}
            className="md:hidden fixed inset-x-0 top-14 bottom-0 glass"
            exit={{ opacity: 0 }}
            id="mobile-menu"
            initial={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="container-x pt-8 flex flex-col gap-1">
              {[{ key: "home" as const, href: "/" }, ...siteConfig.navItems].map((item, i) => (
                <motion.li
                  key={item.href}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  initial={{ opacity: 0, y: -8 }}
                  transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <NextLink
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="block py-3 font-display text-[28px] font-semibold tracking-[-0.03em]"
                    href={item.href}
                    style={{ color: isActive(item.href) ? "var(--fg)" : "var(--fg-muted)" }}
                  >
                    {t.nav[item.key]}
                  </NextLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
