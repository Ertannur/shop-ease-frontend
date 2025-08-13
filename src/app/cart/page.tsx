"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "../stores/cartStore";

const CartPage = () => {
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  const breadcrumbs = [
    { name: "Anasayfa", href: "/" },
    { name: "Sepetim", href: "#" }
  ];

  if (cartItems.length === 0) {
    return (
      <div className="container py-8 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-center">
          <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H19M7 13v6a1 1 0 001 1h10a1 1 0 001-1v-6M7 13L5.4 5M17 13v6M9 19v2m6-2v2"/>
          </svg>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Sepetiniz Boş</h2>
          <p className="text-gray-500 mb-6">Alışverişe başlamak için ürünlerimizi keşfedin</p>
          <Link 
            href="/products" 
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Alışverişe Başla
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

      <h1 className="text-3xl font-bold mb-8">Sepetim</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sepet Ürünleri */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex gap-4">
                {/* Ürün Resmi */}
                <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Ürün Bilgileri */}
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <button
                      onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    Renk: {item.selectedColor} | Beden: {item.selectedSize}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600">Miktar:</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedColor, item.selectedSize, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">{item.price * item.quantity} TL</p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">{item.price} TL x {item.quantity}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold mb-4">Sipariş Özeti</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span>{subtotal.toFixed(2)} TL</span>
              </div>
              <div className="flex justify-between">
                <span>Kargo</span>
                <span>{shipping === 0 ? "Ücretsiz" : `${shipping.toFixed(2)} TL`}</span>
              </div>
              {shipping === 0 && (
                <p className="text-sm text-green-600">500 TL üzeri ücretsiz kargo!</p>
              )}
              <hr />
              <div className="flex justify-between font-semibold text-lg">
                <span>Toplam</span>
                <span>{total.toFixed(2)} TL</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors text-center block font-medium"
            >
              Satın Al
            </Link>

            <Link
              href="/products"
              className="w-full text-center text-gray-600 hover:text-gray-800 py-2 text-sm block mt-3"
            >
              Alışverişe Devam Et
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;