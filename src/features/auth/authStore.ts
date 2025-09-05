"use client";
import { create } from "zustand";
import { tokenManager } from "@/lib/tokenManager";

type User = {
  id: string;
  email: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[];
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (user: User | null, accessToken: string | null, refreshToken?: string | null) => void;
  clearSession: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setSession: (user: User | null, accessToken: string | null, refreshToken?: string | null) => {
    if (accessToken) {
      // Use tokenManager to properly store tokens
      tokenManager.setTokens({
        accessToken,
        refreshToken: refreshToken || null,
        expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours default
        tokenType: 'Bearer'
      });
      
      // Also keep the old localStorage for backward compatibility
      localStorage.setItem('token', accessToken);
    }
    set({ user, accessToken, refreshToken: refreshToken || null });
  },
  clearSession: () => {
    tokenManager.clearTokens();
    localStorage.removeItem('token');
    
    // Store state'lerini temizle ama localStorage verilerini korur
    // Bu sayede başka kullanıcı login yapınca temiz başlar
    if (typeof window !== 'undefined') {
      // Store state'lerini sıfırla
      import('@/stores/cartStore').then((cartModule) => {
        cartModule.useCartStore.getState().clearUserData();
      });
      
      import('@/stores/likeStore').then((likeModule) => {
        likeModule.useLikeStore.getState().clearUserData();
      });
    }
    
    set({ user: null, accessToken: null, refreshToken: null });
  },
  isAuthed: () => !!(get().user || tokenManager.getAccessToken()),
}));

// İlk yüklemede localStorage'taki token'ı kontrol et
if (typeof window !== "undefined") {
  const token = localStorage.getItem('token');
  if (token) {
    useAuthStore.setState({ accessToken: token });
  }
}