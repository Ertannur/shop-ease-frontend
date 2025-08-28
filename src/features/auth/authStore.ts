"use client";
import { create } from "zustand";
import { tokenStorage } from "@/lib";

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
  setSession: (user: User | null, token: string | null) => void;
  clearSession: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setSession: (user: User | null, token: string | null) => {
    if (token) {
      tokenStorage.setAccess(token);
      localStorage.setItem('token', token);
    }
    set({ user, accessToken: token, refreshToken: null });
  },
  clearSession: () => {
    tokenStorage.clearAccess();
    tokenStorage.clearRefresh();
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
  isAuthed: () => !!(get().user || tokenStorage.getAccess()),
}));

// İlk yüklemede localStorage'taki token'ı kontrol et
if (typeof window !== "undefined") {
  const token = localStorage.getItem('token');
  if (token) {
    useAuthStore.setState({ accessToken: token });
  }
}