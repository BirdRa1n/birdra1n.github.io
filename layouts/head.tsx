import NextHead from "next/head";

import { siteConfig } from "@/config/site";

export const Head = () => {
  return (
    <NextHead>
      <title>{siteConfig.name}</title>
      <meta key="title" content={siteConfig.name} property="og:title" />
      <meta content={siteConfig.description} property="og:description" />
      <meta content={siteConfig.description} name="description" />
      {/* user-scalable/maximum-scale removidos: bloquear zoom viola WCAG 1.4.4 */}
      <meta
        key="viewport"
        content="viewport-fit=cover, width=device-width, initial-scale=1.0"
        name="viewport"
      />
      <link href="/favicon.ico" rel="icon" />
    </NextHead>
  );
};
