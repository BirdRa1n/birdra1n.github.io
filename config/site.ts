// config/site.ts
import { profile } from "@/config/profile";
import type { Dictionary } from "@/i18n/locales/pt";

export type SiteConfig = typeof siteConfig;

type NavKey = keyof Pick<
  Dictionary["nav"],
  "home" | "about" | "experience" | "projects" | "blog" | "play" | "contact"
>;

export const siteConfig = {
  name: profile.displayName,
  handle: profile.handle,
  url: "https://birdra1n.vercel.app",
  /** Seções da home (âncoras) + páginas. */
  navItems: [
    { key: "about", href: "/#about" },
    { key: "experience", href: "/#experience" },
    { key: "projects", href: "/projects" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
  ] as { key: NavKey; href: string }[],
  footerItems: [
    { key: "home", href: "/" },
    { key: "projects", href: "/projects" },
    { key: "blog", href: "/blog" },
    { key: "contact", href: "/contact" },
    { key: "play", href: "/play" },
  ] as { key: NavKey; href: string }[],
  links: {
    github: profile.github,
    linkedin: profile.linkedin,
    email: `mailto:${profile.email}`,
    twitter: "https://x.com/birdra1n",
    credly: "https://www.credly.com/users/dario-rios-1998",
  },
};
