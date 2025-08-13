import axios from "axios";
import { API_BASE, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, AUTH_ENDPOINTS } from "./constants";

// Storage helper: token'ı ister localStorage'ta, ister cookie'de tutabil
const storage = {
  getAccess: () => (typeof window !== "undefined" ? localStorage.getItem(ACCESS_TOKEN_KEY) : null),
  setAccess: (t: string) => { if (typeof window !== "undefined") localStorage.setItem(ACCESS_TOKEN_KEY, t); },
  clearAccess: () => { if (typeof window !== "undefined") localStorage.removeItem(ACCESS_TOKEN_KEY); },

  getRefresh: () => (typeof window !== "undefined" ? localStorage.getItem(REFRESH_TOKEN_KEY) : null),
  setRefresh: (t: string) => { if (typeof window !== "undefined") localStorage.setItem(REFRESH_TOKEN_KEY, t); },
  clearRefresh: () => { if (typeof window !== "undefined") localStorage.removeItem(REFRESH_TOKEN_KEY); },
};

export const api = axios.create({
  baseURL: API_BASE,
  // withCredentials true olduğunda backend CORS ayarları origin+credentials gerektirir.
  // Backend bu anlarda izin vermiyorsa, geliştirme sırasında CORS kaynaklı "Network Error" yaşamamak için kapatıyoruz.
  withCredentials: false,
});

// Request: Bearer ekle
api.interceptors.request.use((config) => {
  const token = storage.getAccess();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: 401 -> refresh dene (varsa)
let isRefreshing = false;
let pendingQueue: Array<[(v: string | null)=>void, (e: unknown)=>void]> = [];

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(([resolve, reject]) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (!original || original._retry) throw error;

    // 401 ise refresh dene
    if (error.response?.status === 401) {
      if (isRefreshing) {
        // refresh bitene kadar beklet
        return new Promise((resolve, reject) => {
          pendingQueue.push([
            (token) => {
              if (token && original.headers) original.headers.Authorization = `Bearer ${token}`;
              resolve(api(original));
            },
            reject,
          ]);
        });
      }

      original._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = storage.getRefresh();
        if (!refreshToken) throw error;

        const resp = await axios.post(
          API_BASE + AUTH_ENDPOINTS.refresh,
          { refreshToken },
          { withCredentials: true }
        );

        const newAccess = resp.data?.accessToken;
        const newRefresh = resp.data?.refreshToken;

        if (newAccess) storage.setAccess(newAccess);
        if (newRefresh) storage.setRefresh(newRefresh);

        processQueue(null, newAccess);
        if (newAccess && original.headers) {
          original.headers.Authorization = `Bearer ${newAccess}`;
        }
        return api(original);
      } catch (err) {
        processQueue(err, null);
        storage.clearAccess();
        storage.clearRefresh();
        throw err;
      } finally {
        isRefreshing = false;
      }
    }

    throw error;
  }
);

export const tokenStorage = storage;