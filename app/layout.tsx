import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { RESTAURANT, SIGNATURE } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: `${RESTAURANT} — Carte`,
  description: `La carte du ${RESTAURANT}. ${SIGNATURE}. Commandez sur WhatsApp.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
