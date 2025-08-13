import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  addToLikes: (item: LikeItem) => void;
  removeFromLikes: (id: string, color: string, size: string) => void;
  clearLikes: () => void;
  // Computed values
  getTotalItems: () => number;
  isItemLiked: (id: string, color: string, size: string) => boolean;
}

export const useLikeStore = create<LikeState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToLikes: (newItem) => {
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
      },

      removeFromLikes: (id, color, size) => {
        set((state) => ({
          items: state.items.filter(item => 
            !(item.id === id && item.selectedColor === color && item.selectedSize === size)
          )
        }));
      },

      clearLikes: () => {
        set({ items: [] });
      },

      getTotalItems: () => {
        return get().items.length;
      },

      isItemLiked: (id, color, size) => {
        return get().items.some(item => 
          item.id === id && item.selectedColor === color && item.selectedSize === size
        );
      },
    }),
    {
      name: 'easeshop-likes', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

