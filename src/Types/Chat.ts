// Backend API Response için Chat Message modeli
export interface ChatMessage {
  id: string;
  userId: string;
  toUserId: string;
  message: string;
  createdDate: string;
}

// SignalR'dan gelen message modeli (Backend'deki ChatModel)
export interface ChatModel {
  userId: string;
  toUserId: string;
  date: string;  // Backend'de "date" field'i kullanılıyor
  message: string;
}

// User bilgisi (GetUsers ve GetSupport response)
export interface ChatUser {
  id: string;
  fullName: string;
}

// Support user - ChatUser ile aynı yapıda
export type SupportUser = ChatUser;

// Send Message Request (Backend SendMessage API için)
export interface SendMessageRequest {
  userId: string;
  toUserId: string;
  message: string;
}

// API Response Types
export type GetChatsResponse = ChatMessage[];
export type GetUsersResponse = ChatUser[];
export type GetSupportResponse = SupportUser[];

// Error Types
export interface ChatApiError {
  message: string;
  status: number;
}

// Frontend State Types
export interface ChatState {
  messages: ChatMessage[];
  users: ChatUser[];
  supportUsers: SupportUser[];
  selectedUserId: string | null;
  unreadMessages: Record<string, number>; // userId -> unread count
  isConnected: boolean;
  currentUserId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UnreadMessageUpdate {
  fromUserId: string;
  count: number;
}

// SignalR Connection State
export enum ConnectionState {
  Disconnected = 'Disconnected',
  Connecting = 'Connecting', 
  Connected = 'Connected',
  Disconnecting = 'Disconnecting',
  Reconnecting = 'Reconnecting'
}

// User Role Types
export type UserRole = 'Admin' | 'User' | 'Support';

// Message Display Type (frontend için)
export interface DisplayMessage {
  id: string;
  from: 'user' | 'other';
  text: string;
  timestamp: string;
  userId: string;
}
