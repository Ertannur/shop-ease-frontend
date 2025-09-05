'use client';

import React, { useEffect, useRef } from 'react';
import { useChatStore } from '@/features/chat';
import { useUserSession } from '@/hooks';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export const MessageList: React.FC = () => {
  const { messages, selectedUserId, markMessagesAsRead } = useChatStore();
  const { user } = useUserSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when component loads or selectedUserId changes
  useEffect(() => {
    if (selectedUserId) {
      markMessagesAsRead(selectedUserId);
    }
  }, [selectedUserId, markMessagesAsRead]);

  if (!selectedUserId || !user) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Konuşma seçin
      </div>
    );
  }

  // Filter messages for the selected conversation
  const conversationMessages = messages.filter(
    (message) =>
      (message.userId === user.id && message.toUserId === selectedUserId) ||
      (message.userId === selectedUserId && message.toUserId === user.id)
  );

  if (conversationMessages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
        Henüz mesaj yok. İlk mesajı gönderin!
      </div>
    );
  }

  const formatMessageTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { 
        addSuffix: true, 
        locale: tr 
      });
    } catch {
      return 'Bilinmeyen zaman';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {conversationMessages.map((message) => {
        const isOwnMessage = message.userId === user.id;
        
        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                isOwnMessage
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <div className="text-sm break-words">
                {message.message}
              </div>
              <div
                className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}
              >
                {formatMessageTime(message.createdDate)}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};
