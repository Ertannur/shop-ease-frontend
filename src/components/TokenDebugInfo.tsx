"use client";
import React, { useState, useEffect } from 'react';
import { tokenManager } from '@/lib/tokenManager';

export const TokenDebugInfo: React.FC = () => {
  const [tokenInfo, setTokenInfo] = useState({
    hasAccessToken: false,
    hasRefreshToken: false,
    isExpired: true,
    tokenType: null,
    expiresAt: null,
  });
  
  useEffect(() => {
    const updateTokenInfo = () => {
      setTokenInfo(tokenManager.getTokenInfo());
    };

    updateTokenInfo(); // Initial update
    const interval = setInterval(updateTokenInfo, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg text-xs font-mono">
      <h3 className="font-bold mb-2">🔐 Token Debug Info</h3>
      <div className="space-y-1">
        <div>Access Token: {tokenInfo.hasAccessToken ? '✅' : '❌'}</div>
        <div>Refresh Token: {tokenInfo.hasRefreshToken ? '✅' : '❌'}</div>
        <div>Is Expired: {tokenInfo.isExpired ? '⚠️ Yes' : '✅ No'}</div>
        <div>Token Type: {tokenInfo.tokenType || 'None'}</div>
        <div>Expires At: {tokenInfo.expiresAt ? new Date(tokenInfo.expiresAt).toLocaleString() : 'Unknown'}</div>
      </div>
    </div>
  );
};
