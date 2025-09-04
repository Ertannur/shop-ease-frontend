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
import {
  getFilteredProductsAPI,
  searchProductsByNameAPI,
} from "@/services/productsApi";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const type = searchParams.get("type");
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    position?: { x: number; y: number };
  }>({ show: false, message: "" });

  const Base_Url =
    "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net";

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
    hasNextPage: false,
  });

  const PRODUCTS_PER_PAGE = 8;

  useEffect(() => {
    const fetchProducts = async (page: number = 1, append: boolean = false) => {
      try {
        setLoading(true);

        let response: ProductsResponse;
        if (search) {
          // Arama varsa yeni API'yi kullan
          response = await searchProductsByNameAPI(
            search,
            page,
            PRODUCTS_PER_PAGE
          );
          console.log("ARAMA API Response:", response.products);
        } else if (type) {
          response = await getFilteredProductsAPI(
            type as `new` | `discounted` | `weekly` | `best-sellers`,
            page,
            PRODUCTS_PER_PAGE
          );
          console.log("FILTERED API Response:", response.products);
          console.log("Tüm ürünlerin resim durumu:", response.products.map(p => ({
            name: p.name,
            imageUrl: p.imageUrl,
            hasImage: !!p.imageUrl
          })));
        } else {
          // Arama yoksa normal API'yi kullan
          const apiUrl = `${PRODUCT_ENDPOINTS.getProducts}?currentPage=${page}&pageSize=${PRODUCTS_PER_PAGE}`;
          const apiResponse = await api.get<ProductsResponse>(apiUrl);
          response = apiResponse.data;
          console.log("NORMAL API Response:", response.products);
        }

        // Eksik resimleri arama API'sinden tamamla
        const completeProductImages = async (products: ApiProduct[]) => {
          const productsWithNullImages = products.filter(p => !p.imageUrl);
          
          for (const product of productsWithNullImages) {
            try {
              const searchResponse = await searchProductsByNameAPI(product.name, 1, 1);
              const foundProduct = searchResponse.products.find(p => p.productId === product.productId);
              if (foundProduct && foundProduct.imageUrl) {
                product.imageUrl = foundProduct.imageUrl;
                console.log(`Resim tamamlandı: ${product.name} -> ${foundProduct.imageUrl}`);
              }
            } catch (error) {
              console.error(`Error fetching image for ${product.name}:`, error);
            }
          }
          
          return products;
        };

        const completedProducts = await completeProductImages(response.products);

        if (append) {
          setProducts((prev) => [...prev, ...completedProducts]);
        } else {
          setProducts(completedProducts);
        }

        setHasMore(response.products.length === PRODUCTS_PER_PAGE);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, category, search, type]);

  const loadMoreProducts = async () => {
    if (loadingMore || !pagination.hasNextPage) return;

    try {
      setLoadingMore(true);
      const nextPage = currentPage + 1;

      let response: ProductsResponse;
      if (search) {
        // Arama varsa yeni API'yi kullan
        response = await searchProductsByNameAPI(
          search,
          nextPage,
          PRODUCTS_PER_PAGE
        );
      } else if (type) {
        // Type varsa filtered products API'yi kullan
        response = await getFilteredProductsAPI(
          type as "new" | "discounted" | "weekly" | "best-sellers",
          nextPage,
          PRODUCTS_PER_PAGE
        );
      } else {
        // Normal API'yi kullan
        let apiUrl = `${Base_Url}/api/Product/GetProducts?page=${nextPage}&pageSize=8`;

        // Kategori parametresi varsa ekle
        if (category) {
          apiUrl += `&category=${category}`;
        }

        const apiResponse = await axios.get<ProductsResponse>(apiUrl);
        response = apiResponse.data;
      }

      // Mevcut ürünlere yeni ürünleri ekle (duplicate kontrol ile)
      setProducts((prevProducts) => {
        const existingIds = new Set(prevProducts.map((p) => p.productId));
        const newProducts = response.products.filter(
          (p: ApiProduct) => !existingIds.has(p.productId)
        );
        return [...prevProducts, ...newProducts];
      });

      setCurrentPage(nextPage);
      setPagination({
        totalPage: response.totalPage,
        totalCount: response.totalCount,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
    } catch (err) {
      console.error("Error loading more products:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Ürünler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 dark:bg-slate-900 min-h-screen ">
      {/* Başlık */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold dark:text-white gradient-text">
          {search
            ? `"${search}" için arama sonuçları`
            : type === "new"
            ? "Yeni Ürünler"
            : type === "discounted"
            ? "İndirimli Ürünler"
            : type === "best-sellers"
            ? "En Çok Satanlar"
            : type === "weekly"
            ? "Haftanın Ürünleri"
            : type === "deals"
            ? "Fırsat Ürünleri"
            : category
            ? `${category.charAt(0).toUpperCase() + category.slice(1)} Ürünleri`
            : "Yeni Ürünler"}
        </h1>
      </div>

      {/* Ürün Grid'i */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link
            key={product.productId}
            href={`/products/${product.productId}`}
            className="group cursor-pointer block"
          >
            {/* Ürün Görseli */}
            <div className="relative bg-gray-200 dark:bg-slate-800 rounded-lg overflow-hidden mb-4 group-hover:shadow-lg transition-shadow duration-300">
              <Image
                src={product.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EÜrün Resmi%3C/text%3E%3C/svg%3E"}
                alt={product.name}
                width={300}
                height={400}
                className="w-full aspect-[3/4] object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EÜrün Resmi%3C/text%3E%3C/svg%3E";
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
                    y: rect.top,
                  };

                  addToLikes(
                    {
                      id: product.productId,
                      name: product.name,
                      price: product.price,
                      image: product.imageUrl,
                      selectedColor: "Varsayılan",
                      selectedSize: "M",
                    },
                    () => {
                      // Auth required callback - toast göster
                      setToast({
                        show: true,
                        message:
                          "Bu ürünü beğenmek için giriş yapmanız gerekiyor.",
                        position,
                      });
                    }
                  );
                }}
                className={`absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-gray-100 z-10 ${
                  isItemLiked(product.productId, "Varsayılan", "M")
                    ? "text-red-500"
                    : "text-gray-600"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill={
                    isItemLiked(product.productId, "Varsayılan", "M")
                      ? "currentColor"
                      : "none"
                  }
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {/* Ürün Bilgileri */}
            <div className="space-y-1 text-left">
              <h3 className="font-medium  dark:text-white  dark:group-hover:text-gray-400 transition-colors">
                {product.name}
              </h3>
              <p className="font-semibold  dark:text-white">
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
              "Daha Fazla Ürün Göster"
            )}
          </button>
        </div>
      )}

      {/* Auth Toast */}
      <AuthToast
        show={toast.show}
        message={toast.message}
        position={toast.position}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </div>
  );
};

export default ProductsPage;
