import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ChatState, ChatMessage, ChatModel } from "@/Types";
import { chatApi } from "./api";

interface ChatStore extends ChatState {
  // Actions
  initializeChat: (userId: string) => Promise<void>;
  loadUsers: () => Promise<void>;
  loadSupport: () => Promise<void>;
  loadMessages: (toUserId: string) => Promise<void>;
  sendMessage: (toUserId: string, message: string) => Promise<void>;
  selectUser: (userId: string) => void;
  markMessagesAsRead: (fromUserId: string) => void;
  addIncomingMessage: (message: ChatModel) => void;
  incrementUnreadCount: (fromUserId: string) => void;
  disconnect: () => Promise<void>;
}

// Helper function to get user-specific localStorage key
const getUserSpecificKey = (baseKey: string): string => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userId = payload.sub || payload.id || "anonymous";
        return `${baseKey}-${userId}`;
      } catch {
        return `${baseKey}-anonymous`;
      }
    }
  }
  return `${baseKey}-anonymous`;
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      // Initial state
      messages: [],
      users: [],
      supportUsers: [],
      selectedUserId: null,
      unreadMessages: {},
      isConnected: false,
      currentUserId: null,
      isLoading: false,
      error: null,

      // Actions
      initializeChat: async (userId: string) => {
        try {
          set({ currentUserId: userId });
          
          // Mock SignalR connection - gerçek implementasyon için
          console.log('Mock SignalR connecting for user:', userId);
          set({ isConnected: true });

        } catch (error) {
          console.error("Failed to initialize chat:", error);
          set({ isConnected: false });
        }
      },

      loadUsers: async () => {
        try {
          const users = await chatApi.getUsers();
          set({ users: users || [] });
        } catch (error) {
          console.error("Failed to load users:", error);
          set({ users: [] });
        }
      },

      loadSupport: async () => {
        try {
          const supportUsers = await chatApi.getSupport();
          set({ supportUsers: supportUsers || [] });
        } catch (error) {
          console.error("Failed to load support users:", error);
          set({ supportUsers: [] });
        }
      },

      loadMessages: async (toUserId: string) => {
        try {
          const messages = await chatApi.getChats(toUserId);
          set({ messages: messages || [] });
          
          // Mark messages as read when loading
          get().markMessagesAsRead(toUserId);
        } catch (error) {
          console.error("Failed to load messages:", error);
          set({ messages: [] });
        }
      },

      sendMessage: async (toUserId: string, message: string) => {
        const { currentUserId } = get();
        if (!currentUserId) {
          throw new Error("User not logged in");
        }

        try {
          await chatApi.sendMessage({
            userId: currentUserId,
            toUserId,
            message,
          });

          // Message will be received via SignalR
        } catch (error) {
          console.error("Failed to send message:", error);
          throw error;
        }
      },

      selectUser: (userId: string) => {
        set({ selectedUserId: userId });
        // Load messages for selected user
        get().loadMessages(userId);
      },

      markMessagesAsRead: (fromUserId: string) => {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [fromUserId]: 0,
          },
        }));
      },

      addIncomingMessage: (message: ChatModel) => {
        const { selectedUserId, currentUserId } = get();
        
        // Convert ChatModel to ChatMessage format
        const chatMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`, // Temporary ID
          userId: message.userId,
          toUserId: message.toUserId,
          message: message.message,
          createdDate: message.date,
        };

        set((state) => ({
          messages: [...state.messages, chatMessage],
        }));

        // Increment unread count if message is not from selected user
        const messageFromUserId = message.userId === currentUserId ? message.toUserId : message.userId;
        
        if (selectedUserId !== messageFromUserId) {
          get().incrementUnreadCount(messageFromUserId);
        }
      },

      incrementUnreadCount: (fromUserId: string) => {
        set((state) => ({
          unreadMessages: {
            ...state.unreadMessages,
            [fromUserId]: (state.unreadMessages[fromUserId] || 0) + 1,
          },
        }));
      },

      disconnect: async () => {
        try {
          console.log('Mock SignalR disconnecting');
          set({ isConnected: false, currentUserId: null });
        } catch (error) {
          console.error("Failed to disconnect from chat:", error);
        }
      },
    }),
    {
      name: getUserSpecificKey("chat-storage"),
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        unreadMessages: state.unreadMessages,
        selectedUserId: state.selectedUserId,
      }),
    }
  )
);
