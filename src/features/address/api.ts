import { api } from "@/lib/apiClient";
import { ADDRESS_ENDPOINTS } from "@/lib/constants";
import { 
  AddAddressRequest,
  UpdateAddressRequest,
  DeleteAddressRequest,
  UserAddressResponse,
  AddressApiResponse
} from "@/Types";

export const addAddressAPI = async (data: AddAddressRequest): Promise<AddressApiResponse> => {
  try {
    const response = await api.post<AddressApiResponse>(
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

export const updateAddressAPI = async (data: UpdateAddressRequest): Promise<AddressApiResponse> => {
  try {
    const response = await api.post<AddressApiResponse>(
      ADDRESS_ENDPOINTS.updateAddress,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Update Address API Error:', error);
    throw error;
  }
};

export const deleteAddressAPI = async (data: DeleteAddressRequest): Promise<AddressApiResponse> => {
  try {
    const response = await api.post<AddressApiResponse>(
      ADDRESS_ENDPOINTS.deleteAddress,
      data
    );
    return response.data;
  } catch (error) {
    console.error('Delete Address API Error:', error);
    throw error;
  }
};
