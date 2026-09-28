import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
// OrbitChat is loaded dynamically only when the user opens it

import PagePerformanceMonitor from '@/components/PagePerformanceMonitor';
import OrbitChatToggle from '@/components/OrbitChatToggle';
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://skyhigh.travel'),
  title: {
    default: "SkyHigh — AI-Powered Travel Planner",
    template: "%s | SkyHigh",
  },
  description: "Plan smarter. Travel better. SkyHigh uses AI to craft personalized day-by-day itineraries, recommend hotels, and discover hidden gems tailored to you.",
  keywords: ["AI Travel Planner", "Trip Itinerary", "SkyHigh", "Vacation Planner", "Hotel Search", "Flight Search", "Personalized Travel"],
  authors: [{ name: "SkyHigh Team" }],
  creator: "SkyHigh",
  publisher: "SkyHigh",
  openGraph: {
    title: "SkyHigh — AI-Powered Travel Planner",
    description: "Plan smarter. Travel better. Let AI craft your perfect itinerary.",
    url: "/",
    siteName: "SkyHigh",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SkyHigh — AI Travel Planner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SkyHigh — AI-Powered Travel Planner",
    description: "Plan smarter. Travel better. Let AI craft your perfect itinerary.",
    images: ["/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#f8faff] text-foreground pb-16 md:pb-0`}
      >
        <AuthProvider>
          <Navbar />
          {/* Global performance monitor (client-only) */}
          <PagePerformanceMonitor />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <BottomNav />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "SkyHigh",
                url: process.env.NEXT_PUBLIC_BASE_URL || 'https://skyhigh.travel',
                logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://skyhigh.travel'}/logo.png`,
                sameAs: [
                  "https://twitter.com/skyhightravel",
                  "https://instagram.com/skyhightravel"
                ]
              })
            }}
          />
          {/* OrbitChat is loaded dynamically via OrbitChatToggle to avoid shipping heavy JS to all pages */}
          <OrbitChatToggle />
        </AuthProvider>
      </body>
    </html>
  );
}
