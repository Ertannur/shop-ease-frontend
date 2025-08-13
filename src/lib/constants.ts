// src/lib/constants.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // Azure backend URL
export const AUTH_ENDPOINTS = {
  login: process.env.NEXT_PUBLIC_AUTH_LOGIN || "/api/Auth/Login",
  register: process.env.NEXT_PUBLIC_AUTH_REGISTER || "/api/Auth/Register",
  refresh: process.env.NEXT_PUBLIC_AUTH_REFRESH || "/api/Auth/Refresh",
  roles: process.env.NEXT_PUBLIC_AUTH_ROLES || "/api/Auth/Roles",
  forgotPassword: process.env.NEXT_PUBLIC_AUTH_FORGOT_PASSWORD || "/api/Auth/ForgotPassword",
  resetPassword: process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD || "/api/Auth/ResetPassword",
} as const;

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";