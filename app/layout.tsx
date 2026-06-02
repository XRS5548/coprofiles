import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `https://${process.env.NEXT_PUBLIC_APP_URL.replace(/^https?:\/\//, "")}`
  : "https://coprofiles.sqrock.cloud";

export const metadata: Metadata = {
  title: {
    default: "CO-PROFILES by SQROCK IT Solutions — Internships & Tech Careers",
    template: "%s | CO-PROFILES",
  },
  description:
    "CO-PROFILES by SQROCK IT Solutions bridges the gap between academic learning and industry. Apply for internships, get certified, and launch your tech career.",
  keywords: [
    "internships",
    "tech careers",
    "SQROCK",
    "CO-PROFILES",
    "student internships",
    "IT training",
    "hiring",
    "certifications",
    "Noida internships",
  ],
  authors: [{ name: "SQROCK IT Solutions" }],
  creator: "SQROCK IT Solutions",
  publisher: "SQROCK IT Solutions",
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CO-PROFILES",
    title: "CO-PROFILES by SQROCK IT Solutions — Internships & Tech Careers",
    description:
      "Build your tech career with real-world internships and industry mentorship. Apply now at CO-PROFILES.",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "CO-PROFILES by SQROCK IT Solutions",
    description:
      "Real internships, real projects, real careers. Join CO-PROFILES today.",
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
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-mono", jetbrainsMono.variable)}
    >
      <ThemeProvider 
       attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>

      <body className="min-h-full flex flex-col">{children}</body>
      </ThemeProvider>
      <Toaster richColors position="top-right" />
    </html>
  );
}
