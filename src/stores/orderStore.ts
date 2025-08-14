import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CustomerInfo, PaymentInfo, Product } from "@/Types";

interface OrderData {
  orderId: string;
  total: number;
  products: Product[];
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
  createdAt: Date;
}

interface OrderStore {
  orderData: OrderData | null;
  orderHistory: OrderData[]; // ✅ Yeni: Sipariş geçmişi
  setOrderData: (data: OrderData) => void;
  addToOrderHistory: (data: OrderData) => void; // ✅ Yeni: Geçmişe ekle
  clearOrderData: () => void;
  getOrderHistory: () => OrderData[]; // ✅ Yeni: Geçmişi getir
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({ // set: state'i güncelle, get: mevcut state'i oku
      orderData: null, // Mevcut sipariş verisi (tek sipariş)
      orderHistory: [], // Tüm siparişlerin geçmişi (array)
      
      setOrderData: (data) => set({ orderData: data }), // Mevcut siparişi güncelle
      clearOrderData: () => set({ orderData: null }), // Mevcut siparişi temizle
      
      addToOrderHistory: (data) => { //  Yeni siparişi geçmişe ekle
        const currentHistory = get().orderHistory; //  Mevcut geçmişi oku
        set({ orderHistory: [...currentHistory, data] }); //  Yeni siparişi ekle
      },

      getOrderHistory: () => get().orderHistory, //  Tüm sipariş geçmişini getir
    }),
    { name: `order-storage` } // 💾localStorage'da saklanacak key
  )
);
