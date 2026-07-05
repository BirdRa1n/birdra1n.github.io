// pages/_app.tsx
import type { AppProps } from "next/app";

import { MotionConfig } from "framer-motion";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AdminAuthProvider } from "@/contexts/admin-auth";
import { CertificatesProvider } from "@/contexts/certificates";
import { ReposProvider } from "@/contexts/repos";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MotionConfig reducedMotion="user">
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <AdminAuthProvider>
          <CertificatesProvider>
            <ReposProvider>
              <Component {...pageProps} />
            </ReposProvider>
          </CertificatesProvider>
        </AdminAuthProvider>
      </NextThemesProvider>
    </MotionConfig>
  );
}
