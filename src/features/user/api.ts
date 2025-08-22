import { api } from "@/lib/apiClient";
import { USER_ENDPOINTS } from "@/lib/constants";
import { 
  UpdateUserRequest,
  ChangePasswordRequest,
  ApiResponse,
  ApiUser
} from "@/Types";

// Backend API'lerinin aktif olup olmadığını kontrol eden flag
// Backend hazır olduğunda NEXT_PUBLIC_ENABLE_USER_APIS=true yapılabilir
const API_ENABLED = process.env.NEXT_PUBLIC_ENABLE_USER_APIS === 'true' || false;

// User Favorites API
export const getUserFavoritesAPI = async () => {
  if (!API_ENABLED) {
    console.info('🔄 User Favorites API disabled - using localStorage only');
    return [];
  }
  
  try {
    const response = await api.get(USER_ENDPOINTS.favorites);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Get Favorites API Error:', error);
    return [];
  }
};

export const addToFavoritesAPI = async (productId: string, color: string, size: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Add to Favorites API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(USER_ENDPOINTS.addToFavorites, {
      productId,
      color,
      size
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Add to Favorites API Error:', error);
    throw error;
  }
};

export const removeFromFavoritesAPI = async (productId: string, color: string, size: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Remove from Favorites API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.delete(USER_ENDPOINTS.removeFromFavorites, {
      data: { productId, color, size }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Remove from Favorites API Error:', error);
    throw error;
  }
};

// User Cart API
export const getUserCartAPI = async () => {
  if (!API_ENABLED) {
    console.info('🔄 User Cart API disabled - using localStorage only');
    return [];
  }
  
  try {
    const response = await api.get(USER_ENDPOINTS.cart);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Get Cart API Error:', error);
    return [];
  }
};

export const addToCartAPI = async (productId: string, color: string, size: string, quantity: number) => {
  if (!API_ENABLED) {
    console.info('🔄 Add to Cart API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.post(USER_ENDPOINTS.addToCart, {
      productId,
      color,
      size,
      quantity
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Add to Cart API Error:', error);
    throw error;
  }
};

export const removeFromCartAPI = async (productId: string, color: string, size: string) => {
  if (!API_ENABLED) {
    console.info('🔄 Remove from Cart API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.delete(USER_ENDPOINTS.removeFromCart, {
      data: { productId, color, size }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Remove from Cart API Error:', error);
    throw error;
  }
};

export const updateCartQuantityAPI = async (productId: string, color: string, size: string, quantity: number) => {
  if (!API_ENABLED) {
    console.info('🔄 Update Cart Quantity API disabled - using localStorage only');
    return { success: true };
  }
  
  try {
    const response = await api.put(USER_ENDPOINTS.updateCartQuantity, {
      productId,
      color,
      size,
      quantity
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
