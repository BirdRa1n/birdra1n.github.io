// components/navbar.tsx
import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/navbar";
import NextLink from "next/link";
import { useRouter } from "next/router";

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

  return (
    <HeroUINavbar
      className="border-b"
      maxWidth="xl"
      position="sticky"
      style={{
        background:
          "color-mix(in srgb, var(--bg-primary) 88%, transparent)",
        backdropFilter: "blur(20px)",
        borderColor: "var(--border)",
      }}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <NextLink href="/">
            <NavLogo />
          </NextLink>
        </NavbarBrand>

        <div className="hidden lg:flex gap-6 justify-start ml-10">
          {siteConfig.navItems.map((item) => {
            const isActive = router.pathname === item.href;
            const label = FILE_LABELS[item.href] ?? item.label;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className="relative text-xs font-medium tracking-wide transition-all duration-200 flex items-center gap-1"
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--neon)" : "var(--text-muted)",
                    textShadow: isActive
                      ? "0 0 10px var(--neon-glow)"
                      : "none",
                  }}
                >
                  {isActive && (
                    <span style={{ color: "var(--neon)" }}>▸</span>
                  )}
                  {label}
                </NextLink>
              </NavbarItem>
            );
          })}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="flex items-center gap-4">
          <Link
            isExternal
            className="transition-all hover:opacity-100"
            href={siteConfig.links.github}
            style={{ opacity: 0.45 }}
            title="GitHub"
          >
            <GithubIcon
              className="w-5 h-5"
              style={{ color: "var(--text-primary)" }}
            />
          </Link>
          <ThemeSwitch />
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarMenu
        style={{
          background:
            "color-mix(in srgb, var(--bg-primary) 96%, transparent)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="mx-4 mt-10 flex flex-col gap-5">
          {siteConfig.navMenuItems.map((item, index) => {
            const isActive = router.pathname === item.href;
            const label = FILE_LABELS[item.href] ?? item.label;

            return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="text-sm font-medium transition-colors"
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--neon)" : "var(--text-muted)",
                  }}
                >
                  {isActive && "▸ "}
                  {label}
                </Link>
              </NavbarMenuItem>
            );
          })}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
