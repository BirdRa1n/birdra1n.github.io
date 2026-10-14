// layouts/default.tsx
import NextLink from "next/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n";

function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const social = [
    { label: "GitHub", href: siteConfig.links.github },
    { label: "X / Twitter", href: siteConfig.links.twitter },
    { label: "Discord", href: siteConfig.links.discord },
    { label: "Credly", href: siteConfig.links.credly },
  ];

  return (
    <footer className="border-t hairline">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
              {siteConfig.name}
            </p>
            <p className="mt-3 text-[15px] text-muted leading-relaxed">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.navigate}>
            <p className="text-[13px] font-medium text-faint mb-4">{t.footer.navigate}</p>
            <ul className="space-y-2.5">
              {[{ key: "home" as const, href: "/" }, ...siteConfig.navItems].map((item) => (
                <li key={item.href}>
                  <NextLink
                    className="text-[15px] text-muted hover:text-[var(--fg)] transition-colors"
                    href={item.href}
                  >
                    {t.nav[item.key]}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[13px] font-medium text-faint mb-4">{t.footer.connect}</p>
            <ul className="space-y-2.5">
              {social.map((s) => (
                <li key={s.label}>
                  <a
                    className="text-[15px] text-muted hover:text-[var(--fg)] transition-colors"
                    href={s.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {s.label} <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t hairline flex flex-col sm:flex-row justify-between gap-2 text-[13px] text-faint">
          <p suppressHydrationWarning>
            © {year} Dário Jr. {t.footer.rights}
          </p>
          <p>{t.footer.built}</p>
        </div>
      </div>
    </footer>
  );
}

export default function DefaultLayout({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <div className="relative flex flex-col min-h-screen">
      <Head description={description} title={title} />
      <Navbar />
      <main className="flex-grow" id="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
