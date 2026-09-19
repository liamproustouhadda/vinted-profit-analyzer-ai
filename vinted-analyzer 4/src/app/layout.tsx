import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vinted Profit Analyzer AI - Analyse rentabilité revente",
  description: "Photographie un vêtement, obtiens une analyse IA complète de sa rentabilité Vinted : marque, prix, ROI, score, annonce.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#fbfaf8]">{children}</body>
    </html>
  );
}
