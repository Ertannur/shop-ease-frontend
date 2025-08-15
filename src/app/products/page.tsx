"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { useLikeStore } from "@/stores";
import { formatTL } from "@/lib";
import AuthToast from "@/components/Toast/AuthToast";
import { ApiProduct, ProductsResponse } from "@/Types";

const ProductsPage = () => {
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    position?: { x: number; y: number };
  }>({ show: false, message: '' });
  
  const addToLikes = useLikeStore((state) => state.addToLikes);
  const isItemLiked = useLikeStore((state) => state.isItemLiked);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalPage: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ProductsResponse>(
          'https://eticaretapi-gghdgef9bzameteu.switzerlandnorth-01.azurewebsites.net/api/Product/GetProducts'
        );
        setProducts(response.data.products);
        setPagination({
          totalPage: response.data.totalPage,
          totalCount: response.data.totalCount,
          hasPreviousPage: response.data.hasPreviousPage,
          hasNextPage: response.data.hasNextPage
        });
      } catch (err) {
        setError('Ürünler yüklenirken bir hata oluştu');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-normal">Yeni Ürünler</h1>
      </div>

      {/* Ürün Grid'i */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.productId} href={`/products/${product.productId}`} className="group cursor-pointer block">
            {/* Ürün Görseli */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-300">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full aspect-[3/4] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-product.jpg";
                }}
              />

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
                    id: product.productId,
                    name: product.name,
                    price: product.price,
                    image: product.imageUrl,
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
                className={`absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 z-10 ${isItemLiked(product.productId, "Varsayılan", "M") ? 'text-red-500' : 'text-gray-600'
                  }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={isItemLiked(product.productId, "Varsayılan", "M") ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

            </div>

            {/* Ürün Bilgileri */}
            <div className="space-y-1 text-left">
              <h3 className="font-medium text-gray-900 group-hover:text-black transition-colors">
                {product.name}
              </h3>
              <p className="font-semibold text-gray-900">
                {formatTL(product.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Daha Fazla Yükle Butonu */}
      {pagination.hasNextPage && (
        <div className="text-center mt-12">
          <button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300">
            Daha Fazla Ürün Göster
          </button>
        </div>
      )}
      
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