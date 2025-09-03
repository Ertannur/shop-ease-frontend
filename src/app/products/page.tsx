"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useLikeStore } from "@/stores";
import { api, formatTL, PRODUCT_ENDPOINTS } from "@/lib";
import AuthToast from "@/components/Toast/AuthToast";
import { ApiProduct, ProductsResponse } from "@/Types";
import { searchProductsByNameAPI } from "@/services/productsApi";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const search = searchParams.get('search');
  
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    position?: { x: number; y: number };
  }>({ show: false, message: '' });

  const Base_Url = "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net"
  
  const addToLikes = useLikeStore((state) => state.addToLikes);
  const isItemLiked = useLikeStore((state) => state.isItemLiked);

  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    totalPage: 0,
    totalCount: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchProducts = async (page: number = 1, append: boolean = false) => {
      try {
        setLoading(true);
        
        let response: ProductsResponse;
        if (search) {
          // Arama varsa yeni API'yi kullan
          response = await searchProductsByNameAPI(search, page, PRODUCTS_PER_PAGE);
        } else {
          // Arama yoksa normal API'yi kullan
          const apiUrl = `${PRODUCT_ENDPOINTS.getProducts}?currentPage=${page}&pageSize=${PRODUCTS_PER_PAGE}`;
          const apiResponse = await api.get<ProductsResponse>(apiUrl);
          response = apiResponse.data;
        }
        
        if (append) {
          setProducts(prev => [...prev, ...response.products]);
        } else {
          setProducts(response.products);
        }
        
        setHasMore(response.products.length === PRODUCTS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, category, search]);

  const loadMoreProducts = async () => {
    if (loadingMore || !pagination.hasNextPage) return;
    
    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;
      let apiUrl = `${Base_Url}/api/Product/GetProducts?page=${nextPage}&pageSize=8`;
      
      // Kategori parametresi varsa ekle
      if (category) {
        apiUrl += `&category=${category}`;
      }
      
      // Arama parametresi varsa ekle
      if (search) {
        apiUrl += `&search=${encodeURIComponent(search)}`;
      }
      
      const response = await axios.get<ProductsResponse>(apiUrl);
      
      // Mevcut ürünlere yeni ürünleri ekle (duplicate kontrol ile)
      setProducts(prevProducts => {
        const existingIds = new Set(prevProducts.map(p => p.productId));
        let newProducts = response.data.products.filter((p: ApiProduct) => !existingIds.has(p.productId));
        
        // Arama filtresi uygula
        if (search) {
          newProducts = newProducts.filter(product => 
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description?.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        return [...prevProducts, ...newProducts];
      });
      setCurrentPage(nextPage);
      setPagination({
        totalPage: response.data.totalPage,
        totalCount: response.data.totalCount,
        hasPreviousPage: response.data.hasPreviousPage,
        hasNextPage: response.data.hasNextPage
      });
    } catch (err) {
      console.error('Error loading more products:', err);
    } finally {
      setLoadingMore(false);
    }
  };

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
        <h1 className="text-3xl font-normal">
          {search ? `"${search}" için arama sonuçları` : 
           category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Ürünleri` : 
           'Yeni Ürünler'}
        </h1>
      </div>

      {/* Ürün Grid'i */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.productId} href={`/products/${product.productId}`} className="group cursor-pointer block">
            {/* Ürün Görseli */}
            <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-300">
              <Image 
                src={product.imageUrl || "/placeholder-product.jpg"}
                alt={product.name}
                width={300}
                height={400}
                className="w-full aspect-[3/4] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23cccccc'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%23666666' font-family='Arial' font-size='16'%3EÜrün Resmi%3C/text%3E%3C/svg%3E";
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
          <button 
            onClick={loadMoreProducts}
            disabled={loadingMore}
            className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
          >
            {loadingMore ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Yükleniyor...
              </>
            ) : (
              'Daha Fazla Ürün Göster'
            )}
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