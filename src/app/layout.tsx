import type { Metadata, Viewport } from "next";
import { Maven_Pro, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Wapadrant Gemeente | Tuis",
  description:
    "Saam op God se pad. 'n Warm, verwelkomende gemeente in Olympus, Pretoria. Kom deel die Wapadrant-gesin.",
  keywords: [
    "Wapadrant",
    "Gemeente",
    "Kerk",
    "Pretoria",
    "Olympus",
    "Afrikaans",
    "Erediens",
    "Christen",
  ],
  authors: [{ name: "Wapadrant Gemeente" }],
  openGraph: {
    title: "Wapadrant Gemeente | Tuis",
    description: "Saam op God se pad. Ons maak impak vir ons Koning.",
    type: "website",
    locale: "af_ZA",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a5d3a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="af"
      className={`${mavenPro.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <Providers>
          <Header />
          <main className="flex flex-1 flex-col">{children}</main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}