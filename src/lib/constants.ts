// src/lib/constants.ts
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net"; // Backend domain URL
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net"; // Azure backend URL

export const AUTH_ENDPOINTS = {
  login: "/api/Auth/Login",
  register: "/api/Auth/Register",
  refresh: "/api/Auth/RefreshTokenLogin", // Updated endpoint name
  roles: "/api/Auth/Roles",
  forgotPassword: "/api/Auth/ForgotPassword",
  resetPassword: "/api/Auth/ResetPassword",
} as const;

export const USER_ENDPOINTS = {
  updateUser: "/api/User/UpdateUser",
  getUserById: "/api/User/GetUserById", // Updated endpoint name
  changePassword: "/api/User/ChangePassword",
} as const;

export const PRODUCT_ENDPOINTS = {
  getProducts: "/api/Product/GetProducts",
  getProductById: "/api/Product/GetProductById", // Updated endpoint name
  addProduct: "/api/Product/AddProduct",
  getFavoriteProducts: "/api/Product/GetFavoriteProducts", // New endpoint
  addFavoriteProduct: "/api/Product/AddFavoriteProduct",
  deleteFavoriteProduct: "/api/Product/DeleteFavoriteProduct",
} as const;

export const PRODUCT_DETAIL_ENDPOINTS = {
  addProductDetail: "/api/ProductDetail/AddProductDetail",
} as const;

export const STOCK_ENDPOINTS = {
  addStock: "/api/Stock/AddStock",
} as const;

export const ORDER_ENDPOINTS = {
  createOrder: "/api/Order/CreateOrder",
  listCurrentUserOrders: "/api/Order/ListCurrentUserOrders",
} as const;

export const ADDRESS_ENDPOINTS = {
  addAddress: "/api/Adress/AddAdress",
  getUserAddress: "/api/Adress/GetUserAdress",
} as const;

export const BASKET_ENDPOINTS = {
  getBasketItems: "/api/Basket/GetBasketItems",
  addItemToBasket: "/api/Basket/AddItemToBasket", // Fixed typo: was AddItemTomBasket
  updateQuantity: "/api/Basket/UpdateQuantity",
  deleteBasketItem: "/api/Basket/DeleteBasketItem",
} as const;

export const IMAGE_ENDPOINTS = {
  uploadImage: "/api/Image/UploadImage", // New endpoint
} as const;

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";