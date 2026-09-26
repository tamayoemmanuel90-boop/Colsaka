import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { LuxCursor } from "@/components/store/LuxCursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cosalka — Nutragen | Cuidado nutragenético para pieles con descamación",
  description:
    "Crema corporal orgánica con tecnología nutragenética. Protocolo Doble Acción: Paso 1 Psoriasis Treatment (anti-picor) + Paso 2 Moisturizer, en formato clínico de 500 ml. Ayuda a eliminar escamas y reducir rojeces. Hecho en México.",
  keywords: [
    "Cosalka",
    "Nutragen",
    "nutragenética",
    "psoriasis",
    "anti-picor",
    "crema corporal orgánica",
    "500 ml",
    "Hecho en México",
  ],
  authors: [{ name: "Cosalka International S. de R.L. de C.V." }],
  openGraph: {
    title: "Cosalka — Nutragen | Doble Acción: Paso 1 + Paso 2",
    description:
      "Protocolo Doble Acción con tecnología nutragenética en formato clínico de 500 ml. Personas reales. Resultados reales. Hecho en México.",
    siteName: "Cosalka",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ececee",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-paper text-ink`}
      >
        {children}

        {/* MacBook-style custom pointer — global, every route */}
        <LuxCursor />

        <Toaster position="top-center" toastOptions={{
          style: {
            background: "#ffffff",
            border: "1px solid rgba(13,13,13,0.12)",
            color: "#141416",
          },
        }} />
      </body>
    </html>
  );
}
