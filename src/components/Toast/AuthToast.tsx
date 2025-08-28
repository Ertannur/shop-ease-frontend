"use client";
import React, { useEffect } from 'react';
import Link from 'next/link';

interface AuthToastProps {
  message: string;
  show: boolean;
  onClose: () => void;
  position?: { x: number; y: number };
}

export default function AuthToast({ message, show, onClose, position }: AuthToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000); // 4 saniye sonra otomatik kapan

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const style = position 
    ? { 
        position: 'fixed' as const,
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.max(position.y - 80, 20),
        zIndex: 9999
      }
    : {};

  return (
    <div
      style={style}
      className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm animate-in slide-in-from-top-2 duration-300"
    >
      <div className="flex items-start gap-3">
        {/* Auth Icon */}
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <p className="text-sm text-gray-800 mb-3">{message}</p>
          
          <div className="flex gap-2">
            <Link
              href="/login"
              className="bg-blue-600 text-white text-xs px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/register"
              className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded hover:bg-gray-200 transition-colors"
            >
              Kayıt Ol
            </Link>
          </div>
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
