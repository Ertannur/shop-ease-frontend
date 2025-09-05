'use client';

import React, { useState, useEffect } from 'react';
import { useChatStore } from '@/features/chat';
import { useUserSession } from '@/hooks';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserDropdown } from './UserDropdown';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { user } = useUserSession();
  
  const {
    initializeChat,
    loadUsers,
    loadSupport,
    selectedUserId,
    supportUsers,
    selectUser,
    unreadMessages,
    isConnected,
    disconnect,
  } = useChatStore();

  // Get total unread count
  const totalUnreadCount = Object.values(unreadMessages).reduce((sum, count) => sum + count, 0);

  useEffect(() => {
    if (user?.id && !isInitialized) {
      initializeChat(user.id).then(() => {
        setIsInitialized(true);
        
        // Load appropriate user list based on role
        if (user.roles?.includes('Support') || user.roles?.includes('Admin')) {
          loadUsers();
        } else {
          loadSupport();
        }
      });
    }

    // Cleanup on unmount
    return () => {
      if (isInitialized) {
        disconnect();
      }
    };
  }, [user?.id, user?.roles, isInitialized, initializeChat, loadUsers, loadSupport, disconnect]);

  // Auto-select support user for regular users
  useEffect(() => {
    if (!user?.roles?.includes('Support') && !user?.roles?.includes('Admin') && 
        supportUsers.length > 0 && !selectedUserId) {
      selectUser(supportUsers[0].id);
    }
  }, [supportUsers, selectedUserId, user?.roles, selectUser]);

  if (!user) {
    return null;
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className="relative bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-colors duration-200"
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
        
        {/* Unread Messages Badge */}
        {totalUnreadCount > 0 && !isOpen && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        )}
        
        {/* Connection Status Indicator */}
        <div className={`absolute -top-1 -left-1 h-3 w-3 rounded-full ${
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
              <h3 className="font-medium">
                {user.roles?.includes('Support') || user.roles?.includes('Admin') ? 'Müşteri Desteği' : 'Canlı Destek'}
              </h3>
            </div>
            <div className={`h-2 w-2 rounded-full ${
              isConnected ? 'bg-green-400' : 'bg-red-400'
            }`} />
          </div>

          {/* User Selection Dropdown (for support/admin) */}
          {(user.roles?.includes('Support') || user.roles?.includes('Admin')) && (
            <div className="p-3 border-b border-gray-200">
              <UserDropdown />
            </div>
          )}

          {/* Chat Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {selectedUserId ? (
              <>
                <MessageList />
                <MessageInput />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
                {user.roles?.includes('Support') || user.roles?.includes('Admin') 
                  ? 'Konuşmak için bir kullanıcı seçin'
                  : 'Müşteri hizmetleri ile bağlantı kuruluyor...'
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
