import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getUserFavoritesAPI, 
  addToFavoritesAPI, 
  removeFromFavoritesAPI 
} from "@/features/user";

// Helper function to get user-specific localStorage key
const getUserSpecificKey = (baseKey: string): string => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Token'dan user ID'yi çıkar (JWT decode)
        const payload = JSON.parse(atob(token.split('.')[1]));
        return `${baseKey}-${payload.sub || payload.id || 'anonymous'}`;
      } catch {
        return `${baseKey}-anonymous`;
      }
    }
  }
  return `${baseKey}-anonymous`;
};

export interface LikeItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
}

interface LikeState {
  items: LikeItem[];
  // Actions
  addToLikes: (item: LikeItem, onAuthRequired?: () => void) => Promise<void>;
  removeFromLikes: (id: string, color: string, size: string) => Promise<void>;
  clearLikes: () => void;
  clearUserData: () => void; // Logout için özel temizlik
  loadUserFavorites: () => Promise<void>; // Backend'ten kullanıcı favorilerini yükle
  // Computed values
  getTotalItems: () => number;
  isItemLiked: (id: string, color: string, size: string) => boolean;
  // Auth check
  requireAuth: (onAuthRequired?: () => void) => boolean;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Authentication check helper
      requireAuth: (onAuthRequired?: () => void) => {
        // Check if user is authenticated
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        
        if (!token) {
          onAuthRequired?.();
          return false;
        }
        return true;
      },
      
      addToLikes: async (newItem, onAuthRequired) => {
        // Authentication kontrolü
        if (!get().requireAuth(onAuthRequired)) {
          return; // Authentication gerekli, işlem yapma
        }
        
        try {
          // Backend'e ekle
          await addToFavoritesAPI(newItem.id, newItem.selectedColor, newItem.selectedSize);
          
          // Local state'i güncelle
          set((state) => {
            // Aynı ürün, renk ve beden kombinasyonu var mı kontrol et
            const existingItem = state.items.find(
              item => 
                item.id === newItem.id && 
                item.selectedColor === newItem.selectedColor && 
                item.selectedSize === newItem.selectedSize
            );

            if (!existingItem) {
              // Yeni ürün ekle
              return { 
                items: [...state.items, newItem] 
              };
            }
            return state; // Zaten varsa değişiklik yapma
          });
        } catch (error) {
          console.error('Add to favorites failed:', error);
          // Backend hatası durumunda sadece local state'e ekle
          set((state) => {
            const existingItem = state.items.find(
              item => 
                item.id === newItem.id && 
                item.selectedColor === newItem.selectedColor && 
                item.selectedSize === newItem.selectedSize
            );

            if (!existingItem) {
              return { 
                items: [...state.items, newItem] 
              };
            }
            return state;
          });
        }
      },

      removeFromLikes: async (id, color, size) => {
        try {
          // Backend'ten sil
          await removeFromFavoritesAPI(id, color, size);
        } catch (error) {
          console.error('Remove from favorites failed:', error);
          // Backend hatası olsa bile local state'ten sil
        }
        
        // Local state'ten sil
        set((state) => ({
          items: state.items.filter(item => 
            !(item.id === id && item.selectedColor === color && item.selectedSize === size)
          )
        }));
      },

      clearLikes: () => {
        set({ items: [] });
      },

      clearUserData: () => {
        // Logout durumunda sadece local state'i sıfırla
        // localStorage verileri korunur çünkü bunlar kullanıcıya özel değil
        // Kullanıcı tekrar login yapınca backend verileriyle birleştirilecek
        set({ items: [] });
      },

      loadUserFavorites: async () => {
        // Authentication kontrolü
        if (!get().requireAuth()) {
          return;
        }
        
        try {
          const favorites = await getUserFavoritesAPI();
          // Backend'ten gelen veriyi local state'e yükle
          set({ items: favorites || [] });
        } catch (error) {
          console.error('Load user favorites failed:', error);
        }
      },

      getTotalItems: () => {
        // Authentication check - eğer login değilse 0 döndür
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) {
          return 0;
        }
        return get().items.length;
      },

      isItemLiked: (id, color, size) => {
        return get().items.some(item => 
          item.id === id && item.selectedColor === color && item.selectedSize === size
        );
      },
    }),
    {
      name: getUserSpecificKey('easeshop-likes'),
      storage: createJSONStorage(() => localStorage),
    }
  )
);

