'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/features/chat/chatStore';
import { useSignalRChat } from '@/hooks/useSignalRChat';
import { useAuthStore } from '@/features/auth';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatModel, ChatConnectionStatus, ChatMessage } from '@/Types';

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChat = ({ isOpen, onClose }: LiveChatProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Store hooks
  const { user } = useAuthStore();
  const {
    messages,
    supportUsers,
    currentChatUserId,
    isLoading,
    error,
    setCurrentChatUserId,
    fetchSupportUsers,
    fetchChats,
    sendMessage: sendApiMessage,
    addMessage,
  } = useChatStore();

  // SignalR hook
  const {
    connectionStatus,
    isConnected,
    sendMessage: sendSignalRMessage,
  } = useSignalRChat({
    userId: user?.id || null,
    onMessageReceived: (chatMessage: ChatModel) => {
      // Convert ChatModel to ChatMessage and add to store
      const message = {
        id: `${Date.now()}-${Math.random()}`, // Generate temp ID
        userId: chatMessage.userId,
        toUserId: chatMessage.toUserId,
        message: chatMessage.message,
        createdDate: chatMessage.date || new Date().toISOString(),
      };
      addMessage(message);
      setIsTyping(false);
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Initialize support users and set current chat user
  useEffect(() => {
    if (isOpen && user) {
      fetchSupportUsers().then(() => {
        // Auto-select first support user if available
        if (supportUsers.length > 0 && !currentChatUserId) {
          const supportUserId = supportUsers[0].id;
          setCurrentChatUserId(supportUserId);
          fetchChats(supportUserId);
        }
      });
    }
  }, [isOpen, user, supportUsers, currentChatUserId, fetchSupportUsers, setCurrentChatUserId, fetchChats]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChatUserId || !user) return;

    const messageData = {
      userId: user.id,
      toUserId: currentChatUserId,
      message: message.trim(),
    };

    try {
      setMessage('');
      setIsTyping(true);

      // Send via API
      await sendApiMessage(messageData);

      // Also send via SignalR for real-time delivery
      if (isConnected) {
        await sendSignalRMessage(currentChatUserId, message.trim());
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50" 
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <h3 className="font-semibold">Canlı Destek</h3>
            <span className="text-xs opacity-75">
              {connectionStatus === ChatConnectionStatus.CONNECTED ? 'Bağlı' : 'Bağlanıyor...'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {messages.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 py-8">
              <p>Henüz mesaj yok.</p>
              <p className="text-sm">Size nasıl yardımcı olabiliriz?</p>
            </div>
          )}

          {messages.map((msg: ChatMessage) => (
            <ChatMessageItem
              key={msg.id}
              message={msg}
              currentUserId={user?.id || ''}
            />
          ))}

          {isTyping && (
            <ChatMessageItem
              message={{
                id: 'typing',
                userId: '',
                toUserId: '',
                message: '',
                createdDate: new Date().toISOString()
              }}
              currentUserId={user?.id || ''}
              isTyping={true}
            />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isConnected || !currentChatUserId}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected || !currentChatUserId}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
