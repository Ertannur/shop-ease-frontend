import { api } from "@/lib/apiClient";
import { ORDER_ENDPOINTS } from "@/lib/constants";
import { 
  CreateOrderRequest,
  UserOrdersResponse,
  ApiResponse 
} from "@/Types";

export const createOrderAPI = async (adressId: string): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      ORDER_ENDPOINTS.createOrder,
      { adressId } as CreateOrderRequest
    );
    return response.data;
  } catch (error) {
    console.error('Create Order API Error:', error);
    throw error;
  }
};

export const listCurrentUserOrdersAPI = async (): Promise<UserOrdersResponse> => {
  try {
    const response = await api.post<UserOrdersResponse>(
      ORDER_ENDPOINTS.listCurrentUserOrders
    );
    return response.data;
  } catch (error) {
    console.error('List Current User Orders API Error:', error);
    throw error;
  }
};
