// src/hooks/useUserSession.ts
import { useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { getCurrentUserAPI } from '@/features/user';

export const useUserSession = () => {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const updateUser = useAuthStore((s) => s.updateUser);

  useEffect(() => {
    const loadUserInfo = async () => {
      // Token varsa ama user bilgisi yoksa API'den getir
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
          console.error("Failed to load user info:", error);
        }
      }
    };

    loadUserInfo();
  }, [accessToken, user, updateUser]);

  return { user, isAuthenticated: !!accessToken };
};
