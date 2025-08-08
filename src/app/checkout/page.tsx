"use client";
import React, { useState } from "react";
import Link from "next/link";

const CheckoutPage = () => {
  const [formData, setFormData] = useState({
    // Adres Bilgileri
    addressTitle: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    
    // Kart Bilgileri
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ödeme işlemi burada yapılacak
    console.log("Ödeme bilgileri:", formData);
  };

  // Mock sepet totali
  const orderSummary = {
    subtotal: 1000,
    shipping: 100,
    total: 1100
  };

  return (
    <div className="container py-8">
      {/* Header */}
      <div className="flex items-center mb-8">
        <Link href="/cart" className="flex items-center text-gray-600 hover:text-black transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Alışverişe Devam Et
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol: Ödeme Formu */}
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-semibold mb-8">Ödeme</h1>
        
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Adres Bölümü */}
            <div>
              <h2 className="text-lg font-medium mb-4">Adres</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="addressTitle"
                  placeholder="Adres Başlığı"
                  value={formData.addressTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Ad"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                  <input
                    type="text"
                    name="surname"
                    placeholder="Soyad"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Telefon"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                </div>

                <textarea
                  name="address"
                  placeholder="Adres"
                  rows={3}
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black resize-none"
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="İl"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                  <input
                    type="text"
                    name="district"
                    placeholder="İlçe"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Kart Bilgileri Bölümü */}
            <div>
              <h2 className="text-lg font-medium mb-4">Kart Bilgileri</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Kart Numarası"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  maxLength={19}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="GG/AA/YYYY"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    maxLength={10}
                    required
                  />
                  <input
                    type="text"
                    name="cvv"
                    placeholder="CVV"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                    maxLength={4}
                    required
                  />
                </div>

                <input
                  type="text"
                  name="cardholderName"
                  placeholder="Ad Soyad"
                  value={formData.cardholderName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>
            </div>

            {/* Ödeme Butonu - Mobilde */}
            <button
              type="submit"
              className="w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium lg:hidden"
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
                <span>{orderSummary.subtotal} TL</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span>Kargo</span>
                <span>{orderSummary.shipping} TL</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Toplam</span>
                  <span>{orderSummary.total} TL</span>
                </div>
              </div>
            </div>

            {/* Ödeme Butonu - Desktop */}
            <button
              type="submit"
              form="checkout-form"
              onClick={handleSubmit}
              className="hidden lg:block w-full bg-black text-white py-4 rounded-md hover:bg-gray-800 transition-colors duration-300 text-lg font-medium"
            >
              Ödeme
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;