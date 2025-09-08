import { api } from "@/lib/apiClient";
import { USER_ENDPOINTS } from "@/lib/constants";
import { 
  UpdateUserRequest,
  ChangePasswordRequest,
  ApiResponse,
  GetUserByIdResponse,
  GetCurrentUserResponse
} from "@/Types";

// User API Functions based on Backend Swagger documentation
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

// Get Current User - Giriş yapmış kullanıcı bilgilerini getir
export const getCurrentUserAPI = async (): Promise<GetCurrentUserResponse> => {
  try {
    const response = await api.get<GetCurrentUserResponse>(
      USER_ENDPOINTS.getCurrentUser
    );
    return response.data;
  } catch (error) {
    console.error('Get Current User API Error:', error);
    throw error;
  }
};

// Get User By ID - Belirtilen ID'ye ait kullanıcı bilgilerini getir
export const getUserByIdAPI = async (userId: string): Promise<GetUserByIdResponse> => {
  try {
    const response = await api.get<GetUserByIdResponse>(
      `${USER_ENDPOINTS.getUserById}?id=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error('Get User By ID API Error:', error);
    throw error;
  }
};
