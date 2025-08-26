'use client';

import { useState } from 'react';
import { LiveSupportChat } from './LiveSupportChat';
import { useSignalR } from '@/hooks/useSignalR';

export const SupportButton: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { unreadCount, agentOnline, isConnected } = useSignalR();

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {/* Floating Support Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center z-40 group"
        title="Live Support"
      >
        <div className="relative">
          {/* Chat Icon */}
          <svg
            className="w-6 h-6 transition-transform group-hover:scale-110"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          
          {/* Unread messages badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          
          {/* Connection and agent status indicator */}
          <span
            className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white transition-colors ${
              !isConnected 
                ? 'bg-gray-400' 
                : agentOnline 
                  ? 'bg-green-400' 
                  : 'bg-yellow-400'
            }`}
            title={
              !isConnected 
                ? 'Connecting...' 
                : agentOnline 
                  ? 'Agent Online' 
                  : 'Agent Offline'
            }
          />
        </div>

        {/* Pulse animation for new messages */}
        {unreadCount > 0 && (
          <div className="absolute inset-0 rounded-full bg-blue-400 opacity-75 animate-ping"></div>
        )}
      </button>

      {/* Live Support Chat */}
      <LiveSupportChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </>
  );
};
