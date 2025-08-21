"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useCartStore } from "@/stores";
import { 
  getUserAddressAPI,
  addAddressAPI 
} from "@/features/address";
import { 
  createOrderAPI 
} from "@/features/order";
import { 
  Address,
  AddAddressRequest 
} from "@/Types";
import { formatTL } from "@/lib";

const CheckoutPage = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newAddress, setNewAddress] = useState({
    title: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postCode: ""
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const userAddresses = await getUserAddressAPI();
      setAddresses(userAddresses);
      if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].adressId);
      }
    } catch (error) {
      console.error('Failed to load addresses:', error);
      setMessage({ type: 'error', text: 'Adresler yüklenirken hata oluştu' });
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const addData: AddAddressRequest = {
        title: newAddress.title,
        name: newAddress.name,
        surname: newAddress.surname,
        email: newAddress.email,
        phone: newAddress.phone,
        address: newAddress.address,
        city: newAddress.city,
        district: newAddress.district,
        postCode: newAddress.postCode
      };

      await addAddressAPI(addData);
      setNewAddress({
        title: "", name: "", surname: "", email: "", phone: "",
        address: "", city: "", district: "", postCode: ""
      });
      setShowAddAddressForm(false);
      setMessage({ type: 'success', text: 'Adres başarıyla eklendi' });
      await loadAddresses(); // Refresh addresses
    } catch (error) {
      console.error('Add address failed:', error);
      setMessage({ type: 'error', text: 'Adres eklenirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setMessage({ type: 'error', text: 'Lütfen bir teslimat adresi seçin' });
      return;
    }

    if (cartItems.length === 0) {
      setMessage({ type: 'error', text: 'Sepetiniz boş' });
      return;
    }

    try {
      setLoading(true);
      await createOrderAPI(selectedAddressId);
      
      // Order başarılı, sepeti temizle
      clearCart();
      
      setMessage({ type: 'success', text: 'Siparişiniz başarıyla oluşturuldu!' });
      
      // 2 saniye sonra hesap sayfasına yönlendir
      setTimeout(() => {
        router.push('/account?tab=orders');
      }, 2000);
      
    } catch (error) {
      console.error('Order creation failed:', error);
      setMessage({ type: 'error', text: 'Sipariş oluşturulurken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <AuthGuard>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">Sipariş verebilmek için önce ürün eklemeniz gerekiyor.</p>
          <Link href="/products" className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800">
            Alışverişe Devam Et
          </Link>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Sipariş Ver</h1>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className="flex justify-between items-center">
              <span>{message.text}</span>
              <button onClick={() => setMessage(null)} className="ml-2 text-lg font-bold">×</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Address Selection */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Teslimat Adresi</h2>
              
              {/* Address Selection */}
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.adressId}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedAddressId === address.adressId
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedAddressId(address.adressId)}
                    >
                      <div className="flex items-start space-x-3">
                        <input
                          type="radio"
                          checked={selectedAddressId === address.adressId}
                          onChange={() => setSelectedAddressId(address.adressId)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{address.title}</h3>
                          <p className="text-sm text-gray-600">
                            {address.name} {address.surname}
                          </p>
                          <p className="text-sm text-gray-600">{address.phone}</p>
                          <p className="text-sm text-gray-600">
                            {address.address}, {address.district}, {address.city} {address.postCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-4">Kayıtlı adresiniz bulunmuyor.</p>
              )}

              {/* Add New Address Button */}
              <button
                onClick={() => setShowAddAddressForm(!showAddAddressForm)}
                className="mt-4 text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                {showAddAddressForm ? 'İptal Et' : 'Yeni Adres Ekle'}
              </button>

              {/* Add Address Form */}
              {showAddAddressForm && (
                <div className="mt-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium mb-4">Yeni Adres Ekle</h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Adres Başlığı"
                        value={newAddress.title}
                        onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ad"
                        value={newAddress.name}
                        onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Soyad"
                        value={newAddress.surname}
                        onChange={(e) => setNewAddress({...newAddress, surname: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="email"
                        placeholder="E-posta"
                        value={newAddress.email}
                        onChange={(e) => setNewAddress({...newAddress, email: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Telefon"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Posta Kodu"
                        value={newAddress.postCode}
                        onChange={(e) => setNewAddress({...newAddress, postCode: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="İl"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="İlçe"
                        value={newAddress.district}
                        onChange={(e) => setNewAddress({...newAddress, district: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Adres Detayı"
                      value={newAddress.address}
                      onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2 h-20"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                    >
                      {loading ? 'Ekleniyor...' : 'Adresi Ekle'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div>
            <div className="bg-gray-50 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
              
              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.selectedColor} - {item.selectedSize} - Adet: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">{formatTL(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Ara Toplam:</span>
                  <span>{formatTL(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kargo:</span>
                  <span>{shipping === 0 ? 'Ücretsiz' : formatTL(shipping)}</span>
                </div>
                {subtotal > 500 && (
                  <p className="text-xs text-green-600">🎉 500 TL üzeri ücretsiz kargo!</p>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Toplam:</span>
                  <span>{formatTL(total)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading || !selectedAddressId}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Sipariş Veriliyor...' : 'Siparişi Tamamla'}
              </button>

              <p className="text-xs text-gray-500 mt-3 text-center">
                * Siparişiniz sepetinizdeki ürünlerle oluşturulacaktır
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CheckoutPage;