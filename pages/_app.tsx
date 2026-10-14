// pages/_app.tsx
import type { AppProps } from "next/app";

import { MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AdminAuthProvider } from "@/contexts/admin-auth";
import { I18nProvider } from "@/i18n";
import "@/styles/globals.css";

// Certificados e repositórios do GitHub deixaram de ser providers
// globais: eram buscados em toda página (inclusive no admin) e agora
// só carregam na home, onde são exibidos.
export default function App({ Component, pageProps }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <NextThemesProvider enableSystem attribute="class" defaultTheme="system">
        <I18nProvider>
          <AdminAuthProvider>
            <Component {...pageProps} />
          </AdminAuthProvider>
        </I18nProvider>
      </NextThemesProvider>
    </MotionConfig>
  );
}
