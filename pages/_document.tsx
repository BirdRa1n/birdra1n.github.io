import { Head, Html, Main, NextScript } from "next/document";

import { fontVariables } from "@/config/fonts";

export default function Document() {
  return (
    <Html suppressHydrationWarning lang="pt-BR">
      <Head />
      <body className={`min-h-screen antialiased ${fontVariables}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
