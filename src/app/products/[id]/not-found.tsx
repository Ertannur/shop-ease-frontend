import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="container py-16">
      <div className="text-center">
        <h1 className="text-4xl font-normal mb-4">Ürün Bulunamadı</h1>
        <p className="text-gray-600 mb-8">
          Aradığınız ürün mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link 
          href="/products"
          className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-300"
        >
          Ürünlere Geri Dön
        </Link>
      </div>
    </div>
  );
}