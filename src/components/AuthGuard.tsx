// src/components/AuthGuard.tsx
"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";
import { getCurrentUserAPI } from "@/features/user";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window === "undefined") return;

      if (!accessToken) {
        // Token yok, login'e yönlendir
        router.replace("/login");
        return;
      }

      // Token var ama user bilgisi yoksa API'den al
      if (accessToken && !user) {
        try {
          const currentUser = await getCurrentUserAPI();
          updateUser({
            id: currentUser.userId,
            email: currentUser.email,
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            roles: currentUser.roles
          });
        } catch (error) {
          console.error("Failed to get current user:", error);
          // API hatası durumunda login'e yönlendir
          router.replace("/login");
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [router, user, accessToken, updateUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}