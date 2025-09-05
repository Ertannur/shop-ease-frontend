import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Navbar, Footer, LiveSupport } from "@/components";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "ShopEase - Modern E-Ticaret Sitesi",
    template: "%s | ShopEase",
  },
  description:
    "Kaliteli ürünler, uygun fiyatlar! Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi. Hızlı kargo ve güvenli alışveriş.",
  keywords: [
    "e-ticaret",
    "online alışveriş",
    "moda",
    "giyim",
    "kadın",
    "erkek",
    "çocuk",
    "kargo",
  ],
  authors: [{ name: "ShopEase Team" }],
  creator: "ShopEase",
  publisher: "ShopEase",
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
    locale: "tr_TR",
    url: "https://shopease.com",
    siteName: "ShopEase",
    title: "ShopEase - Modern E-Ticaret Sitesi",
    description:
      "Kaliteli ürünler, uygun fiyatlar! Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopEase - Modern E-Ticaret Sitesi",
    description:
      "Kaliteli ürünler, uygun fiyatlar! Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="dark">
      <body className={`${montserrat.variable} antialiased`}>
        <Navbar />
        {children}
        <Footer />
        <LiveSupport />
      </body>
    </html>
  );
}
