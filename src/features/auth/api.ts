import { api, AUTH_ENDPOINTS } from "@/lib";
import { 
  RegisterRequest, 
  LoginRequest, 
  AuthResponse, 
  ForgotPasswordRequest, 
  ResetPasswordRequest 
} from "@/Types";
import { AxiosError } from 'axios';

export type LoginDto = LoginRequest;
export type RegisterDto = RegisterRequest;

export const loginAPI = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.login, {
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
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.register, data);

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

export const forgotPasswordAPI = async (email: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(
      AUTH_ENDPOINTS.forgotPassword,
      { email } as ForgotPasswordRequest
    );

    return response.data;
  } catch (error: unknown) {
    console.error('Forgot Password API Error:', error);
    
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

export const resetPasswordAPI = async (data: ResetPasswordRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.resetPassword, data);

    return response.data;
  } catch (error: unknown) {
    console.error('Reset Password API Error:', error);
    
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