import { useState, useEffect, useCallback, useRef } from 'react';
import { signalRService } from '@/lib/signalRConnection';
import { SupportMessage, LiveSupportState } from '@/Types/LiveSupport';

export const useSignalR = () => {
  const [state, setState] = useState<LiveSupportState>({
    isConnected: false,
    isConnecting: false,
    messages: [],
    currentRoom: null,
    agentOnline: false,
    unreadCount: 0,
    isTyping: false,
    agentTyping: false
  });

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const agentTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize SignalR connection
  const connect = useCallback(async () => {
    if (state.isConnected || state.isConnecting) return;
    
    setState(prev => ({ ...prev, isConnecting: true }));
    
    try {
      await signalRService.startConnection();
      setState(prev => ({ ...prev, isConnected: true, isConnecting: false }));
      
      // Setup message listeners
      signalRService.onReceiveMessage((user: string, message: string, timestamp: string) => {
        const newMessage: SupportMessage = {
          id: Date.now().toString() + Math.random(),
          message,
          userId: user === 'Support' ? 'support' : user,
          userName: user,
          timestamp,
          isFromSupport: user === 'Support'
        };
        
        setState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage],
          unreadCount: prev.unreadCount + 1,
          agentTyping: false // Stop showing agent typing when message received
        }));
      });

      // Setup agent status listener
      signalRService.onAgentStatusChange((isOnline: boolean) => {
        setState(prev => ({ ...prev, agentOnline: isOnline }));
      });

      // Setup typing indicators
      signalRService.onUserTyping((userId: string, isTyping: boolean) => {
        if (userId === 'support' || userId === 'agent') {
          setState(prev => ({ ...prev, agentTyping: isTyping }));
          
          // Clear agent typing after 3 seconds if no update
          if (agentTypingTimeoutRef.current) {
            clearTimeout(agentTypingTimeoutRef.current);
          }
          
          if (isTyping) {
            agentTypingTimeoutRef.current = setTimeout(() => {
              setState(prev => ({ ...prev, agentTyping: false }));
            }, 3000);
          }
        }
      });

    } catch (error) {
      console.error('Failed to connect to SignalR:', error);
      setState(prev => ({ ...prev, isConnecting: false }));
    }
  }, [state.isConnected, state.isConnecting]);

  // Disconnect from SignalR
  const disconnect = useCallback(async () => {
    try {
      await signalRService.stopConnection();
      setState(prev => ({ 
        ...prev, 
        isConnected: false, 
        isConnecting: false,
        messages: [],
        unreadCount: 0,
        agentTyping: false,
        isTyping: false
      }));
    } catch (error) {
      console.error('Error disconnecting from SignalR:', error);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (message: string, userId?: string) => {
    if (!signalRService.isConnected()) {
      throw new Error('Not connected to SignalR');
    }

    try {
      await signalRService.sendSupportMessage(message, userId);
      
      // Add message to local state
      const newMessage: SupportMessage = {
        id: Date.now().toString() + Math.random(),
        message,
        userId: userId || 'user',
        userName: 'You',
        timestamp: new Date().toISOString(),
        isFromSupport: false
      };
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, newMessage],
        isTyping: false // Stop typing when message is sent
      }));

      // Stop typing indicator
      await signalRService.sendTypingIndicator(false, userId);
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, []);

  // Join support room
  const joinRoom = useCallback(async (roomId: string) => {
    if (!signalRService.isConnected()) {
      throw new Error('Not connected to SignalR');
    }

    try {
      await signalRService.joinSupportRoom(roomId);
      setState(prev => ({ ...prev, currentRoom: roomId }));
    } catch (error) {
      console.error('Failed to join room:', error);
      throw error;
    }
  }, []);

  // Clear unread count
  const clearUnreadCount = useCallback(() => {
    setState(prev => ({ ...prev, unreadCount: 0 }));
  }, []);

  // Send typing indicator
  const sendTypingIndicator = useCallback(async (isTyping: boolean, userId?: string) => {
    if (!signalRService.isConnected()) return;

    try {
      await signalRService.sendTypingIndicator(isTyping, userId);
      setState(prev => ({ ...prev, isTyping }));

      // Clear typing after 3 seconds
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (isTyping) {
        typingTimeoutRef.current = setTimeout(async () => {
          await signalRService.sendTypingIndicator(false, userId);
          setState(prev => ({ ...prev, isTyping: false }));
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }, []);

  // Auto-connect on mount
  useEffect(() => {
    connect();
    
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (agentTypingTimeoutRef.current) {
        clearTimeout(agentTypingTimeoutRef.current);
      }
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    sendMessage,
    joinRoom,
    clearUnreadCount,
    sendTypingIndicator
  };
};
