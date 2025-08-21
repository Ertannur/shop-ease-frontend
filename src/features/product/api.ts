import { api } from "@/lib/apiClient";
import { 
  PRODUCT_ENDPOINTS, 
  PRODUCT_DETAIL_ENDPOINTS, 
  STOCK_ENDPOINTS 
} from "@/lib/constants";
import { 
  AddProductRequest, 
  AddProductResponse, 
  AddFavoriteProductRequest, 
  DeleteFavoriteProductRequest, 
  AddProductDetailRequest, 
  AddStockRequest, 
  AddProductImagesRequest,
  ApiResponse 
} from "@/Types";

export const addProductAPI = async (data: AddProductRequest): Promise<AddProductResponse> => {
  try {
    const response = await api.post<AddProductResponse>(
      PRODUCT_ENDPOINTS.addProduct, 
      data
    );
    return response.data;
  } catch (error) {
    console.error('Add Product API Error:', error);
    throw error;
  }
};

export const addFavoriteProductAPI = async (productId: string): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      PRODUCT_ENDPOINTS.addFavoriteProduct,
      { productId } as AddFavoriteProductRequest
    );
    return response.data;
  } catch (error) {
    console.error('Add Favorite Product API Error:', error);
    throw error;
  }
};

export const deleteFavoriteProductAPI = async (productId: string): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      PRODUCT_ENDPOINTS.deleteFavoriteProduct,
      { productId } as DeleteFavoriteProductRequest
    );
    return response.data;
  } catch (error) {
    console.error('Delete Favorite Product API Error:', error);
    throw error;
  }
};

export const addProductImagesAPI = async (data: AddProductImagesRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      PRODUCT_ENDPOINTS.addProductImages,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Add Product Images API Error:', error);
    throw error;
  }
};

export const addProductDetailAPI = async (data: AddProductDetailRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      PRODUCT_DETAIL_ENDPOINTS.addProductDetail,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Add Product Detail API Error:', error);
    throw error;
  }
};

export const addStockAPI = async (data: AddStockRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      STOCK_ENDPOINTS.addStock,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Add Stock API Error:', error);
    throw error;
  }
};
