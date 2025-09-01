import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  getBasketItemsAPI,
  addItemToBasketAPI,
  updateQuantityAPI,
  deleteBasketItemAPI,
} from "@/features/basket";
import { BasketItem } from "@/Types";

// Helper function to get user-specific localStorage key
const getUserSpecificKey = (baseKey: string): string => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Token'dan user ID'yi çıkar (JWT decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id || "anonymous";
        const key = `${baseKey}-${userId}`;
        console.log("Oluşturulan key:", key);
        return `${baseKey}-${payload.sub || payload.id || "anonymous"}`;
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
  addToCart: (
    item: Omit<CartItem, "quantity"> & { quantity?: number }
  ) => Promise<void>;
  removeFromCart: (id: string, color: string, size: string) => Promise<void>;
  updateQuantity: (
    id: string,
    color: string,
    size: string,
    quantity: number
  ) => Promise<void>;
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
        return typeof window !== "undefined"
          ? !!localStorage.getItem("token")
          : false;
      },

      addToCart: async (newItem) => {
        console.log("yeni ürün:", newItem);
        console.log("mevcut cart items:", get().items);
        try {
          // Eğer kullanıcı authenticated ise backend'e de ekle
          if (get().isAuthenticated()) {
            // Önce aynı ürün var mı kontrol et
            const existingItem = get().items.findIndex(
              (item) =>
                item.id === newItem.id &&
                item.selectedColor === newItem.selectedColor &&
                item.selectedSize === newItem.selectedSize
            );
            console.log("var olan ürün:", existingItem);
            console.log("arama kriterleri:", {
              id: newItem.id,
              color: newItem.selectedColor,
              size: newItem.selectedSize,
            });

            if (existingItem !== -1) {
              console.log("var olan ürün var");
              // Sadece yeni item ekle, eski item'ı silme
              await addItemToBasketAPI(newItem.id, newItem.quantity || 1);
              console.log("Aynı ürün için yeni item eklendi");
            } else {
              console.log("var olan ürün yok");
              await addItemToBasketAPI(newItem.id, newItem.quantity || 1);
            }
          }
        } catch (error) {
          console.error("Add to cart API failed:", error);
          // Backend hatası olsa bile local storage'a ekle
        }

        // Local state'i güncelle (authenticated olsun olmasın)
        set((state) => {
          // Aynı ürün, renk ve beden kombinasyonu var mı kontrol et
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === newItem.id &&
              item.selectedColor === newItem.selectedColor &&
              item.selectedSize === newItem.selectedSize
          );

          if (existingItemIndex !== -1) {
            // Aynı ürün varsa yeni item ekle (miktarı artırma)

            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity || 1;
            return { items: updatedItems };
          } else {
            // Yeni ürün ekle
            return {
              items: [
                ...state.items,
                { ...newItem, quantity: newItem.quantity || 1 },
              ],
            };
          }
        });
      },

      removeFromCart: async (id, color, size) => {
        try {
          // Eğer kullanıcı authenticated ise backend'ten de sil
          if (get().isAuthenticated()) {
            await deleteBasketItemAPI(id);
          }
        } catch (error) {
          console.error("Remove from cart API failed:", error);
          // Backend hatası olsa bile local'den sil
        }

        // Local state'ten sil
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.selectedColor === color &&
                item.selectedSize === size
              )
          ),
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
            await updateQuantityAPI(id, quantity);
          }
        } catch (error) {
          console.error("Update cart quantity API failed:", error);
          // Backend hatası olsa bile local'i güncelle
        }

        // Local state'i güncelle
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id &&
            item.selectedColor === color &&
            item.selectedSize === size
              ? { ...item, quantity }
              : item
          ),
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
        console.log("loadUserCart çağrıldı");
        console.log("isAuthenticated:", get().isAuthenticated());

        if (!get().isAuthenticated()) {
          console.log(
            "Kullanıcı authenticated değil, loadUserCart iptal edildi"
          );
          return;
        }

        try {
          console.log("API çağrısı yapılıyor...");
          const basketResponse = await getBasketItemsAPI();
          console.log("backendden gelen veriler:", basketResponse);
          console.log("backendden gelen veriler:", basketResponse);
          console.log("Backend'den gelen item sayısı:", basketResponse.length);
          // Backend'den gelen verileri grupla (aynı ürünleri birleştir)
          const groupedItems = basketResponse.reduce(
            (acc: CartItem[], item: BasketItem) => {
              const existingItem = acc.find(
                (existing: CartItem) => existing.name === item.name
              );

              if (existingItem) {
                console.log(
                  `Aynı ürün bulundu: ${item.name}, eski quantity: ${
                    existingItem.quantity
                  }, yeni quantity: ${existingItem.quantity + item.quantity}`
                );
                // Aynı ürün varsa quantity'yi artır
                existingItem.quantity += item.quantity;
              } else {
                // Yeni ürün ekle
                console.log(`Yeni ürün eklendi: ${item.name}, quantity: ${item.quantity}`);
                acc.push({
                  id: item.basketItemId,
                  name: item.name || "Ürün Adı Bulunamadı",
                  price: item.price || 0,
                  image: item.imageUrl || "/images/placeholder-product.png",
                  selectedColor: "Varsayılan",
                  selectedSize: "Varsayılan",
                  quantity: item.quantity || 1,
                });
              }

              return acc;
            },
            []
          );
          console.log("Gruplandırılmış items:", groupedItems);
          console.log("Gruplandırılmış item sayısı:", groupedItems.length);
          set({ items: groupedItems });
        } catch (error) {
          console.error("Load user cart failed:", error);
        }
      },

      getTotalItems: () => {
        return get().items.length;
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getItemCount: (id, color, size) => {
        const item = get().items.find(
          (item) =>
            item.id === id &&
            item.selectedColor === color &&
            item.selectedSize === size
        );
        return item ? item.quantity : 0;
      },

      isItemInCart: (id, color, size) => {
        return get().items.some(
          (item) =>
            item.id === id &&
            item.selectedColor === color &&
            item.selectedSize === size
        );
      },
    }),
    {
      name: getUserSpecificKey("shopease-cart"),
      storage: createJSONStorage(() => localStorage),
    }
  )
);
