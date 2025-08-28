// Basket related types based on Swagger documentation

export interface BasketItem {
  basketItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

export type BasketItemsResponse = BasketItem[];

export interface AddItemToBasketRequest {
  productId: string;
  quantity: number;
}

export interface UpdateQuantityRequest {
  basketItemId: string;
  quantity: number;
}

export interface DeleteBasketItemRequest {
  basketItemId: string;
}
