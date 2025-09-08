'use client';

import React, { useState } from 'react';
import { useChatStore } from '@/features/chat';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { selectedUserId, sendMessage } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedUserId || isSending) {
      return;
    }

    setIsSending(true);
    
    try {
      await sendMessage(selectedUserId, message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You could add a toast notification here
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!selectedUserId) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 p-3">
      <form onSubmit={handleSubmit} className="flex items-end space-x-2">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesajınızı yazın..."
            className="w-full p-2 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            rows={1}
            style={{ minHeight: '36px', maxHeight: '100px' }}
            disabled={isSending}
          />
        </div>
        
        <button
          type="submit"
          disabled={!message.trim() || isSending}
          className={`p-2 rounded-md transition-colors ${
            message.trim() && !isSending
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSending ? (
            <div className="h-5 w-5 animate-spin border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <PaperAirplaneIcon className="h-5 w-5" />
          )}
        </button>
      </form>
    </div>
  );
};
