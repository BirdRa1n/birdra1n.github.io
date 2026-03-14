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
import clsx from "clsx";
import NextLink from "next/link";
import { useRouter } from "next/router";

import { GithubIcon } from "@/components/icons";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

const NavLogo = () => (
  <div className="flex items-center gap-2 select-none">
    <div className="relative w-8 h-8">
      <div
        className="w-8 h-8 rounded-sm flex items-center justify-center text-xs font-bold"
        style={{
          background: "var(--neon)",
          color: "#05080F",
          fontFamily: "var(--font-mono)",
          boxShadow: "0 0 16px var(--neon-glow)",
        }}
      >
        BR
      </div>
      <div
        className="absolute -inset-[2px] rounded-sm opacity-50 animate-pulse"
        style={{ border: "1px solid var(--neon)" }}
      />
    </div>
    <div className="flex flex-col leading-none">
      <span
        className="font-bold text-sm tracking-widest"
        style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
      >
        BirdRa1n
      </span>
      <span
        className="text-[9px] tracking-[0.3em] opacity-50"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        DEV
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
        background: "rgba(5, 8, 15, 0.85)",
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

        <div className="hidden lg:flex gap-8 justify-start ml-8">
          {siteConfig.navItems.map((item) => {
            const isActive = router.pathname === item.href;

            return (
              <NavbarItem key={item.href}>
                <NextLink
                  className={clsx(
                    "text-xs tracking-widest uppercase transition-all duration-200",
                    "hover:opacity-100",
                    isActive ? "opacity-100" : "opacity-40 hover:opacity-70",
                  )}
                  href={item.href}
                  style={{
                    fontFamily: "var(--font-mono)",
                    color: isActive ? "var(--neon)" : "inherit",
                    textShadow: isActive ? "0 0 12px var(--neon-glow)" : "none",
                  }}
                >
                  {isActive && (
                    <span style={{ color: "var(--neon)", marginRight: 4 }}>
                      ▸
                    </span>
                  )}
                  {item.label}
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
            className="opacity-50 hover:opacity-100 transition-opacity"
            href={siteConfig.links.github}
            title="GitHub"
          >
            <GithubIcon className="w-5 h-5" style={{ color: "var(--neon)" }} />
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
          background: "rgba(5, 8, 15, 0.96)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="mx-4 mt-8 flex flex-col gap-6">
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="text-sm tracking-widest uppercase opacity-60 hover:opacity-100 transition-opacity"
                href={item.href}
                style={{ fontFamily: "var(--font-mono)", color: "var(--neon)" }}
              >
                <span className="mr-3 opacity-40">0{index + 1}.</span>
                {item.label}
              </Link>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
