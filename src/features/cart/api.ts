import { api, BASKET_ENDPOINTS } from "@/lib";
import { 
  BasketItem, // Renamed from BackendCartItem
  AddItemToBasketRequest, 
  UpdateQuantityRequest, 
  DeleteBasketItemRequest, 
  ApiResponse 
} from "@/Types"; // Import from Types

// Get user's cart items from backend
export const getBackendCartAPI = async (): Promise<BasketItem[]> => {
  try {
    console.log('🔄 Fetching cart from backend...');
    const response = await api.post<BasketItem[]>(BASKET_ENDPOINTS.getBasketItems); // Fixed: Backend uses POST
    console.log('✅ Backend cart fetched successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Get Backend Cart API Error:', error);
    throw error;
  }
};

// Add item to backend cart
export const addToBackendCartAPI = async (item: AddItemToBasketRequest): Promise<ApiResponse> => {
  try {
    console.log('🔄 Adding item to backend cart:', item);
    const response = await api.post<ApiResponse>(BASKET_ENDPOINTS.addItemToBasket, item);
    console.log('✅ Item added to backend cart successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Add to Backend Cart API Error:', error);
    throw error;
  }
};

// Update cart item quantity in backend
export const updateBackendCartQuantityAPI = async (request: UpdateQuantityRequest): Promise<ApiResponse> => {
  try {
    console.log('🔄 Updating cart quantity in backend:', request);
    const response = await api.post<ApiResponse>(BASKET_ENDPOINTS.updateQuantity, request);
    console.log('✅ Cart quantity updated in backend successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Update Backend Cart Quantity API Error:', error);
    throw error;
  }
};

// Remove item from backend cart
export const removeFromBackendCartAPI = async (request: DeleteBasketItemRequest): Promise<ApiResponse> => {
  try {
    console.log('🔄 Removing item from backend cart:', request);
    const response = await api.post<ApiResponse>(BASKET_ENDPOINTS.deleteBasketItem, request);
    console.log('✅ Item removed from backend cart successfully:', response.data);
    return response.data;
  } catch (error: unknown) {
    console.error('❌ Remove from Backend Cart API Error:', error);
    throw error;
  }
};

// Sync local cart with backend cart
export const syncCartWithBackendAPI = async (localCart: CartItem[]): Promise<BasketItem[]> => {
  try {
    console.log('🔄 Syncing local cart with backend...', localCart);
    
    // First, get current backend cart
    const backendCart = await getBackendCartAPI();
    
    // For each local cart item, add to backend if not exists
    // Note: Backend only stores productId and quantity, not color/size variants
    for (const localItem of localCart) {
      const existsInBackend = backendCart.some((backendItem: BasketItem) => 
        backendItem.productId === localItem.id // Match by productId
      );
      
      if (!existsInBackend) {
        await addToBackendCartAPI({
          productId: localItem.id,
          quantity: localItem.quantity
        });
      }
    }
    
    // Return updated backend cart
    return await getBackendCartAPI();
  } catch (error: unknown) {
    console.error('❌ Sync Cart with Backend API Error:', error);
    throw error;
  }
};

// Convert backend cart item to frontend cart item
export const convertBackendCartItem = (backendItem: BasketItem): CartItem => {
  return {
    id: backendItem.basketItemId, // Use basketItemId as the product identifier
    name: backendItem.name,
    price: backendItem.price,
    image: backendItem.imageUrl || '/placeholder-image.jpg',
    quantity: backendItem.quantity,
    selectedColor: '', // Backend doesn't store color info
    selectedSize: '', // Backend doesn't store size info
    backendCartItemId: backendItem.basketItemId
  };
};