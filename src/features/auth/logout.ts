"use client";
import { useAuthStore } from "./authStore";
import { useRouter } from "next/navigation";

export function useLogout() {
  const clear = useAuthStore((s) => s.clearSession);
  const router = useRouter();

  return () => {
    clear();
    router.push("/login");
  };
}