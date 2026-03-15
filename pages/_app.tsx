// pages/_app.tsx
import type { AppProps } from "next/app";
import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/router";

import { fontMono, fontSans } from "@/config/fonts";
import { CertificatesProvider } from "@/contexts/certificates";
import { ReposProvider } from "@/contexts/repos";
import { AdminAuthProvider } from "@/contexts/admin-auth";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AdminAuthProvider>
          <CertificatesProvider>
            <ReposProvider>
              <Component {...pageProps} />
            </ReposProvider>
          </CertificatesProvider>
        </AdminAuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

export const fonts = {
  sans: fontSans.style.fontFamily,
  mono: fontMono.style.fontFamily,
};
