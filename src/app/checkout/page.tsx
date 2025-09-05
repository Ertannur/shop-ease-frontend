"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/AuthGuard";
import { useCartStore, useOrderStore } from "@/stores";
import { getUserAddressAPI, addAddressAPI, updateAddressAPI, deleteAddressAPI } from "@/features/address";
import { createOrderAPI } from "@/features/order";
import { Address, AddAddressRequest, UpdateAddressRequest, DeleteAddressRequest, OrderData } from "@/Types";
import { formatTL } from "@/lib";

const CheckoutPage = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.items);
  console.log("Checkout sayfasındaki cartItems:", cartItems);
  console.log("Checkout sayfasındaki cartItems.length:", cartItems.length);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);
  const setOrderData = useOrderStore((state) => state.setOrderData);
  const [isLoading, setIsLoading] = useState(true);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  // Kredi kartı formatı için helper fonksiyonlar
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [newAddress, setNewAddress] = useState({
    title: "",
    name: "",
    surname: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    postCode: "",
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 29.99;
  const total = subtotal + shipping;

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 || cartItems.length === 0) {
      setIsLoading(false);
    }
  }, [cartItems]);

  const loadAddresses = async () => {
    try {
      const userAddresses = await getUserAddressAPI();
      setAddresses(userAddresses);
      if (userAddresses.length > 0) {
        setSelectedAddressId(userAddresses[0].adressId);
      }
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setMessage({ type: "error", text: "Adresler yüklenirken hata oluştu" });
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      if (editingAddress) {
        // Update existing address
        const updateData: UpdateAddressRequest = {
          adressId: editingAddress.adressId,
          title: newAddress.title,
          name: newAddress.name,
          surname: newAddress.surname,
          email: newAddress.email,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          district: newAddress.district,
          postCode: newAddress.postCode,
        };

        await updateAddressAPI(updateData);
        setMessage({ type: "success", text: "Adres başarıyla güncellendi" });
        setEditingAddress(null);
      } else {
        // Add new address
        const addData: AddAddressRequest = {
          title: newAddress.title,
          name: newAddress.name,
          surname: newAddress.surname,
          email: newAddress.email,
          phone: newAddress.phone,
          address: newAddress.address,
          city: newAddress.city,
          district: newAddress.district,
          postCode: newAddress.postCode,
        };

        await addAddressAPI(addData);
        setMessage({ type: "success", text: "Adres başarıyla eklendi" });
      }

      setNewAddress({
        title: "",
        name: "",
        surname: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        district: "",
        postCode: "",
      });
      setShowAddAddressForm(false);
      await loadAddresses(); // Refresh addresses
    } catch (error) {
      console.error("Address operation failed:", error);
      setMessage({ 
        type: "error", 
        text: editingAddress ? "Adres güncellenirken hata oluştu" : "Adres eklenirken hata oluştu" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setNewAddress({
      title: address.title,
      name: address.name,
      surname: address.surname,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      postCode: address.postCode,
    });
    setShowAddAddressForm(true);
  };

  const handleDeleteAddress = async (adressId: string) => {
    if (!window.confirm('Bu adresi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      setLoading(true);
      const deleteData: DeleteAddressRequest = { adressId };
      await deleteAddressAPI(deleteData);
      setMessage({ type: "success", text: "Adres başarıyla silindi" });
      await loadAddresses(); // Refresh addresses
    } catch (error) {
      console.error("Delete address failed:", error);
      setMessage({ type: "error", text: "Adres silinirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingAddress(null);
    setNewAddress({
      title: "",
      name: "",
      surname: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      postCode: "",
    });
    setShowAddAddressForm(false);
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setMessage({ type: "error", text: "Lütfen bir teslimat adresi seçin" });
      return;
    }

    if (cartItems.length === 0) {
      setMessage({ type: "error", text: "Sepetiniz boş" });
      return;
    }

    try {
      setLoading(true);
      await createOrderAPI(selectedAddressId);

      const orderData: OrderData = {
        orderId: `ORDER-` + Date.now(),
        total: getTotalPrice(),
        products: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize,
        })),
        customerInfo: {
          name: ``,
          surname: ``,
          email: ``,
          phone: ``,
          address: ``,
          city: ``,
          district: ``,
        },
        paymentInfo: {
          cardNumber: paymentInfo.cardNumber,
          expiryDate: paymentInfo.expiryDate,
          cvv: paymentInfo.cvv,
          cardholderName: paymentInfo.cardholderName,
        },
        createdAt: new Date(),
      };

      setOrderData(orderData);
      // Order başarılı, sepeti temizle
      clearCart();

      router.push("/thank-you");
      setMessage({
        type: "success",
        text: "Siparişiniz başarıyla oluşturuldu!",
      });
      if (isLoading) {
        return (
          <AuthGuard>
            <div className="container py-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700">
                Sepet yükleniyor...
              </h2>
            </div>
          </AuthGuard>
        );
      }
      // 2 saniye sonra hesap sayfasına yönlendir
     
    } catch (error) {
      console.error("Order creation failed:", error);
      setMessage({ type: "error", text: "Sipariş oluşturulurken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <AuthGuard>
        <div className="container py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Sepetiniz Boş</h1>
          <p className="text-gray-600 mb-6">
            Sipariş verebilmek için önce ürün eklemeniz gerekiyor.
          </p>
          <Link
            href="/products"
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800"
          >
            Alışverişe Devam Et
          </Link>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">Ödeme</h1>
        <hr />
        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{message.text}</span>
              <button
                onClick={() => setMessage(null)}
                className="ml-2 text-lg font-bold"
              >
                ×
              </button>
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
                          ? "border-gray-300 dark:bg-slate-800"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedAddressId(address.adressId)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <input
                            type="radio"
                            checked={selectedAddressId === address.adressId}
                            onChange={() =>
                              setSelectedAddressId(address.adressId)
                            }
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h3 className="font-medium">{address.title}</h3>
                            <p className="text-sm text-gray-600">
                              {address.name} {address.surname}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.phone}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.address}, {address.district},{" "}
                              {address.city} {address.postCode}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(address);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteAddress(address.adressId);
                            }}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-600 rounded hover:bg-red-50 transition-colors"
                            title="Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 mb-4">
                  Kayıtlı adresiniz bulunmuyor.
                </p>
              )}

              {/* Add New Address Button */}
              <button
                onClick={() => {
                  if (editingAddress) {
                    cancelEdit();
                  } else {
                    setShowAddAddressForm(!showAddAddressForm);
                  }
                }}
                className="mt-4 text-black border border-black px-4 py-2 rounded-lg hover:bg-black hover:text-white transition-colors"
              >
                {editingAddress 
                  ? "İptal Et" 
                  : (showAddAddressForm ? "İptal Et" : "Yeni Adres Ekle")
                }
              </button>

              {/* Add/Edit Address Form */}
              {(showAddAddressForm || editingAddress) && (
                <div className="mt-6 bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium mb-4">
                    {editingAddress ? "Adres Düzenle" : "Yeni Adres Ekle"}
                  </h3>
                  <form onSubmit={handleAddAddress} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Adres Başlığı"
                        value={newAddress.title}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            title: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Ad"
                        value={newAddress.name}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, name: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Soyad"
                        value={newAddress.surname}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            surname: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="email"
                        placeholder="E-posta"
                        value={newAddress.email}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            email: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="tel"
                        placeholder="Telefon"
                        value={newAddress.phone}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            phone: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Posta Kodu"
                        value={newAddress.postCode}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            postCode: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="İl"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                      <input
                        type="text"
                        placeholder="İlçe"
                        value={newAddress.district}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            district: e.target.value,
                          })
                        }
                        className="w-full border rounded-lg px-3 py-2"
                        required
                      />
                    </div>
                    <textarea
                      placeholder="Adres Detayı"
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          address: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2 h-20"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading 
                          ? (editingAddress ? "Güncelleniyor..." : "Ekleniyor...") 
                          : (editingAddress ? "Adresi Güncelle" : "Adresi Ekle")
                        }
                      </button>
                      {editingAddress && (
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                        >
                          İptal
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          
        </div>
        {/* Payment Section */}
        <hr className="my-8" />
        <div className="max-w-2xl dark:bg-slate-900">
          <h2 className="text-xl  font-semibold mb-4">Ödeme Bilgileri</h2>

          <div className="bg-gray dark:bg-slate-800 rounded-lg p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Kart Üzerindeki İsim
                </label>
                <input
                  type="text"
                  placeholder="Ad Soyad"
                  value={paymentInfo.cardholderName}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardholderName: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Kart Numarası
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) =>
                    setPaymentInfo({
                      ...paymentInfo,
                      cardNumber: formatCardNumber(e.target.value),
                    })
                  }
                  className="w-full border rounded-lg px-3 py-2"
                  maxLength={19}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Son Kullanma
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        expiryDate: formatExpiryDate(e.target.value),
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    maxLength={5}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) =>
                      setPaymentInfo({ 
                        ...paymentInfo, 
                        cvv: e.target.value.replace(/[^0-9]/g, '').slice(0, 3)
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    maxLength={3}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Right Column - Order Summary */}
          <div>
            <div className=" dark:bg-slate-800 rounded-lg p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-600">
                        {item.selectedColor} - {item.selectedSize} - Adet:{" "}
                        {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatTL(item.price * item.quantity)}
                    </p>
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
                  <span>
                    {shipping === 0 ? "Ücretsiz" : formatTL(shipping)}
                  </span>
                </div>
                {subtotal > 500 && (
                  <p className="text-xs text-green-600">
                    🎉 500 TL üzeri ücretsiz kargo!
                  </p>
                )}
                <div className="border-t pt-2 flex justify-between font-semibold text-lg">
                  <span>Toplam:</span>
                  <span>{formatTL(total)}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading || !selectedAddressId}
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? "Sipariş Veriliyor..." : "Siparişi Tamamla"}
          </button>

          <p className="text-xs text-gray-500 mt-3 text-center">
            * Siparişiniz sepetinizdeki ürünlerle oluşturulacaktır
          </p>
        </div>
      </div>
    </AuthGuard>
  );
};

export default CheckoutPage;
