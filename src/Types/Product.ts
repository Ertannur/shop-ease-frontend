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
