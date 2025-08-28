"use client";
import React, { useState, useEffect } from "react";
import { api } from "@/lib/apiClient";
import { 
  PRODUCT_ENDPOINTS, 
  BASKET_ENDPOINTS, 
  AUTH_ENDPOINTS 
} from "@/lib/constants";
import { 
  getBasketItemsAPI, 
  addItemToBasketAPI,
} from "@/features/basket";
import { 
  addFavoriteProductAPI,
  deleteFavoriteProductAPI 
} from "@/features/product";
import { ApiProduct, ProductsResponse, BasketItem } from "@/Types";

const APITestPage = () => {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
    checkAuthStatus();
  }, []); // Empty dependency array is intentional for initial load

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  };

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const loadProducts = async () => {
    try {
      const response = await api.get<ProductsResponse>(`${PRODUCT_ENDPOINTS.getProducts}?page=1&pageSize=5`);
      setProducts(response.data.products);
      addLog(`✅ Loaded ${response.data.products.length} products successfully`);
    } catch (error) {
      addLog(`❌ Failed to load products: ${error}`);
    }
  };

  const testLogin = async () => {
    try {
      // Test login with demo credentials
      const response = await api.post(AUTH_ENDPOINTS.login, {
        email: "burakyildiz0417@gmail.com",
        password: "Burak123!"
      });
      
      if (response.data.success && response.data.token) {
        localStorage.setItem('token', response.data.token.accessToken);
        setIsLoggedIn(true);
        addLog(`✅ Login successful! Token saved.`);
      }
    } catch (error) {
      addLog(`❌ Login failed: ${error}`);
    }
  };

  const testBasketOperations = async () => {
    if (!isLoggedIn) {
      addLog(`❌ Please login first to test basket operations`);
      return;
    }

    try {
      // Get current basket items
      const basketItems = await getBasketItemsAPI();
      setBasketItems(basketItems);
      addLog(`✅ Loaded ${basketItems.length} basket items`);

      // Add first product to basket
      if (products.length > 0) {
        await addItemToBasketAPI(products[0].productId, 2);
        addLog(`✅ Added "${products[0].name}" to basket (quantity: 2)`);
        
        // Reload basket to see changes
        const updatedBasket = await getBasketItemsAPI();
        setBasketItems(updatedBasket);
        addLog(`✅ Basket updated - now has ${updatedBasket.length} items`);
      }
    } catch (error) {
      addLog(`❌ Basket operations failed: ${error}`);
    }
  };

  const testFavoriteOperations = async () => {
    if (!isLoggedIn || products.length === 0) {
      addLog(`❌ Please login first and ensure products are loaded`);
      return;
    }

    try {
      // Add to favorites
      await addFavoriteProductAPI(products[0].productId);
      addLog(`✅ Added "${products[0].name}" to favorites`);

      // Remove from favorites
      await deleteFavoriteProductAPI(products[0].productId);
      addLog(`✅ Removed "${products[0].name}" from favorites`);
    } catch (error) {
      addLog(`❌ Favorite operations failed: ${error}`);
    }
  };

  const clearLogs = () => {
    setTestResults([]);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setBasketItems([]);
    addLog('✅ Logged out successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">API Integration Test Dashboard</h1>
      
      {/* Auth Status */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <p className={`text-lg ${isLoggedIn ? 'text-green-600' : 'text-red-600'}`}>
          {isLoggedIn ? '✅ Logged In' : '❌ Not Logged In'}
        </p>
        <div className="mt-4 space-x-3">
          <button
            onClick={testLogin}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={isLoggedIn}
          >
            Test Login
          </button>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            disabled={!isLoggedIn}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Products (from API)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          {products.map((product) => (
            <div key={product.productId} className="border rounded-lg p-3">
              <div className="aspect-square bg-gray-200 rounded mb-2 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover rounded" />
                ) : (
                  <span className="text-gray-500 text-sm">No Image</span>
                )}
              </div>
              <h3 className="font-medium text-sm">{product.name}</h3>
              <p className="text-green-600 font-semibold">{product.price} ₺</p>
            </div>
          ))}
        </div>
        <button
          onClick={loadProducts}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Reload Products
        </button>
      </div>

      {/* API Test Buttons */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">API Tests</h2>
        <div className="space-x-3">
          <button
            onClick={testBasketOperations}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
            disabled={!isLoggedIn}
          >
            Test Basket API
          </button>
          <button
            onClick={testFavoriteOperations}
            className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
            disabled={!isLoggedIn}
          >
            Test Favorites API
          </button>
        </div>
      </div>

      {/* Basket Items */}
      {basketItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Basket Items</h2>
          <div className="space-y-3">
            {basketItems.map((item: BasketItem) => (
              <div key={item.basketItemId} className="border rounded p-3 flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity} | Price: {item.price} ₺</p>
                </div>
                <p className="font-semibold text-green-600">{item.price * item.quantity} ₺</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Results Log */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Test Results Log</h2>
          <button
            onClick={clearLogs}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-80 overflow-y-auto">
          {testResults.length === 0 ? (
            <p>No test results yet. Click the test buttons above to see results.</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default APITestPage;
