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

export const USER_ENDPOINTS = {
  favorites: "/api/User/Favorites",
  cart: "/api/User/Cart",
  addToFavorites: "/api/User/Favorites/Add",
  removeFromFavorites: "/api/User/Favorites/Remove",
  addToCart: "/api/User/Cart/Add",
  removeFromCart: "/api/User/Cart/Remove",
  updateCartQuantity: "/api/User/Cart/Update",
} as const;

export const PRODUCT_ENDPOINTS = {
  getProducts: "/api/Product/GetProducts",
  getProduct: "/api/Product/GetProduct",
} as const;

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";