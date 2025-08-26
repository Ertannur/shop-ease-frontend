import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

class SignalRService {
  private connection: HubConnection | null = null;
  private readonly hubUrl: string;

  constructor() {
    this.hubUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/supportHub` || 'https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net/supportHub';
  }

  // Initialize SignalR connection
  async startConnection(): Promise<void> {
    try {
      this.connection = new HubConnectionBuilder()
        .withUrl(this.hubUrl, {
          withCredentials: false,
          headers: {
            'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}` || ''
          }
        })
        .withAutomaticReconnect()
        .configureLogging(LogLevel.Information)
        .build();

      await this.connection.start();
      console.log('SignalR Connected Successfully');
      
      this.setupConnectionHandlers();
    } catch (error) {
      console.error('SignalR Connection Error:', error);
      throw error;
    }
  }

  // Setup connection event handlers
  private setupConnectionHandlers(): void {
    if (!this.connection) return;

    this.connection.onreconnecting(() => {
      console.log('SignalR Reconnecting...');
    });

    this.connection.onreconnected(() => {
      console.log('SignalR Reconnected Successfully');
    });

    this.connection.onclose(() => {
      console.log('SignalR Connection Closed');
    });
  }

  // Send message to support
  async sendSupportMessage(message: string, userId?: string): Promise<void> {
    if (this.connection?.state === 'Connected') {
      try {
        await this.connection.invoke('SendSupportMessage', {
          message,
          userId: userId || 'anonymous',
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error sending support message:', error);
        throw error;
      }
    } else {
      throw new Error('SignalR connection is not established');
    }
  }

  // Join support room
  async joinSupportRoom(roomId: string): Promise<void> {
    if (this.connection?.state === 'Connected') {
      try {
        await this.connection.invoke('JoinSupportRoom', roomId);
      } catch (error) {
        console.error('Error joining support room:', error);
        throw error;
      }
    }
  }

  // Listen for incoming messages
  onReceiveMessage(callback: (user: string, message: string, timestamp: string) => void): void {
    if (this.connection) {
      this.connection.on('ReceiveSupportMessage', callback);
    }
  }

  // Listen for support agent status
  onAgentStatusChange(callback: (isOnline: boolean) => void): void {
    if (this.connection) {
      this.connection.on('AgentStatusChanged', callback);
    }
  }

  // Listen for typing indicators
  onUserTyping(callback: (userId: string, isTyping: boolean) => void): void {
    if (this.connection) {
      this.connection.on('UserTyping', callback);
    }
  }

  // Send typing indicator
  async sendTypingIndicator(isTyping: boolean, userId?: string): Promise<void> {
    if (this.connection?.state === 'Connected') {
      try {
        await this.connection.invoke('SendTypingIndicator', {
          userId: userId || 'anonymous',
          isTyping
        });
      } catch (error) {
        console.error('Error sending typing indicator:', error);
      }
    }
  }

  // Stop connection
  async stopConnection(): Promise<void> {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  // Get connection state
  getConnectionState(): string {
    return this.connection?.state || 'Disconnected';
  }

  // Check if connected
  isConnected(): boolean {
    return this.connection?.state === 'Connected';
  }
}

export const signalRService = new SignalRService();
