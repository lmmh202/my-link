import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://my-link-sable.vercel.app"),
  title: {
    default: "My Link | Consolidate Your Digital Presence",
    template: "%s | My Link",
  },
  description: "Share all your dynamic social media presence, website URLs, and channels in one elegant, fast, and customizable glassmorphic landing page.",
  keywords: [
    "My Link",
    "Linktree clone",
    "Link in bio",
    "Social links",
    "Link aggregator",
    "Bio link",
    "Creator pages",
    "Personal landing page",
  ],
  authors: [{ name: "My Link Team" }],
  creator: "My Link Team",
  publisher: "My Link Team",
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
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://my-link-sable.vercel.app",
    title: "My Link | Consolidate Your Digital Presence",
    description: "Share all your dynamic social media presence, website URLs, and channels in one elegant, fast, and customizable glassmorphic landing page.",
    siteName: "My Link",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Link | Consolidate Your Digital Presence",
    description: "Share all your dynamic social media presence, website URLs, and channels in one elegant, fast, and customizable glassmorphic landing page.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
