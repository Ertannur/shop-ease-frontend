import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { SIGNALR_HUB_URL } from './constants';

// Chat model matching backend structure from documentation
export interface ChatModel {
  id?: string;
  userId: string;
  toUserId: string;
  message: string;
  date: string; // Changed from createdDate to date to match backend
}

// API response model for GetChats endpoint (uses createdDate)
interface ChatApiResponse {
  id: string;
  userId: string;
  toUserId: string;
  message: string;
  createdDate: string;
}

// User model for support/chat users
export interface ChatUser {
  id: string;
  fullName: string;
}

class SignalRService {
  private connection: HubConnection | null = null;
  private readonly hubUrl: string;
  private currentUserId: string | null = null;

  constructor() {
    this.hubUrl = SIGNALR_HUB_URL;
  }

  // Initialize SignalR connection
  async startConnection(): Promise<void> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: false,
          accessTokenFactory: () => token || ''
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      await this.connection.start();
      console.log('SignalR Chat Connected Successfully');
      
      this.setupConnectionHandlers();
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  // Setup connection event handlers
  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      console.log('SignalR Reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR Reconnected Successfully');
      // Reconnect with userId if available
      if (this.currentUserId) {
        this.connectUser(this.currentUserId);
      }
    });

    this.connection.onclose(() => {
      console.log('SignalR Connection Closed');
    });
  }

  // Connect user with userId (as per backend documentation)
  async connectUser(userId: string): Promise<void> {
    if (this.connection?.state === 'Connected') {
      try {
        this.currentUserId = userId;
        await this.connection.invoke('Connect', userId);
        console.log(`User ${userId} connected to chat hub`);
      } catch (error) {
        console.error('Error connecting user:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection is not established');
    }
  }

  // Listen for incoming messages (as per backend: "Messages" event)
  onReceiveMessages(callback: (chatMessage: ChatModel) => void): void {
    if (this.connection) {
      this.connection.on('Messages', (res: ChatModel) => {
        console.log('Received message:', res);
        callback(res);
      });
    }
  }

  // Send message using Chat API endpoints
  async sendMessage(toUserId: string, message: string): Promise<void> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      
      console.log('Sending message with params:', {
        toUserId,
        message,
        currentUserId: this.currentUserId,
        hasToken: !!token,
        baseUrl: process.env.NEXT_PUBLIC_BASE_URL
      });

      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      if (!this.currentUserId) {
        throw new Error('No current user ID available');
      }

      const requestBody = {
        userId: this.currentUserId,
        toUserId: toUserId,
        message: message
      };

      console.log('Request body:', requestBody);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/Chat/SendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to send message: ${response.status} - ${errorText}`);
      }

      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  // Get chat messages between users
  async getChatMessages(toUserId: string): Promise<ChatModel[]> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/Chat/GetChats?toUserId=${toUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get messages: ${response.status}`);
      }

      const apiMessages: ChatApiResponse[] = await response.json();
      
      // Map API response to ChatModel (API uses createdDate, SignalR uses date)
      const messages: ChatModel[] = apiMessages.map((msg: ChatApiResponse) => ({
        id: msg.id,
        userId: msg.userId,
        toUserId: msg.toUserId,
        message: msg.message,
        date: msg.createdDate // Map createdDate from API to date for consistency
      }));
      
      return messages;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  // Get support users (for regular users)
  async getSupportUsers(): Promise<ChatUser[]> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/Chat/GetSupport`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get support users: ${response.status}`);
      }

      const supportUsers: ChatUser[] = await response.json();
      return supportUsers;
    } catch (error) {
      console.error('Error getting support users:', error);
      throw error;
    }
  }

  // Get all users (for support/admin users)
  async getAllUsers(): Promise<ChatUser[]> {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/Chat/GetUsers`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get users: ${response.status}`);
      }

      const users: ChatUser[] = await response.json();
      return users;
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  }

  // Stop connection
  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
      this.currentUserId = null;
    }
  }

  // Get connection state
  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }

  // Get current user ID
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

export const signalRService = new SignalRService();
