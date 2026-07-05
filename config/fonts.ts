// config/fonts.ts
// Fontes servidas pelo next/font (self-hosted, sem request externo,
// sem FOUT). As variáveis alimentam os tokens do Design System.
import { Inter, JetBrains_Mono, Syne } from "next/font/google";

export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-mono",
  display: "swap",
});

export const fontDisplay = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const fontVariables = `${fontBody.variable} ${fontMono.variable} ${fontDisplay.variable}`;
