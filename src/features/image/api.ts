import { api } from "@/lib/apiClient";
import { IMAGE_ENDPOINTS } from "@/lib/constants";
import { ApiResponse } from "@/Types";

export const uploadImageAPI = async (data: FormData): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(
      IMAGE_ENDPOINTS.uploadImage,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Upload Image API Error:', error);
    throw error;
  }
};
