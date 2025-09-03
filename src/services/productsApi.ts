import { api, PRODUCT_ENDPOINTS } from "@/lib";
import {  ProductsResponse } from "@/Types";

export const getProductByIdAPI = async (productId: string) => {
  try {
    const response = await api.get(`${PRODUCT_ENDPOINTS.getProductById}?id=${productId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Get Product By Id API Error:", error);
    throw error;
  }
};

export const searchProductsByNameAPI = async (
  productName: string,
  currentPage: number,
  pageSize: number
): Promise<ProductsResponse> => {
  try {
    const response = await api.get<ProductsResponse>(
      `${PRODUCT_ENDPOINTS.getProductsByName}?currentPage=${currentPage}&pageSize=${pageSize}&productName=${encodeURIComponent(productName)}`
    );
    return response.data;
    
  } catch (error) {
    console.error("❌ Search Products By Name API Error:", error);
    throw error;
  }
};