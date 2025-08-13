"use client";
import { create } from "zustand";
import { tokenStorage } from "@/lib";

type User = {
  id: string;
  email: string;
  name?: string;
  roles?: string[];
};

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setSession: (u: User | null, access?: string | null, refresh?: string | null) => void;
  clearSession: () => void;
  isAuthed: () => boolean;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  setSession: (user, access, refresh) => {
    if (access) tokenStorage.setAccess(access);
    if (refresh) tokenStorage.setRefresh(refresh);
    set({ user, accessToken: access ?? get().accessToken, refreshToken: refresh ?? get().refreshToken });
  },
  clearSession: () => {
    tokenStorage.clearAccess();
    tokenStorage.clearRefresh();
    set({ user: null, accessToken: null, refreshToken: null });
  },
  isAuthed: () => !!(get().user || tokenStorage.getAccess()),
}));

// İlk yüklemede localStorage'taki token'ı içeri al
if (typeof window !== "undefined") {
  const access = tokenStorage.getAccess();
  const refresh = tokenStorage.getRefresh();
  if (access || refresh) {
    useAuthStore.setState({ accessToken: access, refreshToken: refresh });
  }
}