import { api } from "@/lib";
import { OrderRequest, OrderResponse } from "@/Types/Order";



export const orderApi = {
    async createOrder(orderData: OrderRequest): Promise<OrderResponse> {
        try {
            console.log("Sipariş oluşturuluyor:", orderData);
            
            const response = await api.post("/api/Order/CreateOrder", orderData);
            
            console.log("Sipariş başarılı:", response.data);
            return response.data;
            
        } catch (error: any) {
            console.error("Sipariş hatası:", error);
            
            if (error.response?.status === 401) {
                throw new Error("Giriş Yapmanız Gerekiyor");
            } else if (error.response?.status === 400) {
                throw new Error("Geçersiz Sipariş");
            } else if (error.response?.status === 500) {
                throw new Error("Sunucu Hatası. Lütfen Tekrar Deneyin.");
            }

            throw new Error("Siparişiniz Oluşturulamadı.");
        }
    }
};