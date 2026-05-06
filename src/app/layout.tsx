import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Brotes de Chile 2026 | Catálogo Digital de Artesanía",
  description: "Descubre el trabajo de 40 artesanos de la Muestra de Arte Popular Brotes de Chile en Angol. Agrupación Huellas de Nahuelbuta.",
  openGraph: {
    title: "Brotes de Chile 2026",
    description: "Catálogo Digital de Artesanía - Agrupación Huellas de Nahuelbuta",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">{children}</body>
    </html>
  );
}

