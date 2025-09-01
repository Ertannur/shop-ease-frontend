import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net";

// Axios instance oluştur
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
// Request interceptor - her istekte token ekle
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(`auth-token`);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request config:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

export const basketApi = {
  // 1. Fonksiyon: Sepetten ürünleri çek

  async getBasketItems(token: string) {
    try {
      // Token kontrolü

      if (!token) {
        throw new Error(`Giriş yapmanız gerekiyor.`);
      }
      // Axios ile GET isteği
      const response = await api.get(`/api/Basket/GetBasketItems`);
      // Başarılı ise veriyi döndür
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // 401 hatası kontrolü
        if (error.response?.status === 401) {
          throw new Error("Giriş yapmanız gerekiyor.");
        }
        throw new Error("Sepet verileri alınamadı.");
      }
      throw error;
    }
  },

  // 2. Fonksiyon: Sepete ürün ekle
  async addItemToBasket(productId: string, quantity: number) {
    try {
      console.log("API çağrısı yapılıyor:", {
        url: `/api/Basket/AddItemToBasket`,
        data: { productId, quantity },
      });

      const response = await api.post(`/api/Basket/AddItemToBasket`, {
        productId: productId,
        quantity: quantity,
      });

      console.log("API response:", response.data);
      return response.data;
    } catch (error) {
      console.error("API error details:", error);

      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
        console.error("Response headers:", error.response?.headers);

        if (error.response?.status === 401) {
          throw new Error("Giriş yapmanız gerekiyor.");
        } else if (error.response?.status === 500) {
          throw new Error("Sunucu hatası oluştu. Lütfen tekrar deneyin.");
        }
        throw new Error(
          `Ürün sepete eklenemedi. Hata: ${error.response?.status}`
        );
      }
      throw error;
    }
  },
};
