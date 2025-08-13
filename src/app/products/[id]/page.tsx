"use client";
import React, { useState, use } from "react";

import Link from "next/link";
import { useCartStore } from "@/stores/cartStore";
import { useLikeStore } from "@/stores/likeStore";


interface ProductDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductDetail = ({ params }: ProductDetailProps) => {
  const { id } = use(params);
  const [selectedSize, setSelectedSize] = useState("26/32");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const addToCart = useCartStore((state) => state.addToCart);
  const addToLikes = useLikeStore((state) => state.addToLikes);
  const isItemLiked = useLikeStore((state) => state.isItemLiked);

  // Mock product data - gerçek uygulamada API'den gelecek
  const product = {
    id: id,
    name: "Loose Straight Jean",
    price: 1000,
    colors: [
      { name: "Lacivert", value: "#1e3a8a" },
      { name: "Açık Mavi", value: "#3b82f6" },
    ],
    sizes: ["26/32", "27/32", "28/32", "29/32", "30/32"],
    images: [
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
      "/placeholder-product.jpg",
    ],
    description:
      "Denim koleksiyonundan Jane Classic Denim Pustu Açık Mavi Jean Pantolon. Normal bel, Düz kesim, düz paça Classic Denim. üstün kalitesi, gerçek indigo renkleri özel aksesuar detayları, bügünün en öne çıkan fikrini ve klasiği yeniden yorumlayan zamansız görünüşüne sahip",
    features: {
      fabric: "%100 Pamuk",
      measurements: "Jean: Bel: 26/ Boy: 32. Üst: S",
      size: "Boy: 179 cm / Bel: 59 cm / Göğüs: 84 cm / Kalça: 90 cm",
    },
    productCode: "1567865656536-856",
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Lütfen beden seçiniz!");
      return;
    }

    addToCart({
      id: id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedColor: product.colors[selectedColor].name,
      selectedSize,
      quantity,
    });

    alert(`${product.name} sepete eklendi!`);
  };

  const handleLike = () => {
    if (!selectedSize) {
      alert("Lütfen beden seçiniz!");
      return;
    }

    const itemToLike = {
      id: id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      selectedColor: product.colors[selectedColor].name,
      selectedSize,
    };

    addToLikes(itemToLike);
    alert(`${product.name} beğenilere eklendi!`);
  };

  const isLiked = isItemLiked(id, product.colors[selectedColor].name, selectedSize);

  const breadcrumbs = [
    { name: "Anasayfa", href: "/" },
    { name: "Kadın", href: "/products?category=kadin" },
    { name: "Jean", href: "/products?category=jean" },
    { name: product.name, href: "#" },
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
            <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                <span className="text-gray-500 text-xl">
                  Product Image {activeImage + 1}
                </span>
              </div>
            </div>
          </div>

          {/* Küçük Görseller */}
          <div className="flex space-x-2">
            {product.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-20 h-24 bg-gray-200 rounded-lg overflow-hidden border-2 ${
                  activeImage === index ? "border-black" : "border-transparent"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300">
                  <span className="text-xs text-gray-500">{index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sağ: Ürün Bilgileri */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-normal">{product.name}</h1>
            <button 
              onClick={handleLike}
              className={`w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors ${
                isLiked ? 'text-red-500' : 'text-gray-600'
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

          <p className="text-2xl font-semibold mb-6">{product.price}</p>

          {/* Renk Seçimi */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-2">
              {product.colors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(index)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor === index ? "border-black" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: color.value }}
                />
              ))}
            </div>
          </div>

          {/* Beden Seçimi */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Beden Seç</h3>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-black"
            >
              <option value="">Beden seçiniz</option>
              {product.sizes.map((size) => (
                <option key={size} value={size}>
                  {size}
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
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {isLiked ? 'Beğenildi' : 'Beğen'}
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
                <p className="text-sm text-gray-600">
                  {product.features.fabric}
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Manken Ölçüleri</h4>
                <p className="text-sm text-gray-600">
                  {product.features.measurements}
                </p>
                <p className="text-sm text-gray-600">{product.features.size}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Ürün Kodu</h4>
                <p className="text-sm text-gray-600">{product.productCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
