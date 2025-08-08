import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string, color: string, size: string) => void;
  updateQuantity: (id: string, color: string, size: string, quantity: number) => void;
  clearCart: () => void;
  // Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemCount: (id: string, color: string, size: string) => number;
  isItemInCart: (id: string, color: string, size: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (newItem) => {
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

      removeFromCart: (id, color, size) => {
        set((state) => ({
          items: state.items.filter(item => 
            !(item.id === id && item.selectedColor === color && item.selectedSize === size)
          )
        }));
      },

      updateQuantity: (id, color, size, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(id, color, size);
          return;
        }

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
      name: 'easeshop-cart', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);