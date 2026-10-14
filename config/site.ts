// config/site.ts
import type { Dictionary } from "@/i18n/locales/pt";

export type SiteConfig = typeof siteConfig;

type NavKey = keyof Pick<Dictionary["nav"], "home" | "projects" | "blog" | "play" | "contact">;

export const siteConfig = {
  name: "Dário Jr",
  handle: "BirdRa1n",
  url: "https://birdra1n.vercel.app",
  navItems: [
    { key: "projects", href: "/projects" },
    { key: "blog", href: "/blog" },
    { key: "play", href: "/play" },
    { key: "contact", href: "/contact" },
  ] as { key: NavKey; href: string }[],
  links: {
    github: "https://github.com/birdra1n",
    twitter: "https://x.com/birdra1n",
    discord: "https://discord.gg/birdra1n",
    credly: "https://www.credly.com/users/dario-rios-1998",
    sponsor: "https://patreon.com/birdra1n",
  },
};
