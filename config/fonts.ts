// config/fonts.ts
// Fontes servidas pelo next/font (self-hosted, sem request externo,
// sem FOUT). As variáveis alimentam os tokens do Design System.
import { Inter, Inter_Tight, JetBrains_Mono } from "next/font/google";

export const fontBody = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Inter Tight: mesma família do corpo, com espaçamento otimizado para
// títulos grandes (tracking negativo fica limpo em tamanhos display).
export const fontDisplay = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const fontVariables = `${fontBody.variable} ${fontMono.variable} ${fontDisplay.variable}`;
