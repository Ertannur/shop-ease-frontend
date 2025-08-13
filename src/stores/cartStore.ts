import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getUserCartAPI, 
  addToCartAPI, 
  removeFromCartAPI, 
  updateCartQuantityAPI 
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

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // Actions
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => Promise<void>;
  removeFromCart: (id: string, color: string, size: string) => Promise<void>;
  updateQuantity: (id: string, color: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  clearUserData: () => void; // Logout için özel temizlik
  loadUserCart: () => Promise<void>; // Backend'ten kullanıcı sepetini yükle
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (id: string, color: string, size: string) => number;
  isItemInCart: (id: string, color: string, size: string) => boolean;
  // Auth check
  isAuthenticated: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Authentication check helper
      isAuthenticated: () => {
        return typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
      },

      addToCart: async (newItem) => {
        try {
          // Eğer kullanıcı authenticated ise backend'e de ekle
          if (get().isAuthenticated()) {
            await addToCartAPI(
              newItem.id, 
              newItem.selectedColor, 
              newItem.selectedSize, 
              newItem.quantity || 1
            );
          }
        } catch (error) {
          console.error('Add to cart API failed:', error);
          // Backend hatası olsa bile local storage'a ekle
        }

        // Local state'i güncelle (authenticated olsun olmasın)
        set((state) => {
          // Aynı ürün, renk ve beden kombinasyonu var mı kontrol et
          const existingItemIndex = state.items.findIndex(
            item =>
              item.id === newItem.id &&
              item.selectedColor === newItem.selectedColor &&
              item.selectedSize === newItem.selectedSize
          );

          if (existingItemIndex !== -1) {
            // Var olan ürünün miktarını artır
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            return { items: updatedItems };
          } else {
            // Yeni ürün ekle
            return {
              items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }]
            };
          }
        });
      },

      removeFromCart: async (id, color, size) => {
        try {
          // Eğer kullanıcı authenticated ise backend'ten de sil
          if (get().isAuthenticated()) {
            await removeFromCartAPI(id, color, size);
          }
        } catch (error) {
          console.error('Remove from cart API failed:', error);
          // Backend hatası olsa bile local'den sil
        }

        // Local state'ten sil
        set((state) => ({
          items: state.items.filter(item =>
            !(item.id === id && item.selectedColor === color && item.selectedSize === size)
          )
        }));
      },

      updateQuantity: async (id, color, size, quantity) => {
        if (quantity <= 0) {
          await get().removeFromCart(id, color, size);
          return;
        }

        try {
          // Eğer kullanıcı authenticated ise backend'i güncelle
          if (get().isAuthenticated()) {
            await updateCartQuantityAPI(id, color, size, quantity);
          }
        } catch (error) {
          console.error('Update cart quantity API failed:', error);
          // Backend hatası olsa bile local'i güncelle
        }

        // Local state'i güncelle
        set((state) => ({
          items: state.items.map(item =>
            item.id === id && item.selectedColor === color && item.selectedSize === size
              ? { ...item, quantity }
              : item
          )
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      clearUserData: () => {
        // Logout durumunda sadece local state'i sıfırla
        // localStorage persist edilecek ama farklı key ile
        set({ items: [] });
      },

      loadUserCart: async () => {
        // Authentication kontrolü
        if (!get().isAuthenticated()) {
          return;
        }
        
        try {
          const cartItems = await getUserCartAPI();
          // Backend'ten gelen veriyi local state'e yükle
          set({ items: cartItems || [] });
        } catch (error) {
          console.error('Load user cart failed:', error);
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },

      getItemCount: (id, color, size) => {
        const item = get().items.find(item =>
          item.id === id && item.selectedColor === color && item.selectedSize === size
        );
        return item ? item.quantity : 0;
      },

      isItemInCart: (id, color, size) => {
        return get().items.some(item =>
          item.id === id && item.selectedColor === color && item.selectedSize === size
        );
      },
    }),
    {
      name: getUserSpecificKey('easeshop-cart'),
      storage: createJSONStorage(() => localStorage),
    }
  )
);