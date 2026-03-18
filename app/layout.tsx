import { ThemeProvider } from "@/components/ui/providers/ThemeProvider";
import MobileWarning from "@/components/MobileWarning";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { FC, ReactNode } from "react";
import type { Metadata } from "next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Master Picker",
  description: "App to help you choose your master's program",
} satisfies Metadata;

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <MobileWarning />
        {children}
        <Analytics />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
