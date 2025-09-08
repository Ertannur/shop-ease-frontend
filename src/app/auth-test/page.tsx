"use client";
import React, { useState } from 'react';
import { loginAPI, registerAPI, forgotPasswordAPI, resetPasswordAPI, refreshTokenAPI } from '@/features/auth/api';
import { tokenManager } from '@/lib/tokenManager';

export default function AuthTestPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLogin = async () => {
    try {
      addResult('🔄 Testing Login...');
      const response = await loginAPI('test@example.com', 'TestPassword123!');
      addResult(`✅ Login Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      addResult(`❌ Login Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testRegister = async () => {
    try {
      addResult('🔄 Testing Register...');
      const response = await registerAPI({
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '05551234567',
        email: 'testuser@example.com',
        password: 'TestPassword123!',
        dateOfBirth: '1990-01-01',
        gender: 0
      });
      addResult(`✅ Register Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      addResult(`❌ Register Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testForgotPassword = async () => {
    try {
      addResult('🔄 Testing Forgot Password...');
      const response = await forgotPasswordAPI('test@example.com');
      addResult(`✅ Forgot Password Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      addResult(`❌ Forgot Password Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testResetPassword = async () => {
    try {
      addResult('🔄 Testing Reset Password...');
      const response = await resetPasswordAPI({
        email: 'test@example.com',
        newPassword: 'NewPassword123!',
        token: 'dummy-reset-token'
      });
      addResult(`✅ Reset Password Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      addResult(`❌ Reset Password Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testRefreshToken = async () => {
    try {
      addResult('🔄 Testing Refresh Token...');
      
      // Get current refresh token from tokenManager
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) {
        addResult('❌ No refresh token available. Please login first.');
        return;
      }
      
      const response = await refreshTokenAPI(refreshToken);
      addResult(`✅ Refresh Token Success: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      addResult(`❌ Refresh Token Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testTokenManager = () => {
    try {
      addResult('🔄 Testing Token Manager...');
      const tokenInfo = tokenManager.getTokenInfo();
      addResult(`📋 Token Info: ${JSON.stringify(tokenInfo, null, 2)}`);
      
      const userId = tokenManager.getUserIdFromToken();
      addResult(`👤 User ID from Token: ${userId}`);
      
      const hasValidTokens = tokenManager.hasValidTokens();
      addResult(`🔒 Has Valid Tokens: ${hasValidTokens}`);
      
      const isExpired = tokenManager.isTokenExpired();
      addResult(`⏰ Is Token Expired: ${isExpired}`);
    } catch (error) {
      addResult(`❌ Token Manager Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);
    
    addResult('🚀 Starting comprehensive auth tests...');
    
    await testLogin();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testRegister();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testForgotPassword();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testResetPassword();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await testRefreshToken();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    testTokenManager();
    
    addResult('✅ All tests completed!');
    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Auth API Test Page</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={testLogin}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Login
        </button>
        
        <button
          onClick={testRegister}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Register
        </button>
        
        <button
          onClick={testForgotPassword}
          disabled={loading}
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50"
        >
          Test Forgot Password
        </button>
        
        <button
          onClick={testResetPassword}
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
        >
          Test Reset Password
        </button>
        
        <button
          onClick={testRefreshToken}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
        >
          Test Refresh Token
        </button>
        
        <button
          onClick={testTokenManager}
          disabled={loading}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50"
        >
          Test Token Manager
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={runAllTests}
          disabled={loading}
          className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 disabled:opacity-50 font-bold"
        >
          {loading ? 'Running Tests...' : 'Run All Tests'}
        </button>
        
        <button
          onClick={clearResults}
          disabled={loading}
          className="bg-gray-400 text-white px-6 py-3 rounded hover:bg-gray-500 disabled:opacity-50"
        >
          Clear Results
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Test Results:</h2>
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {results.length === 0 ? (
            <p>No tests run yet. Click a test button to start.</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className="mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">📋 Auth Endpoints Status:</h3>
        <ul className="space-y-1 text-sm">
          <li>✅ <strong>Login:</strong> /api/Auth/Login - Implemented with user data handling</li>
          <li>✅ <strong>Register:</strong> /api/Auth/Register - Implemented with validation</li>
          <li>✅ <strong>Refresh Token:</strong> /api/Auth/RefreshTokenLogin - Implemented with tokenManager</li>
          <li>✅ <strong>Forgot Password:</strong> /api/Auth/ForgotPassword - Implemented with UI page</li>
          <li>✅ <strong>Reset Password:</strong> /api/Auth/ResetPassword - Implemented with UI page</li>
          <li>✅ <strong>Token Management:</strong> Automatic refresh, storage, and validation</li>
        </ul>
      </div>
      
      <div className="mt-4 bg-green-50 p-4 rounded-lg">
        <h3 className="text-lg font-bold mb-2">🗂️ Available Pages:</h3>
        <ul className="space-y-1 text-sm">
          <li>📄 <strong>/login</strong> - Login page with forgot password link</li>
          <li>📄 <strong>/register</strong> - Registration page with validation</li>
          <li>📄 <strong>/forgot-password</strong> - Forgot password request page</li>
          <li>📄 <strong>/reset-password</strong> - Reset password with token page</li>
          <li>📄 <strong>/account</strong> - User account page (requires auth)</li>
        </ul>
      </div>
    </div>
  );
}
