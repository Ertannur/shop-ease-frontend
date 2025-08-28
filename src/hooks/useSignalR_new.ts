import { useState, useEffect, useCallback, useRef } from 'react';
import { signalRService, ChatModel, ChatUser } from '@/lib/signalRConnection';

// Updated state interface for new chat system
export interface ChatState {
  isConnected: boolean;
  isConnecting: boolean;
  messages: ChatModel[];
  currentChatUser: ChatUser | null;
  availableUsers: ChatUser[];
  unreadCount: number;
  isTyping: boolean;
  currentUserId: string | null;
}

export const useSignalR = () => {
  const [state, setState] = useState<ChatState>({
    isConnected: false,
    isConnecting: false,
    messages: [],
    currentChatUser: null,
    availableUsers: [],
    unreadCount: 0,
    isTyping: false,
    currentUserId: null
  });

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get current user info from token or localStorage
  const getCurrentUserInfo = useCallback(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decode JWT token to get user ID
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userId = payload.sub || payload.userId;
          return userId;
        } catch (error) {
          console.error('Error decoding token:', error);
          return null;
        }
      }
    }
    return null;
  }, []);

  // Initialize SignalR connection
  const connect = useCallback(async () => {
    if (state.isConnected || state.isConnecting) return;
    
    setState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      const userId = getCurrentUserInfo();
      if (!userId) {
        throw new Error('No user ID available - user must be logged in');
      }

      // Start SignalR connection
      await signalRService.startConnection();
      
      // Connect user to chat hub
      await signalRService.connectUser(userId);
      
      setState(prev => ({ 
        ...prev, 
        isConnected: true, 
        isConnecting: false, 
        currentUserId: userId 
      }));
      
      // Setup message listeners
      signalRService.onReceiveMessages((chatMessage: ChatModel) => {
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, chatMessage],
          unreadCount: prev.unreadCount + 1
        }));
      });

      // Load available users based on user role
      await loadAvailableUsers();
      
    } catch (error) {
      console.error('SignalR connection error:', error);
      setState(prev => ({ ...prev, isConnecting: false }));
      throw error;
    }
  }, [state.isConnected, state.isConnecting, getCurrentUserInfo]);

  // Load available users for chat (support users for regular users, all users for support/admin)
  const loadAvailableUsers = useCallback(async () => {
    try {
      // Try to get support users first (for regular users)
      let users = await signalRService.getSupportUsers();
      
      // If empty or user has support/admin role, get all users
      if (users.length === 0) {
        try {
          users = await signalRService.getAllUsers();
        } catch (error) {
          console.log('User does not have access to all users - showing support users only');
        }
      }

      setState(prev => ({ ...prev, availableUsers: users }));
    } catch (error) {
      console.error('Error loading available users:', error);
    }
  }, []);

  // Start chat with a specific user
  const startChatWith = useCallback(async (user: ChatUser) => {
    try {
      setState(prev => ({ ...prev, currentChatUser: user, messages: [] }));
      
      // Load chat history
      const messages = await signalRService.getChatMessages(user.id);
      setState(prev => ({ ...prev, messages }));
      
    } catch (error) {
      console.error('Error starting chat:', error);
      throw error;
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (message: string) => {
    if (!state.currentChatUser || !state.isConnected) {
      throw new Error('Not connected or no chat user selected');
    }

    try {
      await signalRService.sendMessage(state.currentChatUser.id, message);
      
      // Add message to local state (will also be received via SignalR)
      const currentUserId = signalRService.getCurrentUserId();
      if (currentUserId) {
        const newMessage: ChatModel = {
          userId: currentUserId,
          toUserId: state.currentChatUser.id,
          message,
          createdDate: new Date().toISOString()
        };
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage]
        }));
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }, [state.currentChatUser, state.isConnected]);

  // Set typing indicator
  const setTyping = useCallback((isTyping: boolean) => {
    setState(prev => ({ ...prev, isTyping }));
    
    if (isTyping) {
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set timeout to stop typing after 3 seconds
      typingTimeoutRef.current = setTimeout(() => {
        setState(prev => ({ ...prev, isTyping: false }));
      }, 3000);
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(async () => {
    try {
      await signalRService.stopConnection();
      setState({
        isConnected: false,
        isConnecting: false,
        messages: [],
        currentChatUser: null,
        availableUsers: [],
        unreadCount: 0,
        isTyping: false,
        currentUserId: null
      });
    } catch (error) {
      console.error('Error disconnecting:', error);
    }
  }, []);

  // Mark messages as read
  const markAsRead = useCallback(() => {
    setState(prev => ({ ...prev, unreadCount: 0 }));
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    isConnected: state.isConnected,
    isConnecting: state.isConnecting,
    messages: state.messages,
    currentChatUser: state.currentChatUser,
    availableUsers: state.availableUsers,
    unreadCount: state.unreadCount,
    isTyping: state.isTyping,
    currentUserId: state.currentUserId,
    
    // Actions
    connect,
    disconnect,
    startChatWith,
    sendMessage,
    setTyping,
    markAsRead,
    loadAvailableUsers
  };
};
