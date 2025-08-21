import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ApolloWrapper } from "@/components/providers/apollo-provider";
import NewsletterFAB from "@/components/newsletter/NewsletterFAB";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME || "The Code Muse",
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME || "The Code Muse"}`,
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern tech blog built with Next.js and Strapi",
  keywords: ["blog", "technology", "programming", "web development", "next.js", "strapi"],
  authors: [{ name: "The Code Muse" }],
  creator: "The Code Muse",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    title: process.env.NEXT_PUBLIC_APP_NAME || "The Code Muse",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern tech blog built with Next.js and Strapi",
    siteName: process.env.NEXT_PUBLIC_APP_NAME || "The Code Muse",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME || "The Code Muse",
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern tech blog built with Next.js and Strapi",
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
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased">
        <ApolloWrapper>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <NewsletterFAB />
          </div>
        </ApolloWrapper>
      </body>
    </html>
  );
}
