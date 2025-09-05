'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  ChatMessage, 
  ChatUser, 
  SupportUser, 
  ChatState, 
  ChatConnectionStatus,
  SendMessageRequest 
} from '@/Types';
import { chatApi } from './api';

interface ChatStore extends ChatState {
  // Actions
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setUsers: (users: ChatUser[]) => void;
  setSupportUsers: (supportUsers: SupportUser[]) => void;
  setCurrentChatUserId: (userId: string | null) => void;
  setConnectionStatus: (status: ChatConnectionStatus) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  
  // API Actions
  fetchChats: (toUserId: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  fetchSupportUsers: () => Promise<void>;
  sendMessage: (messageData: SendMessageRequest) => Promise<void>;
  
  // Utility Actions
  clearMessages: () => void;
  reset: () => void;
}

const initialState: ChatState = {
  messages: [],
  users: [],
  supportUsers: [],
  currentChatUserId: null,
  isConnected: false,
  isLoading: false,
  error: null,
};

export const useChatStore = create<ChatStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Basic setters
      setMessages: (messages) => set({ messages }),
      
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),

      setUsers: (users) => set({ users }),
      
      setSupportUsers: (supportUsers) => set({ supportUsers }),
      
      setCurrentChatUserId: (userId) => set({ currentChatUserId: userId }),
      
      setConnectionStatus: (status) => set({ 
        isConnected: status === ChatConnectionStatus.CONNECTED 
      }),
      
      setIsLoading: (isLoading) => set({ isLoading }),
      
      setError: (error) => set({ error }),

      // API Actions
      fetchChats: async (toUserId: string) => {
        set({ isLoading: true, error: null });
        try {
          const messages = await chatApi.getChats(toUserId);
          set({ messages, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch chats';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      fetchUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const users = await chatApi.getUsers();
          set({ users, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch users';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      fetchSupportUsers: async () => {
        set({ isLoading: true, error: null });
        try {
          const supportUsers = await chatApi.getSupport();
          set({ supportUsers, isLoading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch support users';
          set({ error: errorMessage, isLoading: false });
          throw error;
        }
      },

      sendMessage: async (messageData: SendMessageRequest) => {
        set({ error: null });
        try {
          await chatApi.sendMessage(messageData);
          // Note: We don't add the message to local state here
          // as it should come back through SignalR
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Utility Actions
      clearMessages: () => set({ messages: [] }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'chat-store',
    }
  )
);
