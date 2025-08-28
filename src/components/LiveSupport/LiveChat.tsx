"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSignalR } from '@/hooks/useSignalR';
import { ChatUser, ChatModel } from '@/lib/signalRConnection';

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    isConnected,
    isConnecting,
    messages,
    currentChatUser,
    availableUsers,
    unreadCount,
    isTyping,
    connect,
    disconnect,
    startChatWith,
    sendMessage: sendChatMessage,
    setTyping,
    markAsRead
  } = useSignalR();

  const [showUserSelector, setShowUserSelector] = useState(false);

  // Auto-connect when component mounts
  useEffect(() => {
    if (isOpen && !isConnected && !isConnecting) {
      connect().catch(console.error);
    }
  }, [isOpen, isConnected, isConnecting, connect]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (isOpen) {
      markAsRead();
    }
  }, [isOpen, markAsRead]);

  const handleSendMessage = async () => {
    if (!message.trim() || !currentChatUser) return;

    try {
      await sendChatMessage(message);
      setMessage('');
      setTyping(false);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setTyping(e.target.value.length > 0);
  };

  const handleStartChat = async (user: ChatUser) => {
    try {
      await startChatWith(user);
      setShowUserSelector(false);
    } catch (error) {
      console.error('Failed to start chat:', error);
      alert('Failed to start chat. Please try again.');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <h3 className="font-medium">
            {currentChatUser ? currentChatUser.fullName : 'Live Support'}
          </h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          {!currentChatUser && (
            <button
              onClick={() => setShowUserSelector(!showUserSelector)}
              className="text-white hover:text-gray-200 transition-colors"
              title="Select user to chat with"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {!isConnected && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-2 text-sm">
          {isConnecting ? 'Connecting...' : 'Disconnected - Click to retry'}
        </div>
      )}

      {/* User Selector */}
      {showUserSelector && (
        <div className="border-b border-gray-200 max-h-32 overflow-y-auto">
          <div className="p-2 text-sm font-medium text-gray-700">Select user to chat with:</div>
          {availableUsers.length === 0 ? (
            <div className="p-2 text-sm text-gray-500">No users available</div>
          ) : (
            availableUsers.map((user) => (
              <button
                key={user.id}
                onClick={() => handleStartChat(user)}
                className="w-full p-2 text-left hover:bg-gray-100 text-sm transition-colors"
              >
                {user.fullName}
              </button>
            ))
          )}
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {!currentChatUser ? (
          <div className="text-center text-gray-500 text-sm">
            {availableUsers.length > 0 ? 'Select a user to start chatting' : 'Loading users...'}
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, index) => {
            const isOwnMessage = msg.userId === currentChatUser?.id ? false : true;
            
            return (
              <div
                key={msg.id || index}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div>{msg.message}</div>
                  <div
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                    }`}
                  >
                    {formatTimestamp(msg.date)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200">
        {currentChatUser ? (
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!isConnected}
            />
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() || !isConnected}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-500">
            Please select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
