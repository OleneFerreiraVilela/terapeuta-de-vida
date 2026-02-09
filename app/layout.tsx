import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Terapeuta de Vida | Seu Mapa-Guia Gratuito",
  description:
    "Um aplicativo de autoconhecimento e terapia guiada baseada em arquétipos, numerologia pitagórica e psicologia transpessoal. Descubra seu Mapa-Guia.",
  openGraph: {
    type: "website",
    title: "Terapeuta de Vida - Consulta Gratuita",
    description:
      "Descubra os arquétipos que regem sua jornada. Consulta terapêutica gratuita.",
    siteName: "Terapeuta de Vida",
    locale: "pt_BR",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#233C5F",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
