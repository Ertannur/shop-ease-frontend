"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCartStore, useLikeStore } from "@/stores";
import { formatTL } from "@/lib";
import AuthToast from "@/components/Toast/AuthToast";
import SuccessToast from "@/components/Toast/SuccessToast";
import { ApiProduct } from "@/Types";
import { getProductByIdAPI, searchProductsByNameAPI } from "@/services/productsApi";
import Image from "next/image";

interface ProductDetailClientProps {
  id: string;
}

const ProductDetailClient = ({ id }: ProductDetailClientProps) => {
  const [selectedSize, setSelectedSize] = useState("26/32");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Toast states
  const [successToast, setSuccessToast] = useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: "" });

  const [authToast, setAuthToast] = useState<{
    show: boolean;
    message: string;
    position?: { x: number; y: number };
  }>({ show: false, message: "" });

  const addToCart = useCartStore((state) => state.addToCart);
  const addToLikes = useLikeStore((state) => state.addToLikes);
  const isItemLiked = useLikeStore((state) => state.isItemLiked);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("API çağrısı yapılıyor, ID:", id);
        const productData = await getProductByIdAPI(id);
        console.log("API'den gelen raw response:", productData);
        
        // Detail API'sinde images array olarak geliyor, imageUrl'e çevir
        if (productData.images && productData.images.length > 0) {
          productData.imageUrl = productData.images[0];
        } else {
          // Eğer resim yoksa, arama API'sinden tamamla
          try {
            console.log("Resim eksik, arama API'sinden tamamlanıyor...");
            const searchResponse = await searchProductsByNameAPI(productData.title, 1, 1);
            const foundProduct = searchResponse.products.find(p => p.productId === productData.productId);
            if (foundProduct && foundProduct.imageUrl) {
              productData.imageUrl = foundProduct.imageUrl;
              console.log(`Resim tamamlandı: ${productData.title} -> ${foundProduct.imageUrl}`);
            }
          } catch (error) {
            console.error("Error fetching image for product:", error);
          }
        }
        
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Ürün bilgileri yüklenirken bir hata oluştu!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Ürün yükleniyor...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Ürün bulunamadı
          </h2>
          <p className="text-gray-500 mb-6">
            {error || "Ürün bilgileri yüklenemedi"}
          </p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize || !product) {
      setSuccessToast({
        show: true,
        message: "Lütfen beden seçiniz!",
      });
      return;
    }

    const availableStock = getSelectedStock();
    if (quantity > availableStock) {
      setSuccessToast({
        show: true,
        message: `Stokta ${availableStock} adet ürün var!`,
      })
      return;
    }

    console.log("Sepete eklenen veri:", {
      selectedColor,
      selectedSize,
      quantity
    });

    try {
      await addToCart({
        id: product.productId,
        name: product.title,
        price: product.price,
        image: product.imageUrl,
        selectedColor: selectedColor || "Varsayılan",
        selectedSize,
        quantity,
      });

      setSuccessToast({
        show: true,
        message: `${product.title} sepete eklendi!`,
      });
    } catch (error) {
      console.error("Add to cart failed:", error);
      setSuccessToast({
        show: true,
        message: "Ürün sepete eklenirken bir hata oluştu!",
      });
    }
  };

  const handleLike = async (event?: React.MouseEvent<HTMLButtonElement>) => {
    if (!selectedSize || !product) {
      setSuccessToast({
        show: true,
        message: "Lütfen beden seçiniz!",
      });
      return;
    }

    const itemToLike = {
      id: product.productId,
      name: product.title,
      price: product.price,
      image: product.imageUrl,
      selectedColor: selectedColor || "Varsayılan",
      selectedSize,
    };

    try {
      await addToLikes(itemToLike, () => {
        // Auth required callback
        let position = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

        if (event) {
          const rect = event.currentTarget.getBoundingClientRect();
          position = {
            x: rect.left + rect.width / 2,
            y: rect.top,
          };
        }

        setAuthToast({
          show: true,
          message: "Bu ürünü beğenmek için giriş yapmanız gerekiyor.",
          position,
        });
      });

      // Eğer buraya geldiysek, authentication başarılı
      if (localStorage.getItem("token")) {
        setSuccessToast({
          show: true,
          message: `${product.title} beğenilere eklendi!`,
        });
      }
    } catch (error) {
      console.error("Add to likes failed:", error);
      setSuccessToast({
        show: true,
        message: "Ürün beğenilere eklenirken bir hata oluştu!",
      });
    }
  };

  const getSelectedStock = () => {
    if (!selectedColor || !selectedSize || !product?.details) return 0;

    const selectedDetail = product.details.find(
      (detail) => detail.color === selectedColor && detail.size === selectedSize
    );
    return selectedDetail?.stock || 0;
  };

  const isLiked = isItemLiked(
    product.productId,
    selectedColor || "Varsayılan",
    selectedSize
  );

  const breadcrumbs = [
    { name: "Anasayfa", href: "/" },
    { name: "Kadın", href: "/products?category=kadin" },
    { name: "Jean", href: "/products?category=jean" },
    { name: product.title, href: "#" },
  ];

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && <span>|</span>}
              <Link
                href={item.href}
                className={
                  index === breadcrumbs.length - 1
                    ? "text-gray-900"
                    : "hover:text-gray-900"
                }
              >
                {item.name}
              </Link>
            </React.Fragment>
          ))}
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Sol: Ürün Görselleri */}
        <div>
          {/* Ana Görsel */}
          <div className="mb-4">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden relative">
              <Image
                src={product.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EÜrün Resmi%3C/text%3E%3C/svg%3E"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Küçük Görseller */}
          <div className="flex space-x-2">
            {/* Tek görsel olduğu için sadece bir tane göster */}
            <button
              onClick={() => setActiveImage(0)}
              className={`w-20 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 relative ${
                activeImage === 0 ? "border-black" : "border-transparent"
              }`}
            >
              <Image
                src={product.imageUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f3f4f6'/%3E%3Ctext x='150' y='200' text-anchor='middle' fill='%236b7280' font-family='Arial' font-size='14'%3EÜrün Resmi%3C/text%3E%3C/svg%3E"}
                alt={product.title}
                fill
                className="object-cover"
              />
            </button>
          </div>
        </div>

        {/* Sağ: Ürün Bilgileri */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-normal">{product.title}</h1>
            <button
              onClick={handleLike}
              className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${
                isLiked ? "text-red-500" : "text-gray-600"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
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

          <p className="text-2xl font-semibold mb-6">
            {formatTL(product.price)}
          </p>

          {/* Renk Seçimi */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              {product.details?.map((detail, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(detail.color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === detail.color
                      ? "border-black"
                      : "border-gray-300"
                  }`}
                  style={{ backgroundColor: detail.color }}
                />
              ))}
            </div>
          </div>

          {/* Beden Seçimi */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Beden Seç</h3>
            <select
              id="size-select"
              name="size"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:border-black dark:focus:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" value="">Beden seçiniz</option>
              {product.details?.map((detail) => (
                <option className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white" key={detail.size} value={detail.size}>
                  {detail.size}
                </option>
              ))}
            </select>
          </div>

          {/* Miktar Seçimi */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Miktar</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <span className="text-lg font-medium w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Sepete Ekle */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedSize}
            className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Sepete Ekle ({quantity} adet)
          </button>

          {/* Beğen Butonu */}
          <button
            onClick={handleLike}
            disabled={!selectedSize}
            className={`w-full py-4 rounded-md transition-colors duration-300 text-lg font-medium mb-8 disabled:bg-gray-400 disabled:cursor-not-allowed ${
              isLiked
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {isLiked ? "Beğenildi" : "Beğen"}
          </button>

          {/* Ürün Özellikleri */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Ürün Özellikleri</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Kumaş Bilgileri</h4>
                <p className="text-sm text-gray-600">%100 Pamuk</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Manken Ölçüleri</h4>
                <p className="text-sm text-gray-600">
                  Jean: Bel: {product.details?.[0].size} / Boy:{" "}
                  {product.details?.[0].size}
                </p>
                <p className="text-sm text-gray-600">
                  Boy: 179 cm / Bel: 59 cm / Göğüs: 84 cm / Kalça: 90 cm
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Ürün Kodu</h4>
                <p className="text-sm text-gray-600">
                  {product.details?.[0].productDetailId}
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Stok</h4>
                <p className="text-sm text-gray-600">
                  {getSelectedStock()} adet
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <SuccessToast
        show={successToast.show}
        message={successToast.message}
        onClose={() => setSuccessToast({ show: false, message: "" })}
      />

      {/* Auth Toast */}
      <AuthToast
        show={authToast.show}
        message={authToast.message}
        onClose={() => setAuthToast({ show: false, message: "" })}
        position={authToast.position}
      />
    </div>
  );
};

export default ProductDetailClient;
