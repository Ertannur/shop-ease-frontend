import { api, PRODUCT_ENDPOINTS } from "@/lib";

// Backend Favorites API Integration - Based on Swagger Documentation

export interface AddFavoriteRequest {
  productId: string;
}

export interface DeleteFavoriteRequest {
  productId: string;
}

export interface FavoriteResponse {
  success?: boolean;
  message?: string;
  productId?: string;
}

// Add product to favorites
export const addToFavoritesAPI = async (productId: string): Promise<FavoriteResponse> => {
  try {
    console.log('🔄 Adding product to favorites:', productId);
    const response = await api.post<FavoriteResponse>(PRODUCT_ENDPOINTS.addFavoriteProduct, {
      productId
    });
    console.log('✅ Product added to favorites successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Add to Favorites API Error:', error);
    throw error;
  }
};

// Remove product from favorites
export const removeFromFavoritesAPI = async (productId: string): Promise<FavoriteResponse> => {
  try {
    console.log('🔄 Removing product from favorites:', productId);
    const response = await api.post<FavoriteResponse>(PRODUCT_ENDPOINTS.deleteFavoriteProduct, {
      productId
    });
    console.log('✅ Product removed from favorites successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Remove from Favorites API Error:', error);
    throw error;
  }
};

// Note: Based on the Swagger docs, there's no endpoint to GET user favorites
// This might need to be implemented on the backend or we'll use localStorage as fallback
export const getUserFavoritesAPI = async (): Promise<string[]> => {
  try {
    console.warn('⚠️ Get user favorites endpoint not available in backend, using localStorage fallback');
    // Return empty array as fallback - frontend will use localStorage
    return [];
  } catch (error: unknown) {
    console.error('❌ Get User Favorites API Error:', error);
    throw error;
  }
};
