import type { Metadata } from "next";
import { Playfair_Display, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
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
    "Discover premium fashion at CO-PROFILES. Curated collections of luxury apparel, accessories, and bespoke designs crafted for the modern individual.",
  keywords: [
    "luxury fashion",
    "premium clothing",
    "designer wear",
    "CO-PROFILES",
    "fashion brand",
    "streetwear",
    "ethical fashion",
    "made in India",
  ],
  authors: [{ name: "SQROCK IT Solutions" }],
  creator: "SQROCK IT Solutions",
  publisher: "SQROCK IT Solutions",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CO-PROFILES",
    title: "CO-PROFILES — Luxury Fashion & Lifestyle",
    description:
      "Dress in your story. Explore our premium collections of luxury apparel and accessories.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CO-PROFILES",
    description:
      "Dress in your story. Premium fashion crafted for the modern individual.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      className={cn(
        "h-full antialiased",
        playfair.variable,
        inter.variable,
        jetbrainsMono.variable,
      )}
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <body className="min-h-full flex flex-col">{children}</body>
      </ThemeProvider>
      <Toaster richColors position="top-right" />
    </html>
  );
}
