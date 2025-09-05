'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { ChatModel, ChatConnectionStatus } from '@/Types';

interface UseSignalRChatProps {
  userId: string | null;
  onMessageReceived?: (message: ChatModel) => void;
  onConnectionStatusChanged?: (status: ChatConnectionStatus) => void;
}

export const useSignalRChat = ({
  userId,
  onMessageReceived,
  onConnectionStatusChanged
}: UseSignalRChatProps) => {
  const [connectionStatus, setConnectionStatus] = useState<ChatConnectionStatus>(
    ChatConnectionStatus.DISCONNECTED
  );
  const connectionRef = useRef<HubConnection | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateConnectionStatus = useCallback((status: ChatConnectionStatus) => {
    setConnectionStatus(status);
    onConnectionStatusChanged?.(status);
  }, [onConnectionStatusChanged]);

  const startConnection = useCallback(async () => {
    if (!userId || connectionRef.current?.state === 'Connected') {
      return;
    }

    try {
      updateConnectionStatus(ChatConnectionStatus.CONNECTING);

      // Create SignalR connection
      const connection = new HubConnectionBuilder()
        .withUrl('https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/chatHub', {
          withCredentials: false,
        })
        .withAutomaticReconnect([0, 2000, 10000, 30000])
        .configureLogging(LogLevel.Information)
        .build();

      // Set up event handlers
      connection.on('Messages', (message: ChatModel) => {
        console.log('Received message:', message);
        onMessageReceived?.(message);
      });

      // Connection state handlers
      connection.onreconnecting(() => {
        updateConnectionStatus(ChatConnectionStatus.RECONNECTING);
      });

      connection.onreconnected(() => {
        updateConnectionStatus(ChatConnectionStatus.CONNECTED);
        // Re-connect user after reconnection
        if (userId) {
          connection.invoke('Connect', userId).catch(console.error);
        }
      });

      connection.onclose((error) => {
        updateConnectionStatus(ChatConnectionStatus.DISCONNECTED);
        console.log('SignalR connection closed:', error);
        
        // Attempt to reconnect after 5 seconds
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        reconnectTimeoutRef.current = setTimeout(() => {
          startConnection();
        }, 5000);
      });

      // Start connection
      await connection.start();
      connectionRef.current = connection;

      // Connect user to SignalR hub
      await connection.invoke('Connect', userId);
      updateConnectionStatus(ChatConnectionStatus.CONNECTED);

      console.log('SignalR connected successfully for user:', userId);
    } catch (error) {
      console.error('SignalR connection failed:', error);
      updateConnectionStatus(ChatConnectionStatus.ERROR);
      
      // Retry connection after 5 seconds
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        startConnection();
      }, 5000);
    }
  }, [userId, onMessageReceived, updateConnectionStatus]);

  const stopConnection = useCallback(async () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (connectionRef.current) {
      try {
        await connectionRef.current.stop();
      } catch (error) {
        console.error('Error stopping SignalR connection:', error);
      } finally {
        connectionRef.current = null;
        updateConnectionStatus(ChatConnectionStatus.DISCONNECTED);
      }
    }
  }, [updateConnectionStatus]);

  const sendMessage = useCallback(async (toUserId: string, message: string) => {
    if (!connectionRef.current || connectionRef.current.state !== 'Connected') {
      throw new Error('SignalR connection is not established');
    }

    if (!userId) {
      throw new Error('User ID is required to send messages');
    }

    try {
      const chatMessage: ChatModel = {
        userId,
        toUserId,
        message,
        date: new Date().toISOString()
      };

      // Note: Depending on your SignalR hub implementation, 
      // you might need to adjust this method name
      await connectionRef.current.invoke('SendMessage', chatMessage);
    } catch (error) {
      console.error('Failed to send message via SignalR:', error);
      throw error;
    }
  }, [userId]);

  // Initialize connection when userId is available
  useEffect(() => {
    if (userId) {
      startConnection();
    } else {
      stopConnection();
    }

    return () => {
      stopConnection();
    };
  }, [userId, startConnection, stopConnection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopConnection();
    };
  }, [stopConnection]);

  return {
    connectionStatus,
    isConnected: connectionStatus === ChatConnectionStatus.CONNECTED,
    isConnecting: connectionStatus === ChatConnectionStatus.CONNECTING,
    isReconnecting: connectionStatus === ChatConnectionStatus.RECONNECTING,
    sendMessage,
    startConnection,
    stopConnection
  };
};
