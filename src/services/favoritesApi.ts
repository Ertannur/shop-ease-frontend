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
  return config;
});



export const favoritesApi = {
    // Favorileri getir
    async getFavorites(token: string) {
      try {
        if (!token) {
          throw new Error("Giriş yapmanız gerekiyor.");
        }
        const response = await api.get(`/api/Product/GetFavoriteProducts`);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Giriş yapmanız gerekiyor.");
          }
          throw new Error("Favoriler alınamadı.");
        }
        throw error;
      }
    },
  
    // Favori ekle - YENİ EKLENEN
    async addToFavorites(productId: string, userId: string) {
      try {
        const response = await api.post('/api/Product/AddToFavorites', {
          productId,
          userId
        });
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error('Giriş yapmanız gerekiyor');
          }
          throw new Error('Favori eklenemedi');
        }
        throw error;
      }
    },
  };