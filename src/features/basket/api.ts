import { api } from "@/lib/apiClient";
import { BASKET_ENDPOINTS } from "@/lib/constants";
import { 
  BasketItemsResponse,
  AddItemToBasketRequest,
  UpdateQuantityRequest,
  DeleteBasketItemRequest,
  ApiResponse 
} from "@/Types";

export const getBasketItemsAPI = async (): Promise<BasketItemsResponse> => {
  try {
    const response = await api.post<BasketItemsResponse>( // Fixed: Backend uses POST
      BASKET_ENDPOINTS.getBasketItems
    );
    return response.data;
  } catch (error) {
    console.error('Get Basket Items API Error:', error);
    throw error;
  }
};

export const addItemToBasketAPI = async (
  productId: string, 
  quantity: number
): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      BASKET_ENDPOINTS.addItemToBasket,
      { productId, quantity } as AddItemToBasketRequest
    );
    return response.data;
  } catch (error) {
    console.error('Add Item to Basket API Error:', error);
    throw error;
  }
};

export const updateQuantityAPI = async (
  basketItemId: string, 
  quantity: number
): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      BASKET_ENDPOINTS.updateQuantity,
      { basketItemId, quantity } as UpdateQuantityRequest
    );
    return response.data;
  } catch (error) {
    console.error('Update Quantity API Error:', error);
    throw error;
  }
};

export const deleteBasketItemAPI = async (basketItemId: string): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      BASKET_ENDPOINTS.deleteBasketItem,
      { basketItemId } as DeleteBasketItemRequest
    );
    return response.data;
  } catch (error) {
    console.error('Delete Basket Item API Error:', error);
    throw error;
  }
};
