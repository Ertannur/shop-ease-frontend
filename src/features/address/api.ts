import { api } from "@/lib/apiClient";
import { ADDRESS_ENDPOINTS } from "@/lib/constants";
import { 
  AddAddressRequest,
  UserAddressResponse,
  ApiResponse 
} from "@/Types";

export const addAddressAPI = async (data: AddAddressRequest): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      ADDRESS_ENDPOINTS.addAddress,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Add Address API Error:', error);
    throw error;
  }
};

export const getUserAddressAPI = async (): Promise<UserAddressResponse> => {
  try {
    const response = await api.get<UserAddressResponse>(
      ADDRESS_ENDPOINTS.getUserAddress
    );
    return response.data;
  } catch (error) {
    console.error('Get User Address API Error:', error);
    throw error;
  }
};
