"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthGuard from '@/components/AuthGuard';
import { 
  addProductAPI, 
  addProductImagesAPI, 
  addProductDetailAPI, 
  addStockAPI 
} from '@/features/product';
import { 
  AddProductRequest, 
  AddProductImagesRequest, 
  AddProductDetailRequest, 
  AddStockRequest 
} from '@/Types';

export default function AdminProductPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'add-product' | 'add-images' | 'add-details' | 'add-stock'>('add-product');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [lastCreatedProductId, setLastCreatedProductId] = useState<string>('');

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: ''
  });

  // Product images form state
  const [imagesForm, setImagesForm] = useState({
    productId: '',
    images: ['']
  });

  // Product details form state
  const [detailsForm, setDetailsForm] = useState({
    productId: '',
    variations: [{ color: '', size: '', stockQuantity: 0 }]
  });

  // Stock form state
  const [stockForm, setStockForm] = useState({
    addStock: [{ productTypeId: '', quantity: 0 }]
  });

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productForm.name || !productForm.description || productForm.price <= 0 || !productForm.categoryId) {
      setMessage({ type: 'error', text: 'Tüm alanları doldurun ve geçerli bir fiyat girin' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      const response = await addProductAPI(productForm as AddProductRequest);
      
      if (response.productId) {
        setLastCreatedProductId(response.productId);
        setImagesForm(prev => ({ ...prev, productId: response.productId }));
        setDetailsForm(prev => ({ ...prev, productId: response.productId }));
        
        setMessage({ 
          type: 'success', 
          text: `${response.message} - Ürün ID: ${response.productId}` 
        });
        
        // Reset form
        setProductForm({ name: '', description: '', price: 0, categoryId: '' });
      }
      
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Ürün ekleme başarısız oldu' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImages = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imagesForm.productId || imagesForm.images.some((url: string) => !url.trim())) {
      setMessage({ type: 'error', text: 'Ürün ID ve tüm resim URL\'leri gereklidir' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      const requestData: AddProductImagesRequest = {
        productId: imagesForm.productId,
        images: imagesForm.images.filter((url: string) => url.trim())
      };
      
      await addProductImagesAPI(requestData);
      setMessage({ type: 'success', text: 'Ürün resimleri başarıyla eklendi' });
      
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Resim ekleme başarısız oldu' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!detailsForm.productId || detailsForm.variations.some(v => !v.color || !v.size || v.stockQuantity < 0)) {
      setMessage({ type: 'error', text: 'Ürün ID ve tüm varyasyon bilgileri gereklidir' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      const requestData: AddProductDetailRequest = detailsForm.variations.map(variation => ({
        productId: detailsForm.productId,
        color: variation.color,
        size: variation.size,
        stockQuantity: variation.stockQuantity
      }));
      
      await addProductDetailAPI(requestData);
      setMessage({ type: 'success', text: 'Ürün varyasyonları başarıyla eklendi' });
      
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Varyasyon ekleme başarısız oldu' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (stockForm.addStock.some(item => !item.productTypeId || item.quantity < 0)) {
      setMessage({ type: 'error', text: 'Tüm ürün tipi ID\'leri ve geçerli miktarlar gereklidir' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      await addStockAPI(stockForm as AddStockRequest);
      setMessage({ type: 'success', text: 'Stok başarıyla eklendi' });
      
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Stok ekleme başarısız oldu' 
      });
    } finally {
      setLoading(false);
    }
  };

  const addImageUrl = () => {
    setImagesForm(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const updateImageUrl = (index: number, value: string) => {
    setImagesForm(prev => ({
      ...prev,
      images: prev.images.map((url: string, i: number) => i === index ? value : url)
    }));
  };

  const removeImageUrl = (index: number) => {
    setImagesForm(prev => ({
      ...prev,
      images: prev.images.filter((_: string, i: number) => i !== index)
    }));
  };

  const addVariation = () => {
    setDetailsForm(prev => ({
      ...prev,
      variations: [...prev.variations, { color: '', size: '', stockQuantity: 0 }]
    }));
  };

  const updateVariation = (index: number, field: string, value: string | number) => {
    setDetailsForm(prev => ({
      ...prev,
      variations: prev.variations.map((variation, i) => 
        i === index ? { ...variation, [field]: value } : variation
      )
    }));
  };

  const removeVariation = (index: number) => {
    setDetailsForm(prev => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index)
    }));
  };

  const addStockItem = () => {
    setStockForm(prev => ({
      ...prev,
      addStock: [...prev.addStock, { productTypeId: '', quantity: 0 }]
    }));
  };

  const updateStockItem = (index: number, field: string, value: string | number) => {
    setStockForm(prev => ({
      ...prev,
      addStock: prev.addStock.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeStockItem = (index: number) => {
    setStockForm(prev => ({
      ...prev,
      addStock: prev.addStock.filter((_, i) => i !== index)
    }));
  };

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <h1 className="text-2xl font-bold text-gray-900">Ürün Yönetimi</h1>
            <p className="text-gray-600">Ürün ekleme, resim yükleme, varyasyon ve stok yönetimi</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'add-product', label: 'Ürün Ekle' },
                { key: 'add-images', label: 'Resim Ekle' },
                { key: 'add-details', label: 'Varyasyon Ekle' },
                { key: 'add-stock', label: 'Stok Ekle' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as 'add-product' | 'add-images' | 'add-details' | 'add-stock')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {message && (
              <div className={`mb-4 p-3 rounded ${
                message.type === 'error' 
                  ? 'bg-red-100 border border-red-400 text-red-700' 
                  : 'bg-green-100 border border-green-400 text-green-700'
              }`}>
                {message.text}
              </div>
            )}

            {lastCreatedProductId && (
              <div className="mb-4 p-3 bg-blue-100 border border-blue-400 text-blue-700 rounded">
                Son oluşturulan ürün ID: <code className="font-mono">{lastCreatedProductId}</code>
              </div>
            )}

            {/* Add Product Tab */}
            {activeTab === 'add-product' && (
              <form onSubmit={handleAddProduct} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Yeni Ürün Ekle</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ürün adını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Açıklama</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ürün açıklamasını girin"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Fiyat (TL)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={productForm.price}
                    onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Kategori ID</label>
                  <input
                    type="text"
                    value={productForm.categoryId}
                    onChange={(e) => setProductForm(prev => ({ ...prev, categoryId: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="UUID formatında kategori ID"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Ürün Ekle'}
                </button>
              </form>
            )}

            {/* Add Images Tab */}
            {activeTab === 'add-images' && (
              <form onSubmit={handleAddImages} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Ürün Resimi Ekle</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ürün ID</label>
                  <input
                    type="text"
                    value={imagesForm.productId}
                    onChange={(e) => setImagesForm(prev => ({ ...prev, productId: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ürün GUID ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Resim URL&apos;leri</label>
                  {imagesForm.images.map((url: string, index: number) => (
                    <div key={index} className="flex mt-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateImageUrl(index, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                      {imagesForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImageUrl(index)}
                          className="ml-2 px-3 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50"
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addImageUrl}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    + Resim URL Ekle
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Resimleri Ekle'}
                </button>
              </form>
            )}

            {/* Add Details Tab */}
            {activeTab === 'add-details' && (
              <form onSubmit={handleAddDetails} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Ürün Varyasyonu Ekle</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ürün ID</label>
                  <input
                    type="text"
                    value={detailsForm.productId}
                    onChange={(e) => setDetailsForm(prev => ({ ...prev, productId: e.target.value }))}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Ürün GUID ID"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Varyasyonlar</label>
                  {detailsForm.variations.map((variation, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Renk</label>
                          <input
                            type="text"
                            value={variation.color}
                            onChange={(e) => updateVariation(index, 'color', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                            placeholder="Kırmızı"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Beden</label>
                          <input
                            type="text"
                            value={variation.size}
                            onChange={(e) => updateVariation(index, 'size', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                            placeholder="M"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Stok</label>
                          <input
                            type="number"
                            min="0"
                            value={variation.stockQuantity}
                            onChange={(e) => updateVariation(index, 'stockQuantity', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                            required
                          />
                        </div>
                      </div>
                      {detailsForm.variations.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeVariation(index)}
                          className="mt-2 px-3 py-1 border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm"
                        >
                          Varyasyonu Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addVariation}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    + Varyasyon Ekle
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Varyasyonları Ekle'}
                </button>
              </form>
            )}

            {/* Add Stock Tab */}
            {activeTab === 'add-stock' && (
              <form onSubmit={handleAddStock} className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Stok Ekle</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stok Girişleri</label>
                  {stockForm.addStock.map((item, index) => (
                    <div key={index} className="border border-gray-200 rounded-md p-4 mt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Ürün Tipi ID</label>
                          <input
                            type="text"
                            value={item.productTypeId}
                            onChange={(e) => updateStockItem(index, 'productTypeId', e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                            placeholder="UUID formatında ürün tipi ID"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600">Miktar</label>
                          <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => updateStockItem(index, 'quantity', parseInt(e.target.value) || 0)}
                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-1 text-sm"
                            required
                          />
                        </div>
                      </div>
                      {stockForm.addStock.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStockItem(index)}
                          className="mt-2 px-3 py-1 border border-red-300 text-red-700 rounded-md hover:bg-red-50 text-sm"
                        >
                          Stok Girişini Sil
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addStockItem}
                    className="mt-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  >
                    + Stok Girişi Ekle
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {loading ? 'Ekleniyor...' : 'Stok Ekle'}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Geri Dön
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
