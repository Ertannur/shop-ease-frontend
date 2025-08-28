import React from "react";
import ProductDetailClient from "./ProductDetailClient";
import { ApiProductDetail } from "@/Types";
import { notFound } from "next/navigation";

const Base_Url = "https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net";

// API'den tüm ürün ID'lerini çek → build time'da generateStaticParams için
export async function generateStaticParams() {
  try {
    const response = await fetch(`${Base_Url}/api/Product/GetProduct`, {
      next: { revalidate: 60 }, // 60 sn cache
    });

    if (!response.ok) {
      console.error("Ürün ID'leri alınamadı:", response.status, response.statusText);
      return [];
    }

    const products = await response.json();

    // API'nin dönen verisini loglayalım
    console.log("GenerateStaticParams API response:", products);

    // API’de productId varsa onları döndür
    return products.map((item: any) => ({
      id: String(item.productId),
    }));
  } catch (error) {
    console.error("generateStaticParams hata:", error);
    return [];
  }
}

interface ProductDetailProps {
  params: {
    id: string;
  };
}

async function fetchProductDetail(id: string): Promise<ApiProductDetail | null> {
  try {
    const response = await fetch(`${Base_Url}/api/Product/GetProductById?id=${id}`, {
      next: {
        revalidate: 60, // 60 sn cache
      },
    });

    if (!response.ok) {
      console.error("Ürün alınamadı:", response.status, response.statusText);
      return null;
    }

    const rawData = await response.json();

    console.log("Raw Product Detail Response:", rawData);

    if (!rawData || !rawData.productId) {
      console.warn("Boş ürün datası geldi");
      return null;
    }

    return rawData as ApiProductDetail;
  } catch (error) {
    console.error("fetchProductDetail hata:", error);
    return null;
  }
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const { id } = params;

  const product = await fetchProductDetail(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient id={id} product={product} />;
};

export default ProductDetail;
