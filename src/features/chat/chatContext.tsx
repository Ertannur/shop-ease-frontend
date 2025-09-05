"use client";

import { createContext, useContext, useReducer, useCallback, useMemo, useEffect } from 'react';
import { chatApi, handleChatApiError } from './api';
import { 
  type ChatState, 
  type ChatMessage, 
  type ChatUser,
  type SendMessageRequest,
  type UserRole,
  type ChatModel,
  type ConnectionState
} from '@/Types';
import { useAuthStore } from '@/features/auth/authStore';

// SignalR bağımlılığını dinamik olarak yükleyeceğiz
interface SignalRHook {
  connectionState: ConnectionState;
  lastMessage: ChatModel | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (toUserId: string, message: string) => Promise<void>;
  connectUser: (userId: string) => Promise<void>;
  isConnected: boolean;
}

// Chat Context Value Interface
export interface ChatContextValue {
  state: ChatState;
  sendMessage: (toUserId: string, message: string) => Promise<void>;
  loadChats: (toUserId: string) => Promise<void>;
  loadAvailableUsers: () => Promise<void>;
  loadSupportUsers: () => Promise<void>;
  setCurrentChatUser: (userId: string | null) => void;
  clearError: () => void;
  isSignalRConnected: boolean;
}

// Initial State
const initialState: ChatState = {
  messages: [],
  users: [],
  supportUsers: [],
  selectedUserId: null,
  unreadMessages: {},
  isConnected: false,
  currentUserId: null,
  isLoading: false,
  error: null,
};

// Actions
type ChatAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_MESSAGES'; payload: ChatMessage[] }
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_USERS'; payload: ChatUser[] }
  | { type: 'SET_SUPPORT_USERS'; payload: ChatUser[] }
  | { type: 'SET_SELECTED_USER_ID'; payload: string | null }
  | { type: 'SET_CURRENT_USER_ID'; payload: string | null }
  | { type: 'SET_CONNECTED'; payload: boolean }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'UPDATE_UNREAD_COUNT'; payload: { userId: string; count: number } };

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload, isLoading: false };
    case 'ADD_MESSAGE':
      return { 
        ...state, 
        messages: [...state.messages, action.payload],
        isLoading: false 
      };
    case 'SET_USERS':
      return { ...state, users: action.payload, isLoading: false };
    case 'SET_SUPPORT_USERS':
      return { ...state, supportUsers: action.payload, isLoading: false };
    case 'SET_SELECTED_USER_ID':
      return { ...state, selectedUserId: action.payload };
    case 'SET_CURRENT_USER_ID':
      return { ...state, currentUserId: action.payload };
    case 'SET_CONNECTED':
      return { ...state, isConnected: action.payload };
    case 'CLEAR_MESSAGES':
      return { ...state, messages: [] };
    case 'UPDATE_UNREAD_COUNT':
      return { 
        ...state, 
        unreadMessages: {
          ...state.unreadMessages,
          [action.payload.userId]: action.payload.count
        }
      };
    default:
      return state;
  }
};

// Context
const ChatContext = createContext<ChatContextValue | undefined>(undefined);

