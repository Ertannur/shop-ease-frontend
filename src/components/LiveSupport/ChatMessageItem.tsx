'use client';

import { ChatMessage } from '@/Types';
import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ChatMessageItemProps {
  message: ChatMessage;
  currentUserId: string;
  isTyping?: boolean;
}

export const ChatMessageItem = ({ 
  message, 
  currentUserId, 
  isTyping = false 
}: ChatMessageItemProps) => {
  const [isMounted, setIsMounted] = useState(false);
  
  // Hydration mismatch'i önlemek için
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isOwn = message.userId === currentUserId;
  
  const formatTime = (dateString: string) => {
    if (!isMounted) return 'Şimdi'; // SSR sırasında sabit değer döndür
    
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: tr 
      });
    } catch {
      return 'Şimdi';
    }
  };

  if (isTyping) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm font-medium">D</span>
        </div>
        <div className="bg-gray-100 rounded-lg px-4 py-2 max-w-xs">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isOwn ? 'bg-blue-500' : 'bg-gray-300'
      }`}>
        <span className={`text-sm font-medium ${isOwn ? 'text-white' : 'text-gray-600'}`}>
          {isOwn ? 'S' : 'D'}
        </span>
      </div>

      {/* Message Content */}
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'text-right' : ''}`}>
        <div className={`rounded-lg px-4 py-2 ${
          isOwn 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.message}
          </p>
        </div>
        
        {/* Timestamp */}
        <p className={`text-xs text-gray-500 mt-1 ${isOwn ? 'text-right' : 'text-left'}`}>
          {formatTime(message.createdDate)}
        </p>
      </div>
    </div>
  );
};
