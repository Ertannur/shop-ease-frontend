export interface ApiProduct {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface ProductsResponse {
  products: ApiProduct[];
  totalPage: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AddProductRequest {
  name: string;
  description: string;
  price: number;
  categoryId: string; // UUID format
}

export interface AddProductResponse {
  message: string;
  productId: string;
}

export interface AddFavoriteProductRequest {
  productId: string;
}

export interface DeleteFavoriteProductRequest {
  productId: string;
}

export interface ProductDetail {
  productId: string;
  color: string;
  size: string;
  stockQuantity: number;
}

export type AddProductDetailRequest = ProductDetail[];

export interface AddStockRequest {
  addStock: Array<{
    productTypeId: string; // UUID format
    quantity: number;
  }>;
}

export interface AddProductImagesRequest {
  productId: string;
  images: string[]; // Array of image URLs or file paths
}
