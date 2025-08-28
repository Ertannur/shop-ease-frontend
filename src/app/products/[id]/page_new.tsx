import React from "react";
import ProductDetailClient from "./ProductDetailClient";

// Static export için gerekli
export async function generateStaticParams() {
  // Mock ürün ID'leri - gerçek uygulamada API'den gelecek
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

interface ProductDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const { id } = await params;
  
  return <ProductDetailClient id={id} />;
};

export default ProductDetail;
