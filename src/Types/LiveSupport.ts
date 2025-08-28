// Chat model matching backend structure
export interface ChatMessage {
  id?: string;
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

// Legacy support message interface (kept for backward compatibility)
export interface SupportMessage {
  id: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
  isFromSupport: boolean;
  roomId?: string;
}

export interface SupportRoom {
  id: string;
  userId: string;
  userName: string;
  isActive: boolean;
  createdAt: string;
  lastMessageAt: string;
  unreadCount: number;
  agentId?: string;
  agentName?: string;
}

export interface SupportAgent {
  id: string;
  name: string;
  isOnline: boolean;
  avatar?: string;
  department?: string;
}

export interface LiveSupportState {
  isConnected: boolean;
  isConnecting: boolean;
  messages: SupportMessage[];
  currentRoom: string | null;
  agentOnline: boolean;
  unreadCount: number;
  isTyping: boolean;
  agentTyping: boolean;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: string;
}

export interface SupportNotification {
  id: string;
  type: 'message' | 'agent_joined' | 'agent_left' | 'room_created';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}
