"use client";
import { useOrderStore } from "@/stores";
import AuthGuard from "@/components/AuthGuard";
import Link from "next/link";
import Image from "next/image";

export default function OrdersPage() {
  const { orderHistory } = useOrderStore();

  return (
    <AuthGuard>
      {orderHistory.length === 0 ? (
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Sipariş Geçmişi</h1>
          <p className="text-gray-600 mb-8">Henüz siparişiniz yok.</p>
          <Link
            href="/"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            Alışverişe Başla
          </Link>
        </div>
      ) : (
        <div className="container py-8">
          <h1 className="text-2xl font-bold mb-6">Sipariş Geçmişi</h1>
          <div className="space-y-6">
            {orderHistory.map((order) => (
              <div
                key={order.orderId}
                className="border border-gray-200 rounded-lg p-6 bg-white"
              >
                {/* Order Header */}
                <div className="flex justify-between items-start mb-4 pb-4 border-b">
                  <div>
                    <h2 className="font-semibold text-lg">
                      Sipariş #{order.orderId}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Tarih: {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₺{order.total.toFixed(2)}</p>
                    <p className="text-green-600 text-sm">Tamamlandı</p>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Teslimat Bilgileri</h3>
                  <p className="text-sm text-gray-600">
                    {order.customerInfo.name} {order.customerInfo.surname}
                  </p>
                  <p className="text-sm text-gray-600">{order.customerInfo.email}</p>
                  <p className="text-sm text-gray-600">{order.customerInfo.phone}</p>
                  <p className="text-sm text-gray-600">
                    {order.customerInfo.address}, {order.customerInfo.city}
                  </p>
                </div>

                {/* Products */}
                <div>
                  <h3 className="font-medium mb-3">Ürünler</h3>
                  <div className="space-y-3">
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-gray-600">
                              Renk: {product.selectedColor} | Beden: {product.selectedSize}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">
                            {product.quantity}x ₺{product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">
                            ₺{(product.quantity * product.price).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AuthGuard>
  );
}
