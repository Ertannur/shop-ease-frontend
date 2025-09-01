import { api, PRODUCT_ENDPOINTS } from "@/lib";

export const getProductByIdAPI = async (productId: string) => {
  try {
    const response = await api.get(`${PRODUCT_ENDPOINTS.getProductById}?id=${productId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Get Product By Id API Error:", error);
    throw error;
  }
};
