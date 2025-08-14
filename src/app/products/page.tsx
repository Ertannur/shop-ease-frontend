"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useLikeStore } from "@/stores";
import { formatTL } from "@/lib";
import AuthToast from "@/components/Toast/AuthToast";

const ProductsPage = () => {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    position?: { x: number; y: number };
  }>({ show: false, message: '' });
  
  const addToLikes = useLikeStore((state) => state.addToLikes);
  const isItemLiked = useLikeStore((state) => state.isItemLiked);

  const products = [
    {
      id: 1,
      name: "Loose Straight Jean",
      description: "Açık mavi, Günlük",
      price: 1000,
      image: "/placeholder-product.jpg"
    },
    {
      id: 2,
      name: "Denim Ceket",
      description: "Açık mavi, Günlük",
      price: 1500,
      image: "/placeholder-product.jpg"
    },
    {
      id: 3,
      name: "Deri Çanta",
      description: "Siyah mavi, Bodo",
      price: 1800,
      image: "/placeholder-product.jpg"
    },
    {
      id: 4,
      name: "Güneş Gözlüğü",
      description: "Kırmızı, Yazlık",
      price: 2000,
      image: "/placeholder-product.jpg"
    },
    {
      id: 5,
      name: "Sweatshirt",
      description: "Turuncu, Lacıvert",
      price: 700,
      image: "/placeholder-product.jpg"
    },
    {
      id: 6,
      name: "Etek",
      description: "Mavi, Desenli",
      price: 600,
      image: "/placeholder-product.jpg"
    },
    {
      id: 7,
      name: "Güneş Gözlüğü",
      description: "Beyaz, Beyaz",
      price: 1800,
      image: "/placeholder-product.jpg"
    },
    {
      id: 8,
      name: "Kaban",
      description: "Bej",
      price: 1900,
      image: "/placeholder-product.jpg"
    }
  ];

  return (
    <div className="container py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal">Yeni Ürünler</h1>
      </div>

      {/* Ürün Grid'i */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`} className="group cursor-pointer block">
            {/* Ürün Görseli */}
            <div className="relative aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-300">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                <span className="text-gray-500 text-lg">Placeholder</span>
              </div>

              {/* Hover'da görünen kalp ikonu */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  // Mouse pozisyonunu al
                  const rect = e.currentTarget.getBoundingClientRect();
                  const position = {
                    x: rect.left + rect.width / 2,
                    y: rect.top
                  };
                  
                  addToLikes({
                    id: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    selectedColor: "Varsayılan",
                    selectedSize: "M"
                  }, () => {
                    // Auth required callback - toast göster
                    setToast({
                      show: true,
                      message: 'Bu ürünü beğenmek için giriş yapmanız gerekiyor.',
                      position
                    });
                  });
                }}
                className={`absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 z-10 ${isItemLiked(product.id.toString(), "Varsayılan", "M") ? 'text-red-500' : 'text-gray-600'
                  }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isItemLiked(product.id.toString(), "Varsayılan", "M") ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

            </div>

            {/* Ürün Bilgileri */}
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500">
                {product.description}
              </p>
              <p className="font-semibold text-gray-900">
                {formatTL(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Daha Fazla Yükle Butonu */}
      <div className="text-center mt-12">
        <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300">
          Daha Fazla Ürün Göster
        </button>
      </div>
      
      {/* Auth Toast */}
      <AuthToast
        show={toast.show}
        message={toast.message}
        position={toast.position}
        onClose={() => setToast({ show: false, message: '' })}
      />
    </div>
  );
};

export default ProductsPage;