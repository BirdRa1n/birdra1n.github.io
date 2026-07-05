import { Head, Html, Main, NextScript } from "next/document";

import { fontVariables } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="pt-BR" suppressHydrationWarning>
      <Head>
        <meta
          content="I'm a tech enthusiast and developer with experience in front-end and back-end development. My focus is on creating exceptional digital solutions and improving the user experience."
          name="description"
        />
      </Head>
      <body className={`min-h-screen antialiased ${fontVariables}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
