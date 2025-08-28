"use client";
import React, { useState } from 'react';
import { getUserByIdAPI } from '@/features/user/api';
import { getBackendCartAPI, addToBackendCartAPI } from '@/features/cart/api';
import { addToFavoritesAPI, removeFromFavoritesAPI } from '@/features/favorites/api';
import { getUserAddressAPI, addAddressAPI } from '@/features/address/api';
import { listCurrentUserOrdersAPI } from '@/features/order/api';
import { tokenManager } from '@/lib/tokenManager';

export const ComprehensiveAPITest: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<Record<string, string>>({});

  const testAPI = async (name: string, testFunction: () => Promise<unknown>) => {
    try {
      setResults(prev => ({ ...prev, [name]: 'Testing...' }));
      const result = await testFunction();
      setResults(prev => ({ ...prev, [name]: `✅ Success: ${JSON.stringify(result, null, 2)}` }));
    } catch (error: unknown) {
      let errorMsg = 'Unknown error';
      let status = 'Unknown';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        errorMsg = axiosError.response?.data?.message || 'API Error';
        status = axiosError.response?.status?.toString() || 'Unknown';
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMsg = (error as { message: string }).message;
      }
      
      setResults(prev => ({ ...prev, [name]: `❌ Error: ${errorMsg} (Status: ${status})` }));
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setResults({});

    // Test User Profile
    await testAPI('User Profile', async () => {
      const userId = tokenManager.getUserIdFromToken();
      if (!userId) {
        throw new Error("User not logged in");
      }
      return await getUserByIdAPI(userId);
    });

    // Test Cart API
    await testAPI('Get Cart', async () => {
      return await getBackendCartAPI();
    });

    // Test Add to Cart
    await testAPI('Add to Cart', async () => {
      return await addToBackendCartAPI({
        productId: "test-product-id",
        quantity: 1
      });
    });

    // Test Favorites
    await testAPI('Add to Favorites', async () => {
      return await addToFavoritesAPI("test-product-id");
    });

    // Test Remove from Favorites
    await testAPI('Remove from Favorites', async () => {
      return await removeFromFavoritesAPI("test-product-id");
    });

    // Test Addresses
    await testAPI('Get Addresses', async () => {
      return await getUserAddressAPI();
    });

    // Test Add Address
    await testAPI('Add Address', async () => {
      return await addAddressAPI({
        title: "Test Address",
        name: "Test",
        surname: "User",
        email: "test@example.com",
        phone: "05050505050",
        address: "Test Street 123",
        city: "Test City",
        district: "Test District",
        postCode: "12345"
      });
    });

    // Test Orders
    await testAPI('Get Orders', async () => {
      return await listCurrentUserOrdersAPI();
    });

    setTesting(false);
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg mb-4">
      <h3 className="font-bold mb-2">🔬 Comprehensive Backend API Test</h3>
      <button
        onClick={runAllTests}
        disabled={testing}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50 mb-4"
      >
        {testing ? 'Testing All APIs...' : 'Test All Backend APIs'}
      </button>
      
      <div className="space-y-2">
        {Object.entries(results).map(([testName, result]) => (
          <div key={testName} className="bg-white p-2 rounded border">
            <div className="font-semibold text-sm">{testName}</div>
            <pre className="text-xs bg-gray-50 p-1 rounded mt-1 overflow-auto max-h-20">
              {result}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};