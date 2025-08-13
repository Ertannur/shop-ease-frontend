import { api, AUTH_ENDPOINTS } from "@/lib";
import { AxiosError } from 'axios';

export type LoginDto = { email: string; password: string };
export type RegisterDto = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: 0 | 1 | 2; // 0: male, 1: female, 2: other
};

export type AuthResponse = {
  success: boolean;
  userId: string | null;
  message: string;
  token: {
    accessToken: string;
    expiration: string;
    refreshToken?: string | null;
  } | null;
  user?: {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];
  };
};

export const loginAPI = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/Auth/login', {
      email,
      password
    });

    // API response format'ını kontrol et
    if (!response.data.success) {
      throw new Error(response.data.message || 'Login failed');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('Login API Error:', error);
    
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error occurred');
    }
    
    throw new Error('Network error occurred');
  }
};

export const registerAPI = async (data: RegisterDto): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/Auth/register', data);

    // API response format'ını kontrol et
    if (!response.data.success) {
      throw new Error(response.data.message || 'Register failed');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('Register API Error:', error);
    
    if (error instanceof AxiosError) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
    }
    
    if (error instanceof Error) {
      throw new Error(error.message || 'Network error occurred');
    }
    
    throw new Error('Network error occurred');
  }
};

// src/features/auth/api.ts
export async function getSession() {
  try {
    const res = await api.get(AUTH_ENDPOINTS.roles);
    const payload = res.data;
    if (payload?.user) return payload.user;
    if (payload?.email || payload?.id) return payload; // bazı backendlere uyum
    return null;
  } catch {
    return null;
  }
}