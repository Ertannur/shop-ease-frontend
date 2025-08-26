import type { Metadata } from "next";
import { Geist, Geist_Mono, Raleway } from "next/font/google";
import "./globals.css";
import { Navbar, Footer } from "@/components";
import { SupportButton } from "@/components/LiveSupport";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Font swap for better performance
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false, // Only preload primary font
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "ShopEase - Modern E-Ticaret Sitesi",
    template: "%s | ShopEase"
  },
  description: "Kaliteli ürünler, uygun fiyatlar! Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi. Hızlı kargo ve güvenli alışveriş.",
  keywords: ["e-ticaret", "online alışveriş", "moda", "giyim", "kadın", "erkek", "çocuk", "kargo"],
  authors: [{ name: "ShopEase Team" }],
  creator: "ShopEase",
  publisher: "ShopEase",
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
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: 'https://shopease.com',
    siteName: 'ShopEase',
    title: 'ShopEase - Modern E-Ticaret Sitesi',
    description: 'Kaliteli ürünler, uygun fiyatlar! Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ShopEase - Modern E-Ticaret Sitesi',
    description: 'Kaliteli ürünler, uygun fiyatlar! Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi.',
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
        <SupportButton />
      </body>
    </html>
  );
}
