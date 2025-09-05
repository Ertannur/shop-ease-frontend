"use client";
import { useState, useEffect, useCallback } from "react";
import { AuthGuard } from "@/components";
import { useAuthStore, useLogout } from "@/features/auth";
import { updateUserAPI, changePasswordAPI, getUserByIdAPI } from "@/features/user";
import { getUserAddressAPI, addAddressAPI, updateAddressAPI, deleteAddressAPI } from "@/features/address";
import { listCurrentUserOrdersAPI } from "@/features/order";
import {
  UpdateUserRequest,
  ChangePasswordRequest,
  Address,
  UserOrder,
  AddAddressRequest,
  UpdateAddressRequest,
  DeleteAddressRequest,
} from "@/Types";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<
    "profile" | "orders" | "addresses" | "password"
  >("profile");
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: 0 as 0 | 1,
    password: "", // Backend UpdateUser API'si için gerekli
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
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

  // Editing address state
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const displayName =
    user?.firstName || user?.name || user?.email || "Kullanıcı";

  // Kullanıcı profil bilgilerini yükle
  const loadUserProfile = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const userProfile = await getUserByIdAPI(user.id);
      setProfileForm({
        firstName: userProfile.firstName || "",
        lastName: userProfile.lastName || "",
        email: userProfile.email || "",
        phoneNumber: userProfile.phoneNumber || "",
        dateOfBirth: userProfile.dateOfBirth || "",
        gender: userProfile.gender || 0,
        password: "", // Boş bırakıyoruz, kullanıcı güncellerken girecek
      });
    } catch (error) {
      console.error("Failed to load user profile:", error);
      setMessage({ type: "error", text: "Profil bilgileri yüklenirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    if (activeTab === "orders") {
      console.log("Loading orders");
      loadOrders();
    } else if (activeTab === "addresses") {
      loadAddresses();
    } else if (activeTab === "profile") {
      loadUserProfile();
    }
  }, [activeTab, loadUserProfile]);

  // Kullanıcı profil bilgilerini yükle
  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id, loadUserProfile]);

  const loadOrders = async () => {
    console.log("loadOrders function called");
    try {
      setLoading(true);
      const userOrders = await listCurrentUserOrdersAPI();
      console.log("API Response:", userOrders);
      console.log("First order:", userOrders[0]);
      setOrders(userOrders);
    } catch (error) {
      console.error("Failed to load orders:", error);
      setMessage({ type: "error", text: "Siparişler yüklenirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const userAddresses = await getUserAddressAPI();
      setAddresses(userAddresses);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setMessage({ type: "error", text: "Adresler yüklenirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    // Şifre kontrolü
    if (!profileForm.password.trim()) {
      setMessage({ type: "error", text: "Profil güncellemesi için mevcut şifrenizi girmeniz gerekiyor" });
      return;
    }

    try {
      setLoading(true);
      const updateData: UpdateUserRequest = {
        id: user.id,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phoneNumber: profileForm.phoneNumber,
        dateOfBirth: profileForm.dateOfBirth,
        gender: profileForm.gender,
        password: profileForm.password, // Backend'in zorunlu kıldığı alan
      };

      await updateUserAPI(updateData);
      
      // Şifre alanını temizle
      setProfileForm(prev => ({ ...prev, password: "" }));
      setMessage({ type: "success", text: "Profil başarıyla güncellendi" });
    } catch (error) {
      console.error("Profile update failed:", error);
      setMessage({ type: "error", text: "Profil güncellenirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: "error", text: "Yeni şifreler eşleşmiyor" });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Yeni şifre en az 6 karakter olmalıdır",
      });
      return;
    }

    try {
      setLoading(true);
      const changeData: ChangePasswordRequest = {
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      };

      await changePasswordAPI(changeData);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setMessage({ type: "success", text: "Şifre başarıyla değiştirildi" });
    } catch (error) {
      console.error("Password change failed:", error);
      setMessage({ type: "error", text: "Şifre değiştirilirken hata oluştu" });
    } finally {
      setLoading(false);
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
          title: addressForm.title,
          name: addressForm.name,
          surname: addressForm.surname,
          email: addressForm.email,
          phone: addressForm.phone,
          address: addressForm.address,
          city: addressForm.city,
          district: addressForm.district,
          postCode: addressForm.postCode,
        };

        await updateAddressAPI(updateData);
        setMessage({ type: "success", text: "Adres başarıyla güncellendi" });
        setEditingAddress(null);
      } else {
        // Add new address
        const addData: AddAddressRequest = {
          title: addressForm.title,
          name: addressForm.name,
          surname: addressForm.surname,
          email: addressForm.email,
          phone: addressForm.phone,
          address: addressForm.address,
          city: addressForm.city,
          district: addressForm.district,
          postCode: addressForm.postCode,
        };

        await addAddressAPI(addData);
        setMessage({ type: "success", text: "Adres başarıyla eklendi" });
      }

      setAddressForm({
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
      loadAddresses(); // Refresh addresses
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
    setAddressForm({
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
      loadAddresses(); // Refresh addresses
    } catch (error) {
      console.error("Delete address failed:", error);
      setMessage({ type: "error", text: "Adres silinirken hata oluştu" });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingAddress(null);
    setAddressForm({
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
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("tr-TR");
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
    });
  };

  const clearMessage = () => setMessage(null);

  return (
    <AuthGuard>
      <div className="container py-12 max-w-6xl  dark:bg-slate-900 min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hesabım</h1>
          <p className="text-gray-600 dark:text-slate-700 mt-1">
            Hoş geldin, <strong>{displayName}</strong> 👋
          </p>
        </div>

        {/* Message Display */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{message.text}</span>
              <button onClick={clearMessage} className="ml-2 text-lg font-bold">
                ×
              </button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: "profile", label: "Profil Bilgileri" },
              { id: "orders", label: "Siparişlerim" },
              { id: "addresses", label: "Adreslerim" },
              { id: "password", label: "Şifre Değiştir" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === "orders") {
                    console.log("Orders tab clicked");
                  }
                  setActiveTab(
                    tab.id as "profile" | "orders" | "addresses" | "password"
                  );
                }}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-black dark:border-white dark:text-white font-semibold"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="dark:bg-slate-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Profil Bilgileri</h2>
              <form
                onSubmit={handleProfileUpdate}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Ad
                    </label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          firstName: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Soyad
                    </label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          lastName: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, email: e.target.value })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        phoneNumber: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                    placeholder="05xxxxxxxxx"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doğum Tarihi
                    </label>
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cinsiyet
                    </label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          gender: parseInt(e.target.value) as 0 | 1,
                        })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                    >
                      <option value={0}>Erkek</option>
                      <option value={1}>Kadın</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mevcut Şifre (Güncelleme için gerekli)
                  </label>
                  <input
                    type="password"
                    value={profileForm.password}
                    onChange={(e) =>
                      setProfileForm({
                        ...profileForm,
                        password: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700  dark:text-white"
                    placeholder="Mevcut şifrenizi girin"
                    required
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Profil bilgilerini güncellemek için mevcut şifrenizi girmeniz gerekmektedir.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Güncelleniyor..." : "Profili Güncelle"}
                </button>
              </form>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 dark:text-white">Siparişlerim</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-slate-700">Siparişler yükleniyor...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-slate-700">Henüz siparişiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order, index) => (
                    <div
                      key={`${order.orderId}-${index}`}
                      className="border rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">
                            Sipariş #{order.orderId}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-slate-700">
                            {formatDate(order.orderDate)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-slate-700">
                            Teslimat: {order.address}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {order.products && order.products.length > 0
                              ? formatPrice(
                                  order.products.reduce(
                                    (total, p) => total + p.totalPrice,
                                    0
                                  )
                                )
                              : "Fiyat bilgisi yok"}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Ürünler:</h4>
                        <div className="space-y-2">
                          {order.products && order.products.length > 0 ? (
                            <div className="space-y-2">
                              {order.products.map((product) => (
                                <div
                                  key={product.productId}
                                  className="flex justify-between items-center text-sm"
                                >
                                  <span>
                                    {product.productName} x {product.quantity}
                                  </span>
                                  <span>{formatPrice(product.totalPrice)}</span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-slate-700">
                              Bu siparişte ürün bilgisi bulunmuyor
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "addresses" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 dark:text-white">Adreslerim</h2>

              {/* Add/Edit Address Form */}
              <div className=" dark:bg-slate-800 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-4">
                  {editingAddress ? "Adres Düzenle" : "Yeni Adres Ekle"}
                </h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Adres Başlığı (Ev, İş vb.)"
                      value={addressForm.title}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          title: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Ad"
                      value={addressForm.name}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, name: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Soyad"
                      value={addressForm.surname}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          surname: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="email"
                      placeholder="E-posta"
                      value={addressForm.email}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          email: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Telefon"
                      value={addressForm.phone}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          phone: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Posta Kodu"
                      value={addressForm.postCode}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          postCode: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="İl"
                      value={addressForm.city}
                      onChange={(e) =>
                        setAddressForm({ ...addressForm, city: e.target.value })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="İlçe"
                      value={addressForm.district}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          district: e.target.value,
                        })
                      }
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Adres Detayı"
                    value={addressForm.address}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
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
                        : (editingAddress ? "Adresi Güncelle" : "Adres Ekle")
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

              {/* Address List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                  <p className="mt-2 text-gray-600 dark:text-slate-700">Adresler yükleniyor...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-slate-700">Henüz adresiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.adressId}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{address.title}</h3>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditAddress(address)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.adressId)}
                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 border border-red-600 rounded hover:bg-red-50 transition-colors"
                            title="Sil"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 dark:text-slate-700 space-y-1">
                        <p>
                          <strong>
                            {address.name} {address.surname}
                          </strong>
                        </p>
                        <p>{address.phone}</p>
                        <p>{address.email}</p>
                        <p>{address.address}</p>
                        <p>
                          {address.district}, {address.city} {address.postCode}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "password" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-white dark:text-white">Şifre Değiştir</h2>
              <form
                onSubmit={handlePasswordChange}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mevcut Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifre
                  </label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Yeni Şifre (Tekrar)
                  </label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white dark:text-white px-6 py-2 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50"
                >
                  {loading ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="mt-8 pt-8 border-t">
          <button
            onClick={logout}
            className="bg-red-500 text-white dark:text-black px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
