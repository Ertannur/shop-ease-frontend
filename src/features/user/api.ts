import { api } from "@/lib/apiClient";
import { USER_ENDPOINTS, PRODUCT_ENDPOINTS, BASKET_ENDPOINTS } from "@/lib/constants";
import { 
  UpdateUserRequest,
  ChangePasswordRequest,
  ApiResponse
} from "@/Types";

// Backend API'lerinin aktif olup olmadığını kontrol eden flag
// Backend hazır olduğunda NEXT_PUBLIC_ENABLE_USER_APIS=true yapılabilir
const API_ENABLED = process.env.NEXT_PUBLIC_ENABLE_USER_APIS === 'true' || false;

// User Favorites API - Use PRODUCT_ENDPOINTS
export const getUserFavoritesAPI = async () => {
  if (!API_ENABLED) {
    console.info('🔄 User Favorites API disabled - using localStorage only');
    return [];
  }
  
  try {
    const response = await api.get(PRODUCT_ENDPOINTS.getFavoriteProducts); // Fixed endpoint
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Get Favorites API Error:', error);
    return [];
  }
};

export const addToFavoritesAPI = async (productId: string, _color?: string, _size?: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Add to Favorites API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(PRODUCT_ENDPOINTS.addFavoriteProduct, {
      productId // Backend only needs productId according to documentation
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Add to Favorites API Error:', error);
    throw error;
  }
};

export const removeFromFavoritesAPI = async (productId: string, _color?: string, _size?: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Remove from Favorites API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(PRODUCT_ENDPOINTS.deleteFavoriteProduct, {
      productId // Backend only needs productId according to documentation
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Remove from Favorites API Error:', error);
    throw error;
  }
};

// User Cart API - Use BASKET_ENDPOINTS
export const getUserCartAPI = async () => {
  if (!API_ENABLED) {
    console.info('🔄 User Cart API disabled - using localStorage only');
    return [];
  }
  
  try {
    const response = await api.get(BASKET_ENDPOINTS.getBasketItems); // Fixed endpoint
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Get Cart API Error:', error);
    return [];
  }
};

export const addToCartAPI = async (productId: string, _color?: string, _size?: string, quantity: number = 1) => {
  if (!API_ENABLED) {
    console.info('🔄 Add to Cart API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(BASKET_ENDPOINTS.addItemToBasket, {
      productId,
      quantity // Backend needs productId and quantity according to documentation
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Add to Cart API Error:', error);
    throw error;
  }
};

export const removeFromCartAPI = async (basketItemId: string, _color?: string, _size?: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Remove from Cart API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(BASKET_ENDPOINTS.deleteBasketItem, {
      basketItemId // Backend needs basketItemId according to documentation
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Remove from Cart API Error:', error);
    throw error;
  }
};

export const updateCartQuantityAPI = async (basketItemId: string, quantity: number, _color?: string, _size?: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Update Cart Quantity API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(BASKET_ENDPOINTS.updateQuantity, {
      basketItemId,
      quantity // Backend needs basketItemId and quantity according to documentation
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Update Cart Quantity API Error:', error);
    throw error;
  }
};

// NEW API Functions based on Swagger documentation
export const updateUserAPI = async (data: UpdateUserRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      USER_ENDPOINTS.updateUser,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Update User API Error:', error);
    throw error;
  }
};

export const changePasswordAPI = async (data: ChangePasswordRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      USER_ENDPOINTS.changePassword,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Change Password API Error:', error);
    throw error;
  }
};
