// Authentication related types based on Swagger documentation

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string; // Format: "YYYY-MM-DD"
  gender: 0 | 1; // 0 → Male, 1 → Female
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  userId?: string;
  message: string;
  token?: {
    accessToken: string;
    expiration: string;
    refreshToken?: string | null;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  token: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UpdateUserRequest {
  id: string;
  firstName: string;
  lastName: string;
  gender: 0 | 1;
  dateOfBirth: string;
  email: string;
  phoneNumber: string;
  password: string; // Required: current password for verification
}

export interface ApiResponse {
  success: boolean;
  message: string;
}
