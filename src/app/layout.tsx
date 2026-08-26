import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cosalka — Nutragen | Nutragenética de Vanguardia",
  description:
    "Nutragenética de vanguardia clínicamente formulada. La colección Nutragen en formato clínico de 500 ml: pureza verificada HPLC hasta el 99,98%, nanopartículas activas y sellado estéril de laboratorio.",
  keywords: [
    "Cosalka",
    "Nutragen",
    "nutragenética",
    "suplemento clínico",
    "500 ml",
    "laboratorio",
    "pureza",
  ],
  authors: [{ name: "Cosalka Labs" }],
  openGraph: {
    title: "Cosalka — Nutragen | Nutragenética de Vanguardia",
    description:
      "Formulaciones nutrogenéticas clínicas en formato sellado de 500 ml. Ciencia, pureza y diseño.",
    siteName: "Cosalka",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-graphite text-clinic`}
      >
        {children}
        <Toaster position="bottom-left" toastOptions={{
          style: {
            background: "#141417",
            border: "1px solid rgba(212,175,55,0.35)",
            color: "#f4f4f6",
          },
        }} />
      </body>
    </html>
  );
}
