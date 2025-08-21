"use client";
import { useState, useEffect } from "react";
import { AuthGuard } from "@/components";
import { useAuthStore, useLogout } from "@/features/auth";
import { 
  updateUserAPI, 
  changePasswordAPI 
} from "@/features/user";
import { 
  getUserAddressAPI,
  addAddressAPI 
} from "@/features/address";
import { 
  listCurrentUserOrdersAPI 
} from "@/features/order";
import { 
  UpdateUserRequest,
  ChangePasswordRequest,
  Address,
  UserOrder,
  AddAddressRequest 
} from "@/Types";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'password'>('profile');
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: '',
    dateOfBirth: '',
    gender: 0 as 0 | 1
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Address form state
  const [addressForm, setAddressForm] = useState({
    title: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postCode: ''
  });

  const displayName = user?.firstName || user?.name || user?.email || "Kullanıcı";

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    } else if (activeTab === 'addresses') {
      loadAddresses();
    }
  }, [activeTab]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await listCurrentUserOrdersAPI();
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setMessage({ type: 'error', text: 'Siparişler yüklenirken hata oluştu' });
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
      console.error('Failed to load addresses:', error);
      setMessage({ type: 'error', text: 'Adresler yüklenirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setLoading(true);
      const updateData: UpdateUserRequest = {
        id: user.id,
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        email: profileForm.email,
        phoneNumber: profileForm.phoneNumber,
        dateOfBirth: profileForm.dateOfBirth,
        gender: profileForm.gender
      };

      await updateUserAPI(updateData);
      setMessage({ type: 'success', text: 'Profil başarıyla güncellendi' });
    } catch (error) {
      console.error('Profile update failed:', error);
      setMessage({ type: 'error', text: 'Profil güncellenirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Yeni şifreler eşleşmiyor' });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalıdır' });
      return;
    }

    try {
      setLoading(true);
      const changeData: ChangePasswordRequest = {
        id: user.id,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      };

      await changePasswordAPI(changeData);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Şifre başarıyla değiştirildi' });
    } catch (error) {
      console.error('Password change failed:', error);
      setMessage({ type: 'error', text: 'Şifre değiştirilirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const addData: AddAddressRequest = {
        title: addressForm.title,
        name: addressForm.name,
        surname: addressForm.surname,
        email: addressForm.email,
        phone: addressForm.phone,
        address: addressForm.address,
        city: addressForm.city,
        district: addressForm.district,
        postCode: addressForm.postCode
      };

      await addAddressAPI(addData);
      setAddressForm({
        title: '', name: '', surname: '', email: '', phone: '',
        address: '', city: '', district: '', postCode: ''
      });
      setMessage({ type: 'success', text: 'Adres başarıyla eklendi' });
      loadAddresses(); // Refresh addresses
    } catch (error) {
      console.error('Add address failed:', error);
      setMessage({ type: 'error', text: 'Adres eklenirken hata oluştu' });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR', { 
      style: 'currency', 
      currency: 'TRY' 
    });
  };

  const clearMessage = () => setMessage(null);

  return (
    <AuthGuard>
      <div className="container py-12 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Hesabım</h1>
          <p className="text-gray-600 mt-1">Hoş geldin, <strong>{displayName}</strong> 👋</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            <div className="flex justify-between items-center">
              <span>{message.text}</span>
              <button onClick={clearMessage} className="ml-2 text-lg font-bold">×</button>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'profile', label: 'Profil Bilgileri' },
              { id: 'orders', label: 'Siparişlerim' },
              { id: 'addresses', label: 'Adreslerim' },
              { id: 'password', label: 'Şifre Değiştir' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'profile' | 'orders' | 'addresses' | 'password')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Profil Bilgileri</h2>
              <form onSubmit={handleProfileUpdate} className="max-w-2xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ad</label>
                    <input
                      type="text"
                      value={profileForm.firstName}
                      onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Soyad</label>
                    <input
                      type="text"
                      value={profileForm.lastName}
                      onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                  <input
                    type="email"
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                  <input
                    type="tel"
                    value={profileForm.phoneNumber}
                    onChange={(e) => setProfileForm({...profileForm, phoneNumber: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="05xxxxxxxxx"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Doğum Tarihi</label>
                    <input
                      type="date"
                      value={profileForm.dateOfBirth}
                      onChange={(e) => setProfileForm({...profileForm, dateOfBirth: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cinsiyet</label>
                    <select
                      value={profileForm.gender}
                      onChange={(e) => setProfileForm({...profileForm, gender: parseInt(e.target.value) as 0 | 1})}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      <option value={0}>Erkek</option>
                      <option value={1}>Kadın</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Siparişlerim</h2>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                  <p className="mt-2 text-gray-600">Siparişler yükleniyor...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Henüz siparişiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.orderId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-medium">Sipariş #{order.orderId}</h3>
                          <p className="text-sm text-gray-600">{formatDate(order.orderDate)}</p>
                          <p className="text-sm text-gray-600">Teslimat: {order.address}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            {formatPrice(order.products.reduce((total, p) => total + p.totalPrice, 0))}
                          </p>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Ürünler:</h4>
                        <div className="space-y-2">
                          {order.products.map((product) => (
                            <div key={product.productId} className="flex justify-between items-center text-sm">
                              <span>{product.productName} x {product.quantity}</span>
                              <span>{formatPrice(product.totalPrice)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Adreslerim</h2>
              
              {/* Add Address Form */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-4">Yeni Adres Ekle</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Adres Başlığı (Ev, İş vb.)"
                      value={addressForm.title}
                      onChange={(e) => setAddressForm({...addressForm, title: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Ad"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Soyad"
                      value={addressForm.surname}
                      onChange={(e) => setAddressForm({...addressForm, surname: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="email"
                      placeholder="E-posta"
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({...addressForm, email: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Telefon"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Posta Kodu"
                      value={addressForm.postCode}
                      onChange={(e) => setAddressForm({...addressForm, postCode: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="İl"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                    <input
                      type="text"
                      placeholder="İlçe"
                      value={addressForm.district}
                      onChange={(e) => setAddressForm({...addressForm, district: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                      required
                    />
                  </div>
                  <textarea
                    placeholder="Adres Detayı"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2 h-20"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                  >
                    {loading ? 'Ekleniyor...' : 'Adres Ekle'}
                  </button>
                </form>
              </div>

              {/* Address List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
                  <p className="mt-2 text-gray-600">Adresler yükleniyor...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Henüz adresiniz bulunmuyor.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div key={address.adressId} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{address.title}</h3>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>{address.name} {address.surname}</strong></p>
                        <p>{address.phone}</p>
                        <p>{address.email}</p>
                        <p>{address.address}</p>
                        <p>{address.district}, {address.city} {address.postCode}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'password' && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Şifre Değiştir</h2>
              <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                  <input
                    type="password"
                    value={passwordForm.oldPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, oldPassword: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                    minLength={6}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Logout Section */}
        <div className="mt-8 pt-8 border-t">
          <button 
            onClick={logout} 
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Çıkış Yap
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}