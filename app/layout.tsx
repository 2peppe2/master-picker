import { JotaiProvider } from "@/components/ui/JotaiProvider";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MobileWarning } from "@/components/MobileWarning";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Master Picker",
  description: "App to help you choose your master's program",
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
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <JotaiProvider>
            <MobileWarning />
            {children}
            <Analytics />
          </JotaiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
