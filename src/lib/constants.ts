export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
export const AUTH_ENDPOINTS = {
  login: process.env.NEXT_PUBLIC_AUTH_LOGIN || "/api/auth/login",
  register: process.env.NEXT_PUBLIC_AUTH_REGISTER || "/api/auth/register",
  refresh: process.env.NEXT_PUBLIC_AUTH_REFRESH || "/api/auth/refresh",
  roles: process.env.NEXT_PUBLIC_AUTH_ROLES || "/api/auth/roles",
  forgotPassword: process.env.NEXT_PUBLIC_AUTH_FORGOT_PASSWORD || "/api/auth/forgot-password",
  resetPassword: process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD || "/api/auth/reset-password",
} as const;

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";