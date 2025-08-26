'use client';

import { useState, useRef, useEffect } from 'react';
import { useSignalR } from '@/hooks/useSignalR';
import { SupportMessage } from '@/Types/LiveSupport';

interface LiveSupportChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSupportChat: React.FC<LiveSupportChatProps> = ({
  isOpen,
  onClose
}) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    isConnected,
    isConnecting,
    messages,
    agentOnline,
    unreadCount,
    agentTyping,
    sendMessage,
    clearUnreadCount,
    sendTypingIndicator
  } = useSignalR();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, agentTyping]);

  // Clear unread count and focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      clearUnreadCount();
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, clearUnreadCount]);

  // Handle typing indicators
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout;

    const handleTyping = () => {
      sendTypingIndicator(true);
      
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        sendTypingIndicator(false);
      }, 1000);
    };

    const inputElement = inputRef.current;
    if (inputElement && isOpen) {
      inputElement.addEventListener('input', handleTyping);
      
      return () => {
        inputElement.removeEventListener('input', handleTyping);
        clearTimeout(typingTimeout);
        sendTypingIndicator(false);
      };
    }
  }, [isOpen, sendTypingIndicator]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isConnected) return;

    try {
      await sendMessage(message.trim());
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      // You might want to show an error toast here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${agentOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <h3 className="font-semibold">Live Support</h3>
          <span className="text-xs opacity-90">
            {isConnecting ? 'Connecting...' : isConnected ? (agentOnline ? 'Agent Online' : 'Agent Offline') : 'Disconnected'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 text-lg leading-none"
          title="Close chat"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            <div className="text-4xl mb-2">👋</div>
            <p className="font-medium">Welcome to live support!</p>
            <p>How can we help you today?</p>
          </div>
        ) : (
          <>
            {messages.map((msg: SupportMessage) => (
              <div
                key={msg.id}
                className={`flex ${msg.isFromSupport ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    msg.isFromSupport
                      ? 'bg-gray-200 text-gray-800'
                      : 'bg-blue-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {/* Agent typing indicator */}
            {agentTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm">
                  <div className="flex items-center space-x-1">
                    <span>Agent is typing</span>
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!isConnected || !message.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {message.length}/500 characters
        </div>
      </form>
    </div>
  );
};
