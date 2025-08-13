"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLikeStore } from "@/stores";
import { useCartStore } from "@/stores";
import { formatTL } from "@/lib";

const FavoritesPage = () => {
  const likeItems = useLikeStore((state) => state.items);
  const removeFromLikes = useLikeStore((state) => state.removeFromLikes);
  const addToCart = useCartStore((state) => state.addToCart);

  const breadcrumbs = [
    { name: "Anasayfa", href: "/" },
    { name: "Beğendiklerim", href: "#" }
  ];

  if (likeItems.length === 0) {
    return (
      <div className="container py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Beğendiğiniz Ürün Yok</h2>
          <p className="text-gray-500 mb-6">Beğendiğiniz ürünler burada görünecek</p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Ürünleri Keşfet
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex space-x-2 text-sm">
          {breadcrumbs.map((breadcrumb, index) => (
            <li key={breadcrumb.name} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === breadcrumbs.length - 1 ? (
                <span className="text-gray-900 font-medium">
                  {breadcrumb.name}
                </span>
              ) : (
                <Link href={breadcrumb.href} className="text-gray-500 hover:text-gray-700">
                  {breadcrumb.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="text-3xl font-bold mb-8">Beğendiklerim</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {likeItems.map((item) => (
          <div
            key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Ürün Resmi */}
            <div className="relative h-64 bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Ürün Bilgileri */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 mb-2">
                Renk: {item.selectedColor} | Beden: {item.selectedSize}
              </p>
              <p className="text-lg font-semibold text-gray-900 mb-4">{formatTL(item.price)}</p>

              {/* Butonlar */}
              <div className="flex gap-2">
                <button
                  onClick={() => addToCart({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    selectedColor: item.selectedColor,
                    selectedSize: item.selectedSize,
                    quantity: 1
                  })}
                  className="flex-1 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors text-sm font-medium"
                >
                  Sepete Ekle
                </button>
                <button
                  onClick={() => removeFromLikes(item.id, item.selectedColor, item.selectedSize)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                  title="Beğenilerden Kaldır"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;