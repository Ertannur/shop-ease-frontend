"use client";
import React, {  useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useOrderStore } from "@/stores/orderStore";
import { useCartStore } from "@/stores/cartStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { orderRequestSchema, OrderRequest } from "@/Types/Order";

const CheckoutPage = () => {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderRequest>({
    resolver: zodResolver(orderRequestSchema),
    mode: "onSubmit",
  });
  const cartItems = useCartStore.getState().items;
  const realTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const onSubmit = (data: OrderRequest) => {
    // Sipariş verisi
    useOrderStore.getState().setOrderData({
      orderId: `ORD-${Date.now()}`,
      total: realTotal,
      products: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      customerInfo: data.customerInfo,
      paymentInfo: data.paymentInfo,
      createdAt: new Date(),
    });

    // Geçmişe ekle
    useOrderStore.getState().addToOrderHistory({
      orderId: `ORD-${Date.now()}`,
      total: realTotal,
      products: cartItems.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      customerInfo: data.customerInfo,
      paymentInfo: data.paymentInfo,
      createdAt: new Date(),
    });

    // Sepeti temizle
    useCartStore.getState().clearCart();

    // Toast
    setToastMessage("Ödeme başarılı");
    setToastType("success");
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      router.push("/thank-you");
    }, 3000);
  };

  // Mock sepet totali

  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link
          href="/cart"
          className="flex items-center text-gray-600 hover:text-black transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Alışverişe Devam Et
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol: Ödeme Formu */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-semibold mb-8">Ödeme</h1>

          <form
            onSubmit={(e) => {
              handleFormSubmit(e);
            }}
            className="space-y-8"
          >
            {/* Adres Bölümü */}
            <div>
              <h2 className="text-lg font-medium mb-4">Adres</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Adres Başlığı"
                  {...register("addressTitle")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
                <div className="text-gray-500 text-sm mt-1">
                  Format: Ev, Ofis vb.
                </div>
                {errors.addressTitle && (
                  <div className="text-red-500 text-sm mt-1">
                    {errors.addressTitle.message}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Ad"
                      {...register("customerInfo.name")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: Adınız
                    </div>
                    {errors.customerInfo?.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerInfo.name.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Soyad"
                      {...register("customerInfo.surname")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: Soyadınız
                    </div>
                    {errors.customerInfo?.surname && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerInfo.surname.message}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="email"
                      placeholder="Email"
                      {...register("customerInfo.email")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: example@example.com
                    </div>
                    {errors.customerInfo?.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerInfo.email.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="5XX XXX XX XX"
                      {...register("customerInfo.phone")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                      maxLength={13}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\s/g, "");
                        value = value.replace(/\D/g, "");
                        if (value.length <= 11) {
                          value = value.replace(
                            /(\d{3})(\d{3})(\d{2})(\d{2})/,
                            "$1 $2 $3 $4"
                          );
                        }
                        e.target.value = value;
                      }}
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: 5XX XXX XX XX
                    </div>
                    {errors.customerInfo?.phone && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerInfo.phone.message}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <textarea
                    placeholder="Adres"
                    rows={3}
                    {...register("customerInfo.address")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black resize-none"
                  />
                  <div className="text-gray-500 text-sm mt-1">
                    Format: Sokak, Mahalle, Bina, Kat, Daire
                  </div>
                  {errors.customerInfo?.address && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.customerInfo.address.message}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="İl"
                      {...register("customerInfo.city")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: İstanbul
                    </div>
                    {errors.customerInfo?.city && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerInfo.city.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="İlçe"
                      {...register("customerInfo.district")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: Beşiktaş
                    </div>
                    {errors.customerInfo?.district && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerInfo.district.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Kart Bilgileri Bölümü */}
            <div>
              <h2 className="text-lg font-medium mb-4">Kart Bilgileri</h2>
              <div className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    {...register("paymentInfo.cardNumber")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    maxLength={19}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\s/g, "");
                      value = value.replace(/\D/g, "");
                      value = value.replace(/(\d{4})(?=\d)/g, "$1 ");
                      e.target.value = value;
                    }}
                  />
                  <div className="text-gray-500 text-sm mt-1">
                    Format: 1234 5678 9012 3456
                  </div>
                  {errors.paymentInfo?.cardNumber && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.paymentInfo.cardNumber.message}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      {...register("paymentInfo.expiryDate")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                      maxLength={5}
                      onInput={(e) => {
                        let value = e.currentTarget.value.replace(/\D/g, "");
                        if (value.length >= 2) {
                          value = value.slice(0, 2) + "/" + value.slice(2);
                        }
                        e.currentTarget.value = value;
                      }}
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: Ay/Yıl
                    </div>
                    {errors.paymentInfo?.expiryDate && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.paymentInfo.expiryDate.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="123"
                      {...register("paymentInfo.cvv")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                      maxLength={4}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        e.target.value = value;
                      }}
                    />
                    <div className="text-gray-500 text-sm mt-1">
                      Format: 123
                    </div>
                    {errors.paymentInfo?.cvv && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.paymentInfo.cvv.message}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Ad Soyad"
                    {...register("paymentInfo.cardholderName")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  />
                  <div className="text-gray-500 text-sm mt-1">
                    Format: Ad Soyad
                  </div>
                  {errors.paymentInfo?.cardholderName && (
                    <div className="text-red-500 text-sm mt-1">
                      {errors.paymentInfo.cardholderName.message}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ödeme Butonu - Mobilde */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium lg:hidden"
            >
              Ödeme
            </button>

            {/* Ödeme Butonu - Desktop */}
            <button
              type="submit"
              className="hidden lg:block w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium"
            >
              Ödeme
            </button>
          </form>
        </div>

        {/* Sağ: Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 rounded-lg sticky top-8">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span>Sipariş Toplamı</span>
                <span>{realTotal} TL</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Kargo</span>
                <span>0 TL</span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Toplam</span>
                  <span>{realTotal} TL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showToast && (
        <div
          className={`fixed bottom-4 left-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
            toastType === "success"
              ? "bg-green-500 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
