import { ThemeProvider } from "@/components/ui/providers/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { FC, ReactNode } from "react";
import type { Metadata, Viewport } from "next";
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

/**
 * viewportFit: "cover" is what makes env(safe-area-inset-*) resolve to
 * anything other than 0. Without it the bottom bars sit under the home
 * indicator and, in landscape, content runs beneath the notch.
 */
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
} satisfies Viewport;

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => (
  <html lang="en" suppressHydrationWarning>
    <body
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Analytics />
      </ThemeProvider>
    </body>
  </html>
);

export default RootLayout;