// Provider
export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { user } = useAuthStore();

  // Mock SignalR hook - gerçek SignalR implement edilecek
  const signalRHook = useMemo(() => ({
    connectionState: 'Disconnected' as ConnectionState,
    lastMessage: null as ChatModel | null,
    error: null as string | null,
    connect: async () => { console.log('SignalR connect called'); },
    disconnect: async () => { console.log('SignalR disconnect called'); },
    sendMessage: async (toUserId: string, message: string) => { 
      console.log('SignalR sendMessage called:', { toUserId, message }); 
    },
    connectUser: async (userId: string) => { 
      console.log('SignalR connectUser called:', userId); 
    },
    isConnected: false
  }), []);

  const { 
    lastMessage, 
    connectUser,
    error: signalRError 
  } = signalRHook;

  // User role check
  const userRole = useMemo((): UserRole | null => {
    if (!user?.roles || !Array.isArray(user.roles)) return null;
    if (user.roles.includes('Admin')) return 'Admin';
    if (user.roles.includes('Support')) return 'Support';
    if (user.roles.includes('User')) return 'User';
    return null;
  }, [user?.roles]);

  // Set current user when user changes
  useEffect(() => {
    if (user?.id) {
      dispatch({ type: 'SET_CURRENT_USER_ID', payload: user.id });
    }
  }, [user?.id]);

  // Connect SignalR user when connected and user is available
  useEffect(() => {
    if (signalRHook.isConnected && user?.id) {
      connectUser(user.id).catch((error: unknown) => {
        console.warn('Failed to connect user to SignalR hub:', error);
      });
    }
  }, [signalRHook.isConnected, user?.id, connectUser]);

  // Handle incoming SignalR messages
  useEffect(() => {
    if (lastMessage) {
      console.log('Processing SignalR message:', lastMessage);
      
      // Transform ChatModel to ChatMessage
      const chatMessage: ChatMessage = {
        id: `signalr-${Date.now()}`,
        userId: lastMessage.userId,
        toUserId: lastMessage.toUserId,
        message: lastMessage.message,
        createdDate: lastMessage.date || new Date().toISOString(),
      };

      // Only add to current chat if it's relevant
      if (state.selectedUserId && 
          (lastMessage.userId === state.selectedUserId || lastMessage.toUserId === state.selectedUserId)) {
        dispatch({ type: 'ADD_MESSAGE', payload: chatMessage });
      }

      // Update unread count if message is not from current user and not in current chat
      if (lastMessage.userId !== user?.id && lastMessage.userId !== state.selectedUserId) {
        dispatch({ 
          type: 'UPDATE_UNREAD_COUNT', 
          payload: { 
            userId: lastMessage.userId, 
            count: (state.unreadMessages[lastMessage.userId] || 0) + 1 
          }
        });
      }
    }
  }, [lastMessage, state.selectedUserId, user?.id, state.unreadMessages]);

  // Handle SignalR errors
  useEffect(() => {
    if (signalRError) {
      dispatch({ type: 'SET_ERROR', payload: `SignalR Error: ${signalRError}` });
    }
  }, [signalRError]);

  // Load chats for specific user
  const loadChats = useCallback(async (toUserId: string) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('Loading chats for user:', toUserId);
      const messages = await chatApi.getChats(toUserId);
      dispatch({ type: 'SET_MESSAGES', payload: messages });
      dispatch({ type: 'SET_SELECTED_USER_ID', payload: toUserId });
      
      // Clear unread count for this user
      dispatch({ type: 'UPDATE_UNREAD_COUNT', payload: { userId: toUserId, count: 0 } });
    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user]);

  // Load available users (for Admin/Support)
  const loadAvailableUsers = useCallback(async () => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    // Sadece Admin ve Support kullanıcıları tüm kullanıcıları görebilir
    const canSeeAllUsers = userRole === 'Admin' || userRole === 'Support';
    if (!canSeeAllUsers) {
      dispatch({ type: 'SET_ERROR', payload: 'Access denied - Insufficient permissions' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('Loading available users for role:', userRole);
      const users = await chatApi.getUsers();
      dispatch({ type: 'SET_USERS', payload: users });
    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user, userRole]);

  // Load support users (for regular Users)
  const loadSupportUsers = useCallback(async () => {
    console.log('=== loadSupportUsers called ===');
    
    if (!user) {
      console.error('❌ User not authenticated');
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    console.log('User info:', { id: user.id, email: user.email, roles: user.roles, userRole });

    // Sadece User rolü support kullanıcılarını görebilir
    const isRegularUser = userRole === 'User';
    
    console.log('Is regular user?', isRegularUser);
    
    if (!isRegularUser) {
      console.error('❌ Access denied - not a regular user');
      dispatch({ type: 'SET_ERROR', payload: 'Access denied - Only regular users can access support' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      console.log('🔄 Calling chatApi.getSupport()...');
      const supportUsers = await chatApi.getSupport();
      console.log('✅ Support users loaded:', supportUsers);
      
      dispatch({ type: 'SET_SUPPORT_USERS', payload: supportUsers });
    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user, userRole]);

  // Send message
  const sendMessage = useCallback(async (toUserId: string, message: string) => {
    if (!user) {
      dispatch({ type: 'SET_ERROR', payload: 'User not authenticated' });
      return;
    }

    if (!message.trim()) {
      dispatch({ type: 'SET_ERROR', payload: 'Message cannot be empty' });
      return;
    }

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const messageData: SendMessageRequest = {
        userId: user.id,
        toUserId: toUserId,
        message: message.trim(),
      };

      // Debug log
      console.log('Sending message with data:', messageData);
      console.log('Current user:', { 
        id: user.id, 
        email: user.email, 
        roles: user.roles 
      });

      // Send via REST API
      await chatApi.sendMessage(messageData);

      // Optimistic update - mesajı hemen ekle
      const newMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        userId: user.id,
        toUserId: toUserId,
        message: message.trim(),
        createdDate: new Date().toISOString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: newMessage });

      // Mesajları yeniden yükle (biraz gecikmeyle)
      setTimeout(() => {
        loadChats(toUserId);
      }, 500);

    } catch (error) {
      const apiError = handleChatApiError(error);
      dispatch({ type: 'SET_ERROR', payload: apiError.message });
    }
  }, [user, loadChats]);

  // Set current chat user
  const setCurrentChatUser = useCallback((userId: string | null) => {
    dispatch({ type: 'SET_SELECTED_USER_ID', payload: userId });
    if (!userId) {
      dispatch({ type: 'CLEAR_MESSAGES' });
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  const value = useMemo<ChatContextValue>(() => ({
    state,
    sendMessage,
    loadChats,
    loadAvailableUsers,
    loadSupportUsers,
    setCurrentChatUser,
    clearError,
    isSignalRConnected: signalRHook.isConnected,
  }), [
    state,
    sendMessage,
    loadChats,
    loadAvailableUsers,
    loadSupportUsers,
    setCurrentChatUser,
    clearError,
    signalRHook.isConnected,
  ]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

// Custom Hook
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
