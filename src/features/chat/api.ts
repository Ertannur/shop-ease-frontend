import { api } from '@/lib/apiClient';
import { 
  ChatMessage, 
  ChatUser, 
  SupportUser, 
  SendMessageRequest 
} from '@/Types';

export const chatApi = {
  /**
   * Get chat messages between current user and specified user
   * @param toUserId - ID of the user to get chat history with
   * @returns Promise with array of chat messages
   */
  getChats: async (toUserId: string): Promise<ChatMessage[]> => {
    try {
      const response = await api.get<ChatMessage[]>('/api/Chat/GetChats', {
        params: { toUserId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get chats:', error);
      throw error;
    }
  },

  /**
   * Get list of users that support/admin can chat with
   * Only available for Admin and Support roles
   * @returns Promise with array of chat users
   */
  getUsers: async (): Promise<ChatUser[]> => {
    try {
      const response = await api.get<ChatUser[]>('/api/Chat/GetUsers');
      return response.data;
    } catch (error) {
      console.error('Failed to get users:', error);
      throw error;
    }
  },

  /**
   * Get support users that regular users can chat with
   * Only available for Admin and User roles
   * @returns Promise with array of support users
   */
  getSupport: async (): Promise<SupportUser[]> => {
    try {
      const response = await api.get<SupportUser[]>('/api/Chat/GetSupport');
      return response.data;
    } catch (error) {
      console.error('Failed to get support users:', error);
      throw error;
    }
  },

  /**
   * Send a message to another user
   * @param messageData - Message data including userId, toUserId, and message
   * @returns Promise that resolves when message is sent
   */
  sendMessage: async (messageData: SendMessageRequest): Promise<void> => {
    try {
      await api.post('/api/Chat/SendMessage', messageData);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }
};

export default chatApi;
