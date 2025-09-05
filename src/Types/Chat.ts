// Chat related types for live support system

export interface ChatMessage {
  id: string;
  userId: string;
  toUserId: string;
  message: string;
  createdDate: string;
}

export interface ChatModel {
  userId: string;
  toUserId: string;
  date: string;
  message: string;
}

export interface ChatUser {
  id: string;
  fullName: string;
}

export interface SupportUser {
  id: string;
  fullName: string;
}

export interface SendMessageRequest {
  userId: string;
  toUserId: string;
  message: string;
}

export interface ChatState {
  messages: ChatMessage[];
  users: ChatUser[];
  supportUsers: SupportUser[];
  currentChatUserId: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export enum ChatConnectionStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  ERROR = 'error'
}
