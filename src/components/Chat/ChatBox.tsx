'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useUserSession } from '@/hooks';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { UserDropdown } from './UserDropdown';
import { ChatBubbleLeftRightIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { SupportUser, ChatUser } from '@/Types/Chat';

type ChatStore = {
  initializeChat: (userId: string) => Promise<void>;
  loadUsers: () => Promise<void>;
  loadSupport: () => Promise<void>;
  selectedUserId: string | null;
  supportUsers: SupportUser[];
  users: ChatUser[];
  selectUser: (userId: string) => void;
  unreadMessages: Record<string, number>;
  isConnected: boolean;
  disconnect: () => Promise<void>;
};

export const ChatBox: React.FC = () => {
  const { user } = useUserSession();
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [chatStore, setChatStore] = useState<ChatStore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs for stable references
  const mounted = useRef(true);
  const cleanupRef = useRef<(() => void) | null>(null);
  const storeRef = useRef<typeof import('@/features/chat').useChatStore | null>(null);

  // Get total unread count safely with memoization - moved before early return
  const totalUnreadCount = React.useMemo(() => {
    if (!chatStore?.unreadMessages) return 0;
    return Object.values(chatStore.unreadMessages).reduce<number>(
      (sum, count) => sum + (typeof count === 'number' ? count : 0), 
      0
    );
  }, [chatStore?.unreadMessages]);

  // Load chat store only once
  useEffect(() => {
    if (storeRef.current) return; // Prevent multiple loads
    
    const loadChatStore = async () => {
      try {
        const { useChatStore } = await import('@/features/chat');
        
        if (!mounted.current) return;
        
        storeRef.current = useChatStore;
        const initialState = useChatStore.getState();
        setChatStore(initialState);
        
        // Subscribe with stable reference
        const unsubscribe = useChatStore.subscribe((newState) => {
          if (mounted.current) {
            setChatStore(prevState => {
              // Only update if actually different
              if (!prevState || 
                  prevState.selectedUserId !== newState.selectedUserId ||
                  prevState.isConnected !== newState.isConnected ||
                  JSON.stringify(prevState.unreadMessages) !== JSON.stringify(newState.unreadMessages)) {
                return newState;
              }
              return prevState;
            });
          }
        });
        
        cleanupRef.current = unsubscribe;
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load chat store:', error);
        if (mounted.current) setIsLoading(false);
      }
    };
    
    loadChatStore();
  }, []); // Empty dependency array - run only once

  // Initialize chat only when conditions are met
  const initializeChat = useCallback(async () => {
    if (!chatStore || !user?.id || isInitialized || isLoading) return;
    
    try {
      setIsInitialized(true);
      await chatStore.initializeChat(user.id);
      
      // Load appropriate user list based on role
      if (user.roles?.includes('Support') || user.roles?.includes('Admin')) {
        await chatStore.loadUsers();
      } else {
        await chatStore.loadSupport();
      }
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      if (mounted.current) setIsInitialized(false);
    }
  }, [chatStore, user?.id, user?.roles, isInitialized, isLoading]);

  // Run initialization when dependencies change
  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  // Auto-select support user for regular users - run only when needed
  useEffect(() => {
    if (!chatStore || !isInitialized || chatStore.selectedUserId) return;
    
    const isRegularUser = !user?.roles?.includes('Support') && !user?.roles?.includes('Admin');
    const hasSupportUsers = chatStore.supportUsers?.length > 0;
    
    if (isRegularUser && hasSupportUsers) {
      try {
        chatStore.selectUser(chatStore.supportUsers[0].id);
      } catch (error) {
        console.error('Failed to select support user:', error);
      }
    }
  }, [chatStore, isInitialized, user?.roles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mounted.current = false;
      if (cleanupRef.current) {
        try {
          cleanupRef.current();
        } catch (error) {
          console.error('Cleanup error:', error);
        }
        cleanupRef.current = null;
      }
    };
  }, []); // Only cleanup function - no dependencies needed

  // Early return if not ready
  if (!user || isLoading || !chatStore) {
    return null;
  }

  const toggleChat = () => {
    setIsOpen(prev => !prev);
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
          chatStore?.isConnected ? 'bg-green-500' : 'bg-red-500'
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
              chatStore?.isConnected ? 'bg-green-400' : 'bg-red-400'
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
            {chatStore?.selectedUserId ? (
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
