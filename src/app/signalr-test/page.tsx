'use client';

import { useState, useEffect } from 'react';
import { useSignalR } from '@/hooks/useSignalR';
import { SupportButton } from '@/components/LiveSupport';

export default function SignalRTestPage() {
  const {
    isConnected,
    isConnecting,
    messages,
    agentOnline,
    unreadCount,
    isTyping,
    agentTyping,
    sendMessage,
    connect,
    disconnect,
    joinRoom,
    sendTypingIndicator
  } = useSignalR();

  const [testMessage, setTestMessage] = useState('Hello from test page!');
  const [testRoomId, setTestRoomId] = useState('test-room-123');
  const [connectionLogs, setConnectionLogs] = useState<string[]>([]);

  // Log connection state changes
  useEffect(() => {
    const status = isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected';
    const timestamp = new Date().toLocaleTimeString();
    setConnectionLogs(prev => [...prev.slice(-9), `[${timestamp}] ${status}`]);
  }, [isConnected, isConnecting]);

  const handleSendTestMessage = async () => {
    if (testMessage.trim()) {
      try {
        await sendMessage(testMessage.trim());
        setTestMessage('');
      } catch (error) {
        console.error('Failed to send test message:', error);
        alert('Failed to send message. Check console for details.');
      }
    }
  };

  const handleJoinTestRoom = async () => {
    if (testRoomId.trim()) {
      try {
        await joinRoom(testRoomId.trim());
        alert(`Joined room: ${testRoomId}`);
      } catch (error) {
        console.error('Failed to join room:', error);
        alert('Failed to join room. Check console for details.');
      }
    }
  };

  const handleTypingTest = async () => {
    await sendTypingIndicator(true);
    setTimeout(async () => {
      await sendTypingIndicator(false);
    }, 2000);
  };

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SignalR Live Support Test</h1>
        <p className="text-gray-600">
          Comprehensive testing interface for SignalR live support functionality
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Status */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            Connection Status
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={`font-bold ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnecting ? 'Connecting...' : isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Agent Online:</span>
              <span className={`font-bold ${agentOnline ? 'text-green-600' : 'text-red-600'}`}>
                {agentOnline ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">Unread Messages:</span>
              <span className="font-bold text-blue-600">{unreadCount}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">User Typing:</span>
              <span className={`font-bold ${isTyping ? 'text-blue-600' : 'text-gray-400'}`}>
                {isTyping ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Agent Typing:</span>
              <span className={`font-bold ${agentTyping ? 'text-blue-600' : 'text-gray-400'}`}>
                {agentTyping ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="pt-4 space-x-2">
              <button
                onClick={connect}
                disabled={isConnected || isConnecting}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400 hover:bg-green-700 transition-colors"
              >
                Connect
              </button>
              <button
                onClick={disconnect}
                disabled={!isConnected}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:bg-gray-400 hover:bg-red-700 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Connection Logs */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Connection Logs</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-48 overflow-y-auto">
            {connectionLogs.length === 0 ? (
              <p className="text-gray-500">No logs yet...</p>
            ) : (
              connectionLogs.map((log, index) => (
                <div key={index} className="mb-1">{log}</div>
              ))
            )}
          </div>
          <button
            onClick={() => setConnectionLogs([])}
            className="mt-2 px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
          >
            Clear Logs
          </button>
        </div>

        {/* Test Message Sender */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Send Test Message</h2>
          <div className="space-y-4">
            <textarea
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              placeholder="Enter test message..."
              rows={3}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-2">
              <button
                onClick={handleSendTestMessage}
                disabled={!isConnected || !testMessage.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400 hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
              <button
                onClick={handleTypingTest}
                disabled={!isConnected}
                className="px-4 py-2 bg-purple-600 text-white rounded disabled:bg-gray-400 hover:bg-purple-700 transition-colors"
              >
                Test Typing
              </button>
            </div>
          </div>
        </div>

        {/* Room Management */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Room Management</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <input
                type="text"
                value={testRoomId}
                onChange={(e) => setTestRoomId(e.target.value)}
                placeholder="Enter room ID..."
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleJoinTestRoom}
              disabled={!isConnected || !testRoomId.trim()}
              className="w-full px-4 py-2 bg-orange-600 text-white rounded disabled:bg-gray-400 hover:bg-orange-700 transition-colors"
            >
              Join Room
            </button>
          </div>
        </div>

        {/* Messages Display */}
        <div className="lg:col-span-2 bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Messages ({messages.length})
          </h2>
          <div className="h-64 overflow-y-auto space-y-3 border p-4 bg-gray-50 rounded">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No messages yet. Try sending a test message!</p>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.isFromSupport ? 'bg-blue-100 border-l-4 border-blue-500' : 'bg-green-100 border-l-4 border-green-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-sm">
                      {message.userName} {message.isFromSupport ? '(Support)' : '(You)'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(message.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-800">{message.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Integration Guide */}
        <div className="lg:col-span-2 bg-blue-50 p-6 border border-blue-200 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Backend Integration Guide</h2>
          <div className="space-y-3 text-sm text-blue-900">
            <div>
              <p><strong>SignalR Hub URL:</strong> <code className="bg-white px-2 py-1 rounded">/supportHub</code></p>
            </div>
            
            <div>
              <p><strong>Required Hub Methods:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>SendSupportMessage(message, userId, timestamp)</code></li>
                <li><code>JoinSupportRoom(roomId)</code></li>
                <li><code>SendTypingIndicator(userId, isTyping)</code></li>
              </ul>
            </div>
            
            <div>
              <p><strong>Client Events (Frontend listens for):</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li><code>ReceiveSupportMessage(user, message, timestamp)</code></li>
                <li><code>AgentStatusChanged(isOnline)</code></li>
                <li><code>UserTyping(userId, isTyping)</code></li>
              </ul>
            </div>

            <div className="pt-2 border-t border-blue-200">
              <p><strong>How to test:</strong></p>
              <ol className="list-decimal list-inside ml-4 space-y-1">
                <li>Click the floating chat button (bottom-right corner)</li>
                <li>Send messages through both this test page and the chat widget</li>
                <li>Monitor connection status and message flow</li>
                <li>Test typing indicators and agent status changes</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <SupportButton />
    </div>
  );
}
