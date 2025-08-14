import axios from "axios";
import { API_BASE } from "./constants";

export const api = axios.create({
  baseURL: API_BASE || 'https://eticaretapi-gghdgef9bzameteu.switzerlandnorth-01.azurewebsites.net/api',
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
});

// Request interceptor - token'ı otomatik ekle
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 durumunda logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz, kullanıcıyı logout yap
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Backward compatibility için eski storage interface'i
export const tokenStorage = {
  getAccess: () => (typeof window !== "undefined" ? localStorage.getItem('token') : null),
  setAccess: (t: string) => { if (typeof window !== "undefined") localStorage.setItem('token', t); },
  clearAccess: () => { if (typeof window !== "undefined") localStorage.removeItem('token'); },
  getRefresh: () => null,
  setRefresh: () => {},
  clearRefresh: () => {},
};