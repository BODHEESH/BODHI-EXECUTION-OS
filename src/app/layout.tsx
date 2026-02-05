import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";
import type { Metadata, Viewport } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BODHI EXECUTION OS",
  description: "Ultimate productivity platform for personal and business success",
  manifest: "/manifest.json",
  icons: {
    icon: "/logos/cp1.png",
    apple: [
      { url: "/logos/mobile-app-logo1.png" },
      { url: "/logos/mobile-app-logo1.png", sizes: "72x72" },
      { url: "/logos/mobile-app-logo1.png", sizes: "96x96" },
      { url: "/logos/mobile-app-logo1.png", sizes: "128x128" },
      { url: "/logos/mobile-app-logo1.png", sizes: "144x144" },
      { url: "/logos/mobile-app-logo1.png", sizes: "152x152" },
      { url: "/logos/mobile-app-logo1.png", sizes: "192x192" },
      { url: "/logos/mobile-app-logo1.png", sizes: "384x384" },
      { url: "/logos/cp1.png", sizes: "512x512" },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "BODHI OS",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
