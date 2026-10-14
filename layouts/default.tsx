// layouts/default.tsx
import NextLink from "next/link";

import { Head } from "./head";

import { Navbar } from "@/components/navbar";
import { profile } from "@/config/profile";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n";

function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const social = [
    { label: "LinkedIn", href: siteConfig.links.linkedin },
    { label: "GitHub", href: siteConfig.links.github },
    { label: "E-mail", href: siteConfig.links.email },
    { label: "Credly", href: siteConfig.links.credly },
  ];

  return (
    <footer className="border-t hairline">
      <div className="container-x py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="max-w-sm">
            <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
              {siteConfig.name}
              <span className="text-[var(--accent-fill)]">.</span>
            </p>
            <p className="mt-3 text-[15px] text-muted leading-relaxed">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.footer.navigate}>
            <p className="text-[13px] font-medium text-faint mb-4">{t.footer.navigate}</p>
            <ul className="space-y-2.5">
              {siteConfig.footerItems.map((item) => (
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
                    target={s.href.startsWith("mailto:") ? undefined : "_blank"}
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
            © {year} {profile.fullName} {t.footer.rights}
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
