"use client";
import React from "react";
import Link from "next/link";
import { useOrderStore } from "@/stores/orderStore";

const ThankYouPage = () => {
  // Mock data - sonra gerçek verilerle değiştireceğiz
  const { orderData } = useOrderStore();

  if (!orderData) {
    console.log("orderData yok, loading gösteriliyor");
    return (
      <div>
        <div className="container py-8 text-center">
          <div className="text-2xl font-bold">Yükleniyor...</div>
        </div>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-600 mb-2">
          Teşekkürler! 🎉
        </h1>
        <p className="text-gray-600">Siparişiniz başarıyla alındı</p>
      </div>

      {/* Order Details */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Sipariş Detayları</h2>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="font-medium">Sipariş No:</span>
            <span className="text-blue-600 font-bold">{orderData.orderId}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-medium">Toplam Tutar:</span>
            <span className="text-gray-600">
              {orderData.products
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}{" "}
              TL
            </span>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Sipariş Edilen Ürünler</h3>

        <div className="space-y-3">
          {orderData.products.map((product, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b"
            >
              <div>
                <span className="font-medium">{product.name}</span>
                <span className="text-gray-500 ml-2">x{product.quantity}</span>
              </div>
              <span className="font-semibold">
                {product.price * product.quantity} TL
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Alışverişe Devam Et
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
