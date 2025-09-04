import clsx from "clsx";
import { Head, Html, Main, NextScript } from "next/document";

import { fontSans } from "@/config/fonts";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          content="I'm a tech enthusiast and developer with experience in front-end and back-end development. My focus is on creating exceptional digital solutions and improving the user experience."
          name="description"
        />
      </Head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased behavior-smooth",
          fontSans.variable,
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
