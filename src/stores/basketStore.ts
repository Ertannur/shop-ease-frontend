import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  getBasketItemsAPI, 
  addItemToBasketAPI, 
  updateQuantityAPI, 
  deleteBasketItemAPI 
} from "@/features/basket";
import { BasketItem } from "@/Types";

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
  id: string; // productId
  basketItemId?: string; // Backend tarafından dönen basketItemId
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
  addToCart: (item: Omit<CartItem, 'quantity' | 'basketItemId'> & { quantity?: number }) => Promise<void>;
  removeFromCart: (id: string, color: string, size: string) => Promise<void>;
  updateQuantity: (id: string, color: string, size: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  clearUserData: () => void;
  loadUserCart: () => Promise<void>;
  syncWithBackend: () => Promise<void>; // Backend ile senkronizasyon
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (id: string, color: string, size: string) => number;
  isItemInCart: (id: string, color: string, size: string) => boolean;
  isAuthenticated: () => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      isAuthenticated: () => {
        return typeof window !== 'undefined' ? !!localStorage.getItem('token') : false;
      },

      addToCart: async (newItem) => {
        try {
          if (get().isAuthenticated()) {
            // Backend'e sadece productId ve quantity gönder
            await addItemToBasketAPI(newItem.id, newItem.quantity || 1);
            // Backend'den güncel sepet verilerini yükle
            await get().loadUserCart();
            return;
          }
        } catch (error) {
          console.error('Add to cart API failed:', error);
        }

        // Authentication yoksa veya API hatası varsa local storage kullan
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            item =>
              item.id === newItem.id &&
              item.selectedColor === newItem.selectedColor &&
              item.selectedSize === newItem.selectedSize
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            return { items: updatedItems };
          } else {
            return {
              items: [...state.items, { ...newItem, quantity: newItem.quantity || 1 }]
            };
          }
        });
      },

      removeFromCart: async (id, color, size) => {
        const currentItem = get().items.find(
          item => item.id === id && item.selectedColor === color && item.selectedSize === size
        );

        try {
          if (get().isAuthenticated() && currentItem?.basketItemId) {
            await deleteBasketItemAPI(currentItem.basketItemId);
            await get().loadUserCart();
            return;
          }
        } catch (error) {
          console.error('Remove from cart API failed:', error);
        }

        // Local storage'dan sil
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

        const currentItem = get().items.find(
          item => item.id === id && item.selectedColor === color && item.selectedSize === size
        );

        try {
          if (get().isAuthenticated() && currentItem?.basketItemId) {
            await updateQuantityAPI(currentItem.basketItemId, quantity);
            await get().loadUserCart();
            return;
          }
        } catch (error) {
          console.error('Update quantity API failed:', error);
        }

        // Local storage güncelle
        set((state) => {
          const updatedItems = state.items.map(item =>
            (item.id === id && item.selectedColor === color && item.selectedSize === size)
              ? { ...item, quantity }
              : item
          );
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      clearUserData: () => {
        set({ items: [] });
      },

      loadUserCart: async () => {
        if (!get().isAuthenticated()) {
          return;
        }

        try {
          const basketItems: BasketItem[] = await getBasketItemsAPI();
          
          // Backend verilerini CartItem formatına çevir
          const cartItems: CartItem[] = basketItems.map(item => ({
            id: '', // Backend'de productId yok, boş bırakıyoruz
            basketItemId: item.basketItemId,
            name: item.name,
            price: item.price,
            image: item.imageUrl || '/placeholder-product.jpg',
            selectedColor: 'Varsayılan', // Backend'de color/size bilgisi yok
            selectedSize: 'M',
            quantity: item.quantity
          }));

          set({ items: cartItems });
        } catch (error) {
          console.error('Load user cart failed:', error);
        }
      },

      syncWithBackend: async () => {
        if (get().isAuthenticated()) {
          await get().loadUserCart();
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
      name: getUserSpecificKey('shopease-cart'),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
