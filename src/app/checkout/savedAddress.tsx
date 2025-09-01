import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/features/auth";

const BASE_URL =
  "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net";

interface AddAddressCommandRequest {
  title: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postCode: string;
  userId: string;
}

interface SavedAddressProps {
  onAddressSelect?: (address: AddAddressCommandRequest) => void;
  selectedAddress?: AddAddressCommandRequest | null;
}

// Token'dan user ID'yi çıkar
const getUserIdFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub; // JWT'deki user ID
    } catch (error) {
      console.error('Token parse hatası:', error);
      return null;
    }
  }
  return null;
};

// Global adres kaydetme fonksiyonu
export const createAdress = async (
  addressData: Omit<AddAddressCommandRequest, "userId">
) => {
  const userId = getUserIdFromToken();
  if (!userId) {
    console.error("Kullanıcı ID bulunamadı");
    return;
  }
  
  try {
    const token = localStorage.getItem('token');
    const newAddress = {
      ...addressData,
      userId: userId,
    };
    
    console.log("API'ye gönderilecek veri:", newAddress);
    console.log("Token:", token ? "Mevcut" : "Bulunamadı");
    
    const response = await axios.post(
      `${BASE_URL}/api/Adress/AddAdress`,
      newAddress,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    if (response.data) {
      console.log("Yeni adres eklendi:", response.data);
      return response.data;
    }
  } catch (error: unknown) {
    console.error("Adres ekleme hatası:", error);
    
    // Axios hata detaylarını logla
    const axiosError = error as { response?: { data?: unknown; status?: number } };
    if (axiosError.response) {
      console.error("HTTP Status:", axiosError.response.status);
      console.error("Response Data:", axiosError.response.data);
      
      // Validation hatalarını detaylı göster
      const responseData = axiosError.response.data as Record<string, unknown>;
      if (responseData?.Errors) {
        console.error("Validation Errors:", responseData.Errors);
        console.error("Errors Keys:", Object.keys(responseData.Errors));
        console.error("Errors Values:", Object.values(responseData.Errors));
      }
    }
    
    throw error;
  }
};

const SavedAddress = ({ onAddressSelect, selectedAddress }: SavedAddressProps) => {
  const [savedAddresses, setSavedAddresses] = useState<
    AddAddressCommandRequest[]
  >([]);
  const [loading, setLoading] = useState(false);
  const user = useAuthStore((state) => state.user);

  const userId = user?.id || getUserIdFromToken();

  const getAddresses = async () => {
    if (!userId) {
      console.error("Kullanıcı ID bulunamadı");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${BASE_URL}/api/Adress/GetUserAdress?userId=${userId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      setSavedAddresses(response.data);
    } catch (error) {
      console.error("Yükleme Hatası", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelect = (address: AddAddressCommandRequest) => {
    if (onAddressSelect) {
      onAddressSelect(address);
    }
  };

  useEffect(() => {
    if (userId) {
      getAddresses();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="lg:col-span-1">
        <h2 className="text-lg font-medium mb-4">Kayıtlı Adresler</h2>
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <div className="mt-2 text-gray-600">Adresler Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="lg:col-span-1">
      <h2 className="text-lg font-medium mb-4">Kayıtlı Adresler</h2>
      <div className="space-y-4">
        {savedAddresses.length > 0 ? (
          savedAddresses.map((address, index) => (
            <div
              key={index}
              onClick={() => handleAddressSelect(address)}
              className={`bg-gray-50 p-6 rounded-lg cursor-pointer transition-colors ${
                selectedAddress === address
                  ? `ring-2 ring-black`
                  : `hover:bg-gray-100`
              }`}
            >
              <h3 className="text-lg font-medium mb-2">{address.title}</h3>
              <p className="text-gray-600 mb-2">
                {address.name} {address.surname}
              </p>
              <p className="text-gray-600 mb-2">{address.email}</p>
                             <p className="text-gray-600 mb-2">{address.phone}</p>
              <p className="text-gray-600 mb-2">{address.address}</p>
              <p className="text-gray-600 mb-2">
                {address.city} {address.district}
              </p>
              <p className="text-gray-600 mb-2">{address.postCode}</p>
              <button
                className={`mt-4 px-4 py-2 rounded-md transition-colors ${
                  selectedAddress === address
                    ? `bg-black text-white`
                    : `bg-gray-200 text-gray-600 hover:bg-gray-300`
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddressSelect(address);
                }}
              >
                {selectedAddress === address ? "Seçildi" : "Seç"}
              </button>
            </div>
          ))
        ) : (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <div className="text-gray-600">Kayıtlı adres bulunamadı</div>
            <div className="text-sm text-gray-500 mt-2">
              Sağ taraftaki formu doldurup &quot;Adresi Kaydet&quot; butonuna basarak adres ekleyebilirsiniz.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { SavedAddress, type AddAddressCommandRequest };
export default SavedAddress;
