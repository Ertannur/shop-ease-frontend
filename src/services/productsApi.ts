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

export const getFilteredProductsAPI = async (
  type: `new` | `discounted` | `weekly` | `best-sellers`,
  currentPage: number = 1,
  pageSize: number = 8
): Promise<ProductsResponse> => {
  try {
    const response = await api.get<ProductsResponse>(
      `${PRODUCT_ENDPOINTS.getFilteredProducts}?currentPage=${currentPage}&pageSize=${pageSize}&type=${type}`
    );
    return response.data;
  } catch (error) {
    console.error("❌ Get Filtered Products API Error:", error);
    throw error;
  }
}