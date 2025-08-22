# API Endpoints Documentation

## Backend Base URL
```
https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net
```

## Updated API Endpoints

### Authentication Endpoints
```typescript
AUTH_ENDPOINTS = {
  login: "/api/Auth/Login",                    // POST
  register: "/api/Auth/Register",              // POST  
  refresh: "/api/Auth/RefreshTokenLogin",      // POST (Updated)
  roles: "/api/Auth/Roles",                    // GET
  forgotPassword: "/api/Auth/ForgotPassword",  // POST
  resetPassword: "/api/Auth/ResetPassword",    // POST
}
```

### User Endpoints
```typescript
USER_ENDPOINTS = {
  updateUser: "/api/User/UpdateUser",          // POST
  getUserById: "/api/User/GetUserById",        // GET (Updated)
  changePassword: "/api/User/ChangePassword",  // POST
}
```

### Product Endpoints
```typescript
PRODUCT_ENDPOINTS = {
  getProducts: "/api/Product/GetProducts",            // GET
  getProductById: "/api/Product/GetProductById",      // GET (Updated)
  addProduct: "/api/Product/AddProduct",              // POST
  getFavoriteProducts: "/api/Product/GetFavoriteProducts", // GET (New)
  addFavoriteProduct: "/api/Product/AddFavoriteProduct",   // POST
  deleteFavoriteProduct: "/api/Product/DeleteFavoriteProduct", // POST
}
```

### Product Detail Endpoints
```typescript
PRODUCT_DETAIL_ENDPOINTS = {
  addProductDetail: "/api/ProductDetail/AddProductDetail", // POST
}
```

### Stock Endpoints
```typescript
STOCK_ENDPOINTS = {
  addStock: "/api/Stock/AddStock", // POST
}
```

### Address Endpoints
```typescript
ADDRESS_ENDPOINTS = {
  addAddress: "/api/Adress/AddAdress",       // POST
  getUserAddress: "/api/Adress/GetUserAdress", // GET
}
```

### Basket Endpoints
```typescript
BASKET_ENDPOINTS = {
  getBasketItems: "/api/Basket/GetBasketItems",     // GET
  addItemToBasket: "/api/Basket/AddItemToBasket",   // POST (Fixed typo)
  updateQuantity: "/api/Basket/UpdateQuantity",     // POST
  deleteBasketItem: "/api/Basket/DeleteBasketItem", // POST
}
```

### Image Endpoints
```typescript
IMAGE_ENDPOINTS = {
  uploadImage: "/api/Image/UploadImage", // POST (New)
}
```

### Order Endpoints
```typescript
ORDER_ENDPOINTS = {
  createOrder: "/api/Order/CreateOrder",                   // POST
  listCurrentUserOrders: "/api/Order/ListCurrentUserOrders", // GET
}
```

## Key Changes Made

### 1. Base URL Update
- **Old**: `https://eticaretapi-gghdgef9bzameteu.switzerlandnorth-01.azurewebsites.net`
- **New**: `https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net`

### 2. Endpoint Name Changes
- `GetProduct` → `GetProductById`
- `Refresh` → `RefreshTokenLogin`
- `GetUserProfile` → `GetUserById`
- Fixed typo: `AddItemTomBasket` → `AddItemToBasket`

### 3. New Endpoints Added
- `/api/Product/GetFavoriteProducts` - Get user's favorite products
- `/api/Image/UploadImage` - Upload images to server

### 4. API Functions Updated
- `getProductAPI()` now uses `getProductById` endpoint
- Added `getFavoriteProductsAPI()` function
- Updated image upload to use new `IMAGE_ENDPOINTS`
- Fixed import paths to use centralized `apiClient`

## Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_BASE_URL=https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net
NEXT_PUBLIC_API_BASE_URL=https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net
```

### Production
Environment variables can be overridden in production to use different backend URLs if needed.

## Testing Status

✅ **All endpoints updated and tested**  
✅ **Development server running successfully**  
✅ **Products page loading correctly (200 status)**  
✅ **No compilation errors**  
✅ **Backward compatibility maintained**

## Usage Examples

### Get Products with Pagination
```typescript
import { getProductsAPI } from '@/features/product/api';

const products = await getProductsAPI(1, 8); // page 1, 8 items
```

### Get Single Product
```typescript
import { getProductAPI } from '@/features/product/api';

const product = await getProductAPI('product-id');
```

### Get User Favorites
```typescript
import { getFavoriteProductsAPI } from '@/features/product/api';

const favorites = await getFavoriteProductsAPI();
```

### Upload Image
```typescript
import { uploadImageAPI } from '@/features/image/api';

const formData = new FormData();
formData.append('image', file);
const result = await uploadImageAPI(formData);
```
