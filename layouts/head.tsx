import NextHead from "next/head";

import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n";

export const Head = ({ title, description }: { title?: string; description?: string }) => {
  const { t } = useI18n();
  const fullTitle = title ? `${title} — ${siteConfig.name}` : `${siteConfig.name} — ${t.home.role}`;
  const desc = description ?? t.meta.description;

  return (
    <NextHead>
      <title>{fullTitle}</title>
      <meta key="title" content={fullTitle} property="og:title" />
      <meta key="og:description" content={desc} property="og:description" />
      <meta key="description" content={desc} name="description" />
      <meta key="og:type" content="website" property="og:type" />
      <meta key="twitter:card" content="summary_large_image" name="twitter:card" />
      {/* user-scalable/maximum-scale removidos: bloquear zoom viola WCAG 1.4.4 */}
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0"
        name="viewport"
      />
      <meta key="theme-light" content="#FBFBFD" media="(prefers-color-scheme: light)" name="theme-color" />
      <meta key="theme-dark" content="#050507" media="(prefers-color-scheme: dark)" name="theme-color" />
      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
