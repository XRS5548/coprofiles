 import type { Metadata } from "next";
import {
  Playfair_Display,
  Manrope,
  JetBrains_Mono,
} from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, "")}`
  : "https://coprofiles.sqrock.cloud";

export const metadata: Metadata = {
  title: {
    default: "CO-PROFILES — Luxury Fashion & Lifestyle",
    template: "%s | CO-PROFILES",
  },

  description:
    "Discover premium fashion at CO-PROFILES. Curated collections of luxury apparel and timeless lifestyle experiences.",

  metadataBase: new URL(BASE_URL),

  keywords: [
    "Luxury",
    "Fashion",
    "CO-PROFILES",
    "Designer",
    "Premium",
    "Streetwear",
    "Lifestyle",
    "India",
  ],

  authors: [{ name: "SQROCK IT Solutions" }],
  creator: "SQROCK IT Solutions",
  publisher: "SQROCK IT Solutions",

  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CO-PROFILES",
    title: "CO-PROFILES — Luxury Fashion & Lifestyle",
    description:
      "Premium fashion crafted with elegance and timeless design.",
    url: BASE_URL,
  },

  twitter: {
    card: "summary_large_image",
    title: "CO-PROFILES",
    description:
      "Premium fashion crafted with elegance and timeless design.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased",
        playfair.variable,
        manrope.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}

          <Toaster
            richColors
            position="top-right"
            theme="dark"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}