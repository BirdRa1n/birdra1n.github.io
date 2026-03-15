// config/site.ts
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "BirdRa1n",
  description: "Tech enthusiast and developer. Front-end, back-end and open source.",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  navMenuItems: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  links: {
    github: "https://github.com/birdra1n",
    twitter: "https://x.com/birdra1n",
    discord: "https://discord.gg/birdra1n",
    sponsor: "https://patreon.com/birdra1n",
  },
};
