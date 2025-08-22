"use client";
import React, { useState } from 'react';
import { getUserByIdAPI } from '@/features/user/api';
import { tokenManager } from '@/lib/tokenManager';

export const AuthTestComponent: React.FC = () => {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  const testAuthenticatedEndpoint = async () => {
    setTesting(true);
    setTestResult('Testing...');
    
    try {
      console.log('🧪 Testing authenticated endpoint...');
      const userId = tokenManager.getUserIdFromToken();
      if (!userId) {
        throw new Error("User not logged in");
      }
      const result = await getUserByIdAPI(userId);
      setTestResult(`✅ Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error: unknown) {
      let errorMsg = 'Unknown error';
      let statusCode = 'Unknown';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
        errorMsg = axiosError.response?.data?.message || 'API Error';
        statusCode = axiosError.response?.status?.toString() || 'Unknown';
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMsg = (error as { message: string }).message;
      }
      
      setTestResult(`❌ Error: ${errorMsg} (Status: ${statusCode})`);
      console.error('🧪 Test failed:', error);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <h3 className="font-bold mb-2">🧪 JWT Authentication Test</h3>
      <button
        onClick={testAuthenticatedEndpoint}
        disabled={testing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {testing ? 'Testing...' : 'Test Authenticated Endpoint'}
      </button>
      {testResult && (
        <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-32">
          {testResult}
        </pre>
      )}
    </div>
  );
};