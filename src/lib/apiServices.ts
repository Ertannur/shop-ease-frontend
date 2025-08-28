import { api } from './apiClient';
import { 
  AUTH_ENDPOINTS, 
  USER_ENDPOINTS, 
  PRODUCT_ENDPOINTS, 
  ADDRESS_ENDPOINTS,
  BASKET_ENDPOINTS,
  ORDER_ENDPOINTS,
  CHAT_ENDPOINTS,
  IMAGE_ENDPOINTS 
} from './constants';

// Import existing types
import {
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  AuthResponse,
} from '@/Types/Auth';

import { 
  ApiProduct,
  ProductsResponse,
  AddFavoriteProductRequest,
} from '@/Types/Product';

import {
  AddAddressRequest,
  Address,
  UserAddressResponse,
} from '@/Types/Address';

import {
  BasketItem,
  AddItemToBasketRequest,
  UpdateQuantityRequest,
  DeleteBasketItemRequest,
} from '@/Types/Basket';

import {
  CreateOrderRequest,
  UserOrder,
  UserOrdersResponse,
} from '@/Types/Order';

// User response type (add if not exists in Types)
export interface UserResponse {
  userId?: string;
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: 0 | 1;
  dateOfBirth?: string;
  roles?: string[];
}

// Chat types (already defined in signalRConnection.ts)
export interface SendMessageRequest {
  userId: string;
  toUserId: string;
  message: string;
}

// API Services
export const authService = {
  login: (data: LoginRequest) => api.post<AuthResponse>(AUTH_ENDPOINTS.login, data),
  register: (data: RegisterRequest) => api.post(AUTH_ENDPOINTS.register, data),
  refreshToken: (refreshToken: string) => api.post(AUTH_ENDPOINTS.refresh, { refreshToken }),
  forgotPassword: (data: ForgotPasswordRequest) => api.post(AUTH_ENDPOINTS.forgotPassword, data),
  resetPassword: (data: ResetPasswordRequest) => api.post(AUTH_ENDPOINTS.resetPassword, data),
};

export const userService = {
  updateUser: (data: UpdateUserRequest) => api.post(USER_ENDPOINTS.updateUser, data),
  getUserById: (id: string) => api.get<UserResponse>(`${USER_ENDPOINTS.getUserById}?id=${id}`),
  changePassword: (data: ChangePasswordRequest) => api.post(USER_ENDPOINTS.changePassword, data),
  getCurrentUser: () => api.get<UserResponse>(USER_ENDPOINTS.getCurrentUser),
};

export const productService = {
  getProducts: (params?: { currentPage?: number; pageSize?: number; category?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.currentPage) searchParams.append('currentPage', params.currentPage.toString());
    if (params?.pageSize) searchParams.append('pageSize', params.pageSize.toString());
    if (params?.category) searchParams.append('category', params.category);
    
    const queryString = searchParams.toString();
    const url = queryString ? `${PRODUCT_ENDPOINTS.getProducts}?${queryString}` : PRODUCT_ENDPOINTS.getProducts;
    
    return api.get<ProductsResponse>(url);
  },
  getProductById: (id: string) => api.get<ApiProduct>(`${PRODUCT_ENDPOINTS.getProductById}?id=${id}`),
  getFavoriteProducts: () => api.get<ApiProduct[]>(PRODUCT_ENDPOINTS.getFavoriteProducts),
  addFavoriteProduct: (data: AddFavoriteProductRequest) => api.post(PRODUCT_ENDPOINTS.addFavoriteProduct, data),
  deleteFavoriteProduct: (data: AddFavoriteProductRequest) => api.post(PRODUCT_ENDPOINTS.deleteFavoriteProduct, data),
};

export const addressService = {
  addAddress: (data: AddAddressRequest) => api.post(ADDRESS_ENDPOINTS.addAddress, data),
  getUserAddress: () => api.get<UserAddressResponse>(ADDRESS_ENDPOINTS.getUserAddress),
  updateAddress: (data: Address) => api.post(ADDRESS_ENDPOINTS.updateAddress, data), // Address has adressId field for updates
};

export const basketService = {
  getBasketItems: () => api.post<BasketItem[]>(BASKET_ENDPOINTS.getBasketItems), // Note: Backend uses POST, not GET
  addItemToBasket: (data: AddItemToBasketRequest) => api.post(BASKET_ENDPOINTS.addItemToBasket, data),
  updateQuantity: (data: UpdateQuantityRequest) => api.post(BASKET_ENDPOINTS.updateQuantity, data),
  deleteBasketItem: (data: DeleteBasketItemRequest) => api.post(BASKET_ENDPOINTS.deleteBasketItem, data),
};

export const orderService = {
  createOrder: (data: CreateOrderRequest) => api.post(ORDER_ENDPOINTS.createOrder, data),
  listCurrentUserOrders: () => api.get<UserOrdersResponse>(ORDER_ENDPOINTS.listCurrentUserOrders),
};

export const chatService = {
  getChats: (toUserId: string) => api.get(`${CHAT_ENDPOINTS.getChats}?toUserId=${toUserId}`),
  getUsers: () => api.get(CHAT_ENDPOINTS.getUsers), // Admin/Support only
  getSupport: () => api.get(CHAT_ENDPOINTS.getSupport), // User/Admin only
  sendMessage: (data: SendMessageRequest) => api.post(CHAT_ENDPOINTS.sendMessage, data),
};

export const imageService = {
  uploadImage: (productId: string, formData: FormData) => {
    return api.post(`${IMAGE_ENDPOINTS.uploadImage}?ProductId=${productId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
