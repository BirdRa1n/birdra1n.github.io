// layouts/default.tsx
import NextLink from "next/link";
import { useRouter } from "next/router";
import { motion } from "framer-motion";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import AnimatedBackground from "@/components/animations/background";
import { siteConfig } from "@/config/site";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  return (
    <div
      className="relative flex flex-col min-h-screen"
      style={{ background: "var(--bg-primary)" }}
    >
      <Head />
      <AnimatedBackground />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <motion.main
          key={router.pathname}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto max-w-7xl px-6 flex-grow pt-12"
          initial={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.main>

        <footer
          className="relative z-10 mt-16"
          style={{ borderTop: "1px solid var(--border)" }}
          suppressHydrationWarning
        >
          <div className="container mx-auto max-w-7xl px-6 pt-8 pb-10">
            {/* Terminal header bar */}
            <div
              className="terminal-header rounded-lg mb-8"
              style={{ border: "1px solid var(--border)" }}
            >
              <div className="terminal-dots">
                <div className="terminal-dot" style={{ background: "#FF5F57" }} />
                <div className="terminal-dot" style={{ background: "#FEBC2E" }} />
                <div className="terminal-dot" style={{ background: "#28C840" }} />
              </div>
              <span
                className="text-xs"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                ~/footer
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Brand */}
              <div>
                <div
                  className="font-bold text-base mb-1"
                  style={{ fontFamily: "var(--font-display)", color: "var(--neon)" }}
                >
                  BirdRa1n
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                >
                  Full-Stack Developer
                  <br />
                  Building things for the web &amp; beyond.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                >
                  Navigation
                </p>
                <div className="flex flex-col gap-2.5">
                  {siteConfig.navItems.map((item) => (
                    <NextLink
                      key={item.href}
                      className="text-xs ui-link-muted"
                      href={item.href}
                    >
                      &gt; {item.label.toLowerCase()}
                    </NextLink>
                  ))}
                  <NextLink className="text-xs ui-link-muted" href="/play">
                    &gt; play.exe
                  </NextLink>
                </div>
              </div>

              {/* Connect */}
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest mb-4"
                  style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                >
                  Connect
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    { label: "github", href: siteConfig.links.github },
                    { label: "twitter/x", href: siteConfig.links.twitter },
                    { label: "discord", href: siteConfig.links.discord },
                  ].map(({ label, href }) => (
                    <a
                      key={label}
                      className="text-xs ui-link-muted"
                      href={href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      &gt; {label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-3"
              style={{ borderTop: "1px solid var(--border)" }}
              suppressHydrationWarning
            >
              <p
                className="text-[10px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
                suppressHydrationWarning
              >
                <span style={{ color: "var(--neon)", opacity: 0.5 }}># </span>
                &copy; {new Date().getFullYear()} Dário Jr — All rights
                reserved
              </p>
              <p
                className="text-[10px]"
                style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}
              >
                <span style={{ color: "var(--neon)", opacity: 0.5 }}># </span>
                Built with Next.js · Supabase · Framer Motion
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
