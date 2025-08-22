// src/lib/constants.ts
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "https://eticaretapi-gghdgef9bzameteu.switzerlandnorth-01.azurewebsites.net"; // Azure backend URL

export const AUTH_ENDPOINTS = {
  login: process.env.NEXT_PUBLIC_AUTH_LOGIN || "/api/Auth/Login",
  register: process.env.NEXT_PUBLIC_AUTH_REGISTER || "/api/Auth/Register",
  refresh: process.env.NEXT_PUBLIC_AUTH_REFRESH || "/api/Auth/Refresh",
  roles: process.env.NEXT_PUBLIC_AUTH_ROLES || "/api/Auth/Roles",
  forgotPassword: process.env.NEXT_PUBLIC_AUTH_FORGOT_PASSWORD || "/api/Auth/ForgotPassword",
  resetPassword: process.env.NEXT_PUBLIC_AUTH_RESET_PASSWORD || "/api/Auth/ResetPassword",
} as const;

export const USER_ENDPOINTS = {
  getUserProfile: "/api/User/GetUserProfile",
  updateUser: "/api/User/UpdateUser",
  changePassword: "/api/User/ChangePassword",
  getUserInfo: "/api/User", // Alternative endpoint for user info
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
  addProduct: "/api/Product/AddProduct",
  addFavoriteProduct: "/api/Product/AddFavoriteProduct",
  deleteFavoriteProduct: "/api/Product/DeleteFavoriteProduct",
  addProductImages: "/api/Product/AddProductImages",
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
  addItemToBasket: "/api/Basket/AddItemTomBasket",
  updateQuantity: "/api/Basket/UpdateQuantity",
  deleteBasketItem: "/api/Basket/DeleteBasketItem",
} as const;

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";