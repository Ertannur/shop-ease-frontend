'use client';

import { useState } from 'react';

interface SupportButtonProps {
  onClick: () => void;
  isOnline?: boolean;
  className?: string;
}

export const SupportButton = ({ 
  onClick, 
  isOnline = false, 
  className = '' 
}: SupportButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed bottom-6 right-6 z-50
        w-16 h-16 
        bg-blue-600 hover:bg-blue-700 
        text-white rounded-full 
        shadow-lg hover:shadow-xl
        transition-all duration-300 ease-in-out
        flex items-center justify-center
        group
        ${isHovered ? 'scale-110' : 'scale-100'}
        ${className}
      `}
      aria-label="Canlı Destek"
    >
      {/* Chat Icon */}
      <svg 
        className="w-8 h-8 transition-transform duration-300" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
        />
      </svg>

      {/* Online Status Indicator */}
      {isOnline && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white">
          <div className="w-full h-full bg-green-500 rounded-full animate-ping opacity-75"></div>
        </div>
      )}

      {/* Hover Tooltip */}
      {isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap">
          Canlı Destek
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
        </div>
      )}
    </button>
  );
};
