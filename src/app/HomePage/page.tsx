// Server Component - SSR optimized
import React from "react";
import PromotionSlider from "./promotion";
import NewCollection from "./newCollection";
import RecycleAndEarn from "./recycleAndEarn";

// Server Component ile SEO ve initial load hızlandırılması
export default function HomePage() {
  return (
    <main>
      {/* Hero Section - Client Component (interactive slider) */}
      <PromotionSlider />
      
      {/* Static Sections - Server Components */}
      <NewCollection />
      <RecycleAndEarn />
    </main>
  );
}

// Metadata for SEO
export const metadata = {
  title: "EaseShop - Modern E-Ticaret",
  description: "En uygun fiyatlarla kaliteli ürünler. Kadın, erkek ve çocuk giyiminde geniş ürün yelpazesi.",
  keywords: "e-ticaret, online alışveriş, moda, giyim, kadın, erkek, çocuk",
  openGraph: {
    title: "EaseShop - Modern E-Ticaret",
    description: "En uygun fiyatlarla kaliteli ürünler",
    type: "website",
  },
};