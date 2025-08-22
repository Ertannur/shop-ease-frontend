import { api } from "@/lib/apiClient";
import { 
  PRODUCT_ENDPOINTS, 
  PRODUCT_DETAIL_ENDPOINTS, 
  STOCK_ENDPOINTS,
  IMAGE_ENDPOINTS
} from "@/lib/constants";
import { 
  AddProductRequest, 
  AddProductResponse, 
  AddFavoriteProductRequest, 
  DeleteFavoriteProductRequest, 
  AddProductDetailRequest, 
  AddStockRequest, 
  AddProductImagesRequest,
  ApiResponse,
  ProductsResponse,
  ApiProduct
} from "@/Types";

// Get all products with pagination
export const getProductsAPI = async (page: number = 1, pageSize: number = 8): Promise<ProductsResponse> => {
  try {
    const response = await api.get<ProductsResponse>(
      `${PRODUCT_ENDPOINTS.getProducts}?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error('Get Products API Error:', error);
    throw error;
  }
};

// Get single product by ID
export const getProductAPI = async (productId: string): Promise<ApiProduct> => {
  try {
    const response = await api.get<ApiProduct>(
      `${PRODUCT_ENDPOINTS.getProductById}/${productId}` // Updated to use correct endpoint
    );
    return response.data;
  } catch (error) {
    console.error('Get Product API Error:', error);
    throw error;
  }
};

// Get user's favorite products
export const getFavoriteProductsAPI = async (): Promise<ApiProduct[]> => {
  try {
    const response = await api.get<ApiProduct[]>(
      PRODUCT_ENDPOINTS.getFavoriteProducts
    );
    return response.data;
  } catch (error) {
    console.error('Get Favorite Products API Error:', error);
    throw error;
  }
};

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
      IMAGE_ENDPOINTS.uploadImage, // Updated to use IMAGE_ENDPOINTS
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
