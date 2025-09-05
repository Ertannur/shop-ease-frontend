'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/features/auth';
import { useChatStore } from '@/features/chat/chatStore';
import { useSignalRChat } from '@/hooks/useSignalRChat';

export default function LiveSupportTestPage() {
  const { user } = useAuthStore();
  const { 
    messages, 
    supportUsers, 
    isLoading, 
    error,
    fetchSupportUsers,
    fetchChats,
    sendMessage
  } = useChatStore();

  const [testMessage, setTestMessage] = useState('');
  const [selectedSupportId, setSelectedSupportId] = useState<string>('');

  const {
    connectionStatus,
    isConnected,
    sendMessage: sendSignalRMessage
  } = useSignalRChat({
    userId: user?.id || null,
    onMessageReceived: (message) => {
      console.log('Received SignalR message:', message);
    }
  });

  useEffect(() => {
    if (user) {
      fetchSupportUsers();
    }
  }, [user, fetchSupportUsers]);

  const handleGetChats = async () => {
    if (selectedSupportId) {
      try {
        await fetchChats(selectedSupportId);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!testMessage.trim() || !selectedSupportId || !user) return;

    try {
      await sendMessage({
        userId: user.id,
        toUserId: selectedSupportId,
        message: testMessage
      });
      
      if (isConnected) {
        await sendSignalRMessage(selectedSupportId, testMessage);
      }
      
      setTestMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Live Support Test</h1>
        <p>Please login to test live support.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Live Support Test</h1>
      
      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>

      {/* SignalR Status */}
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">SignalR Status</h2>
        <p>Connection Status: <span className="font-mono">{connectionStatus}</span></p>
        <p>Is Connected: {isConnected ? '✅' : '❌'}</p>
      </div>

      {/* Support Users */}
      <div className="bg-green-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Support Users</h2>
        {isLoading && <p>Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        
        <select 
          value={selectedSupportId} 
          onChange={(e) => setSelectedSupportId(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select a support user</option>
          {supportUsers.map(user => (
            <option key={user.id} value={user.id}>
              {user.fullName} ({user.id})
            </option>
          ))}
        </select>
        
        <button 
          onClick={handleGetChats}
          disabled={!selectedSupportId}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Get Chat History
        </button>
      </div>

      {/* Messages */}
      <div className="bg-yellow-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Messages ({messages.length})</h2>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {messages.map(msg => (
            <div key={msg.id} className="bg-white p-2 rounded border">
              <p><strong>From:</strong> {msg.userId === user.id ? 'You' : 'Support'}</p>
              <p><strong>Message:</strong> {msg.message}</p>
              <p><strong>Time:</strong> {new Date(msg.createdDate).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Send Message */}
      <div className="bg-purple-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Send Test Message</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Type a test message..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleSendMessage}
            disabled={!testMessage.trim() || !selectedSupportId || !isConnected}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debug Info</h2>
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify({
            userLoaded: !!user,
            supportUsersCount: supportUsers.length,
            messagesCount: messages.length,
            selectedSupportId,
            isConnected,
            connectionStatus
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
