"use client";
import React, { useState } from 'react';
import { loginAPI } from '@/features/auth/api';
import { tokenManager } from '@/lib/tokenManager';
import { getBackendCartAPI } from '@/features/cart/api';

export const LoginAndTestFlow: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [testing, setTesting] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    console.log(message);
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testCompleteFlow = async () => {
    setTesting(true);
    setLogs([]);
    
    try {
      addLog('🚀 Starting complete authentication flow test...');
      
      // Step 1: Login
      addLog('📝 Step 1: Attempting login...');
      const loginResult = await loginAPI(credentials.email, credentials.password);
      
      if (!loginResult.success) {
        throw new Error(loginResult.message || 'Login failed');
      }
      
      addLog('✅ Login successful, initializing tokens...');
      
      // Step 2: Initialize tokens
      const tokenInitialized = tokenManager.initializeFromAuthResponse(loginResult);
      if (!tokenInitialized) {
        throw new Error('Token initialization failed');
      }
      
      addLog('✅ Tokens initialized successfully');
      
      // Step 3: Test token info
      const tokenInfo = tokenManager.getTokenInfo();
      addLog(`🔍 Token info: Has access token: ${tokenInfo.hasAccessToken}, Has refresh token: ${tokenInfo.hasRefreshToken}`);
      
      // Step 4: Test authenticated API call
      addLog('🔐 Step 4: Testing authenticated API call (cart)...');
      const cartResult = await getBackendCartAPI();
      addLog('✅ Authenticated API call successful!');
      addLog(`📦 Cart items: ${JSON.stringify(cartResult, null, 2)}`);
      
      addLog('🎉 Complete flow test successful!');
      
    } catch (error: unknown) {
      let errorMsg = 'Unknown error';
      if (error && typeof error === 'object' && 'message' in error) {
        errorMsg = (error as { message: string }).message;
      } else if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMsg = axiosError.response?.data?.message || 'API Error';
      }
      addLog(`❌ Test failed: ${errorMsg}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-purple-50 p-4 rounded-lg mb-4">
      <h3 className="font-bold mb-2">🧪 Complete Login & Auth Flow Test</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-2">
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          className="border p-2 rounded text-sm"
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          className="border p-2 rounded text-sm"
        />
      </div>
      
      <button
        onClick={testCompleteFlow}
        disabled={testing || !credentials.email || !credentials.password}
        className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50 mb-4"
      >
        {testing ? 'Testing Complete Flow...' : 'Test Login → JWT → API Flow'}
      </button>
      
      <div className="bg-white rounded border max-h-64 overflow-auto">
        {logs.map((log, index) => (
          <div key={index} className="px-2 py-1 text-xs border-b last:border-b-0 font-mono">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};
