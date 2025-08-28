"use client";
import React, { useState, useEffect } from 'react';
import { useSignalR } from '@/hooks/useSignalR';
import { ChatUser } from '@/lib/signalRConnection';
import { useAuthStore } from '@/features/auth/authStore';

const SignalRTestPage: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [testMessage, setTestMessage] = useState('Hello from test page!');
  const { user, isAuthed } = useAuthStore();
  
  const {
    isConnected,
    isConnecting,
    messages,
    currentChatUser,
    availableUsers,
    unreadCount,
    isTyping,
    currentUserId,
    connect,
    disconnect,
    startChatWith,
    sendMessage,
    markAsRead,
    loadAvailableUsers
  } = useSignalR();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  useEffect(() => {
    addLog('Page loaded, ready to test SignalR functionality');
  }, []);

  useEffect(() => {
    addLog(`Connection status: ${isConnected ? 'Connected' : isConnecting ? 'Connecting' : 'Disconnected'}`);
  }, [isConnected, isConnecting]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      addLog(`New message received: "${lastMessage.message}" from ${lastMessage.userId}`);
    }
  }, [messages]);

  const handleConnect = async () => {
    try {
      addLog('Attempting to connect...');
      await connect();
      addLog('Connect request sent');
    } catch (error) {
      addLog(`Connection failed: ${error}`);
    }
  };

  const handleDisconnect = async () => {
    try {
      addLog('Disconnecting...');
      await disconnect();
      addLog('Disconnected successfully');
    } catch (error) {
      addLog(`Disconnect failed: ${error}`);
    }
  };

  const handleStartChat = async (user: ChatUser) => {
    try {
      addLog(`Starting chat with ${user.fullName}...`);
      await startChatWith(user);
      addLog(`Chat started with ${user.fullName}`);
    } catch (error) {
      addLog(`Failed to start chat: ${error}`);
    }
  };

  const handleSendMessage = async () => {
    if (!testMessage.trim()) return;

    try {
      addLog(`Sending message: "${testMessage}"`);
      await sendMessage(testMessage);
      addLog('Message sent successfully');
      setTestMessage('');
    } catch (error) {
      addLog(`Failed to send message: ${error}`);
    }
  };

  const handleLoadUsers = async () => {
    try {
      addLog('Loading available users...');
      await loadAvailableUsers();
      addLog(`Loaded ${availableUsers.length} users`);
    } catch (error) {
      addLog(`Failed to load users: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">SignalR Chat System Test Page</h1>
      
      {/* Connection Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700">Authentication</h3>
          <p className={`text-lg font-bold ${isAuthed() ? 'text-green-600' : 'text-red-600'}`}>
            {isAuthed() ? 'Logged In' : 'Not Logged In'}
          </p>
          {user && <p className="text-xs text-gray-500 break-all">{user.email}</p>}
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700">Connection Status</h3>
          <p className={`text-lg font-bold ${isConnected ? 'text-green-600' : isConnecting ? 'text-yellow-600' : 'text-red-600'}`}>
            {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700">Current User ID</h3>
          <p className="text-sm text-gray-600 break-all">{currentUserId || 'Not available'}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700">Chat Partner</h3>
          <p className="text-sm text-gray-600">{currentChatUser?.fullName || 'None selected'}</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="font-semibold text-gray-700">Messages</h3>
          <p className="text-lg font-bold">{messages.length}</p>
          {unreadCount > 0 && (
            <p className="text-sm text-red-600">{unreadCount} unread</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Controls */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Connection Controls</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleConnect}
                disabled={isConnected || isConnecting}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Connect
              </button>
              <button
                onClick={handleDisconnect}
                disabled={!isConnected}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Disconnect
              </button>
              <button
                onClick={handleLoadUsers}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Load Users
              </button>
            </div>
          </div>

          {/* Available Users */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Available Users ({availableUsers.length})</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {availableUsers.length === 0 ? (
                <p className="text-gray-500">No users available. Try loading users first.</p>
              ) : (
                availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      currentChatUser?.id === user.id ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                    onClick={() => handleStartChat(user)}
                  >
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-sm text-gray-500 break-all">{user.id}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Message Sending */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Send Test Message</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Enter test message..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                disabled={!isConnected || !currentChatUser || !testMessage.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                Send Message
              </button>
              {!currentChatUser && (
                <p className="text-sm text-yellow-600">Select a user to start chatting</p>
              )}
            </div>
          </div>
        </div>

        {/* Messages and Logs */}
        <div className="space-y-6">
          {/* Messages */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Chat Messages ({messages.length})</h2>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-gray-500">No messages yet</p>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.userId === currentUserId;
                  return (
                    <div
                      key={msg.id || index}
                      className={`p-3 rounded ${isOwn ? 'bg-blue-100' : 'bg-gray-100'}`}
                    >
                      <div className="font-medium text-sm">
                        {isOwn ? 'You' : 'Other'} ({msg.userId})
                      </div>
                      <div className="text-gray-800">{msg.message}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(msg.date).toLocaleTimeString()}
                      </div>
                    </div>
                  );
                })
              )}
              {isTyping && (
                <div className="p-3 bg-yellow-50 rounded text-sm text-yellow-700">
                  Someone is typing...
                </div>
              )}
            </div>
            {messages.length > 0 && (
              <button
                onClick={markAsRead}
                className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
              >
                Mark All as Read
              </button>
            )}
          </div>

          {/* Logs */}
          <div className="bg-white p-6 rounded-lg shadow border">
            <h2 className="text-xl font-semibold mb-4">Activity Logs</h2>
            <div className="bg-gray-50 p-4 rounded max-h-60 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500">No logs yet</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm text-gray-700 mb-1 font-mono">
                    {log}
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setLogs([])}
              className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>

      {/* Backend Integration Guide */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-800">Backend Integration Guide & Authentication</h2>
        <div className="text-sm text-blue-700 space-y-2">
          <p><strong>SignalR Hub URL:</strong> https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/chatHub</p>
          <p><strong>Required Method:</strong> Connect(userId) - to connect user to hub</p>
          <p><strong>Listening Event:</strong> &quot;Messages&quot; - for receiving ChatModel objects</p>
          <p><strong>Test Credentials:</strong> umutcanguncu@icloud.com / Umut135,</p>
          <p><strong>Chat API Endpoints:</strong></p>
          <ul className="ml-4 list-disc">
            <li>GET /api/Chat/GetSupport - Get support users</li>
            <li>GET /api/Chat/GetUsers - Get all users (admin/support only)</li>
            <li>GET /api/Chat/GetChats?toUserId=&#123;userId&#125; - Get chat history</li>
            <li>POST /api/Chat/SendMessage - Send message via REST API</li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
            <p className="font-semibold text-yellow-800">⚠️ Authentication Required</p>
            <p className="text-yellow-700">To test SignalR functionality, you need to:</p>
            <ol className="list-decimal list-inside ml-4 mt-2 text-yellow-700">
              <li>Go to <a href="/login" className="underline text-blue-600 hover:text-blue-800">/login</a> page</li>
              <li>Login with: umutcanguncu@icloud.com / Umut135,</li>
              <li>Return to this test page to try SignalR features</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignalRTestPage;
