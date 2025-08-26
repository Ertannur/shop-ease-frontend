# SignalR Live Support Integration

This documentation covers the complete SignalR live support implementation for real-time customer support functionality.

## 🏗️ Architecture Overview

The SignalR integration follows a modular architecture:

```
src/
├── lib/
│   └── signalRConnection.ts     # Core SignalR service
├── hooks/
│   └── useSignalR.ts           # React hook for state management
├── components/LiveSupport/
│   ├── LiveSupportChat.tsx     # Chat interface component
│   ├── SupportButton.tsx       # Floating button component
│   └── index.ts               # Component exports
├── Types/
│   └── LiveSupport.ts         # TypeScript interfaces
└── app/
    └── signalr-test/          # Test page for development
```

## 🔧 Core Components

### 1. SignalR Service (`signalRConnection.ts`)

The core service handles:
- Connection management with automatic reconnection
- Message sending and receiving
- Room management
- Typing indicators
- Agent status tracking

```typescript
// Usage
import { signalRService } from '@/lib/signalRConnection';

await signalRService.startConnection();
await signalRService.sendSupportMessage('Hello', 'user123');
```

### 2. React Hook (`useSignalR.ts`)

Provides state management for React components:
- Connection status
- Message history
- Typing indicators
- Agent online status
- Unread message count

```typescript
// Usage
import { useSignalR } from '@/hooks/useSignalR';

const { 
  isConnected, 
  messages, 
  sendMessage, 
  agentOnline 
} = useSignalR();
```

### 3. UI Components

#### SupportButton
- Floating button with status indicators
- Unread message badges
- Agent online/offline status

#### LiveSupportChat  
- Real-time chat interface
- Message history
- Typing indicators
- Auto-scroll to new messages

## 🌐 Backend Integration

### Required SignalR Hub

The backend must implement a SignalR Hub at `/supportHub` with the following methods:

#### Hub Methods (Backend implements):
```csharp
public class SupportHub : Hub
{
    public async Task SendSupportMessage(object messageData)
    {
        // Handle incoming messages from clients
        // messageData contains: { message, userId, timestamp }
    }
    
    public async Task JoinSupportRoom(string roomId)
    {
        // Add user to a support room
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }
    
    public async Task SendTypingIndicator(object typingData)
    {
        // Handle typing indicators
        // typingData contains: { userId, isTyping }
    }
}
```

#### Client Events (Frontend listens for):
```csharp
// Send to specific user or room
await Clients.User(userId).SendAsync("ReceiveSupportMessage", user, message, timestamp);
await Clients.Group(roomId).SendAsync("ReceiveSupportMessage", user, message, timestamp);

// Agent status changes
await Clients.All.SendAsync("AgentStatusChanged", isOnline);

// Typing indicators
await Clients.Group(roomId).SendAsync("UserTyping", userId, isTyping);
```

### Connection Configuration

The frontend connects using:
- **URL**: `${BASE_URL}/supportHub`
- **Authentication**: Bearer token from localStorage
- **Transport**: WebSockets with fallback
- **Reconnection**: Automatic with exponential backoff

## 🎨 UI Features

### Visual Indicators
- **Green dot**: Agent online
- **Red dot**: Agent offline  
- **Yellow dot**: Connecting
- **Badge**: Unread message count
- **Pulse**: New message animation

### Typing Indicators
- Real-time typing status
- Auto-timeout after 3 seconds
- Visual typing animation

### Message Features
- Character limit (500)
- Timestamp display
- Message history
- Auto-scroll to new messages

## 🧪 Testing & Development

### Test Page
Visit `/signalr-test` for comprehensive testing:
- Connection status monitoring
- Message sending/receiving
- Room management
- Typing indicators
- Connection logs

### Development Setup
1. Ensure backend SignalR Hub is running at `/supportHub`
2. Configure `NEXT_PUBLIC_BASE_URL` environment variable
3. Start development server: `npm run dev`
4. Visit test page: `http://localhost:3000/signalr-test`

### Debugging
- Check browser console for SignalR connection logs
- Monitor network tab for WebSocket connections
- Use test page for isolated functionality testing

## 🔒 Security Considerations

### Authentication
- JWT tokens automatically included in connection headers
- User identification for message routing
- Room-based message isolation

### Data Validation
- Message length limits
- Input sanitization
- Rate limiting (backend responsibility)

## 📱 Mobile Responsiveness

The chat interface is optimized for:
- Mobile devices (responsive design)
- Touch interactions
- Proper viewport handling
- Keyboard navigation

## 🚀 Deployment Checklist

Before deploying:
- [ ] Backend SignalR Hub implemented and tested
- [ ] Environment variables configured
- [ ] CORS settings allow frontend domain
- [ ] WebSocket support enabled on server
- [ ] SSL certificates for WSS connections
- [ ] Load balancer configured for sticky sessions (if using scale-out)

## 🛠️ Customization

### Styling
Modify Tailwind classes in components for custom styling:
- Button colors and positioning
- Chat window size and appearance
- Message bubble styling

### Functionality
Extend components for additional features:
- File sharing
- Emoji support  
- Message reactions
- Chat history persistence

### Configuration
Update SignalR service for custom behavior:
- Retry policies
- Connection timeouts
- Logging levels
- Authentication methods

## 📋 TypeScript Interfaces

```typescript
interface SupportMessage {
  id: string;
  message: string;
  userId: string;
  userName: string;
  timestamp: string;
  isFromSupport: boolean;
  roomId?: string;
}

interface LiveSupportState {
  isConnected: boolean;
  isConnecting: boolean;
  messages: SupportMessage[];
  currentRoom: string | null;
  agentOnline: boolean;
  unreadCount: number;
  isTyping: boolean;
  agentTyping: boolean;
}
```

## 🔄 Future Enhancements

Potential improvements:
- Message persistence and history
- Multiple agent support
- File and image sharing
- Chat transcripts
- Customer satisfaction ratings
- Queue management
- Admin dashboard for agents

## 🐛 Troubleshooting

### Common Issues

**Connection Fails:**
- Check backend SignalR Hub is running
- Verify CORS configuration
- Confirm WebSocket support
- Check network connectivity

**Messages Not Received:**
- Verify Hub method implementations
- Check client event names match
- Confirm room membership
- Test with multiple browser tabs

**Typing Indicators Not Working:**
- Check typing event handlers
- Verify timeout configurations  
- Test typing method calls
- Monitor console for errors

### Debug Steps
1. Check browser console for errors
2. Monitor network tab for WebSocket activity
3. Test backend Hub methods directly
4. Use SignalR test page for isolation
5. Verify environment variables

---

**Package Dependencies:**
- `@microsoft/signalr`: ^8.0.0
- `react`: ^18.0.0
- `typescript`: ^5.0.0

**Last Updated:** August 26, 2025
