import { 
  ChatMessage, 
  ChatUser, 
  SupportUser, 
  SendMessageRequest,
  GetChatsResponse,
  GetUsersResponse,
  GetSupportResponse,
  ChatApiError
} from '@/Types';

// Backend API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://eticaret-dgf7fgcehscsfka3.canadacentral-01.azurewebsites.net';

// Token'ı al - Auth store'unuzun token metodunu kullanın
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  // Mevcut auth sisteminizle uyumlu olacak şekilde token'ı alın
  return localStorage.getItem('token') || localStorage.getItem('auth_token');
};

// API request helper function
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication required');
  }

  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };

  console.log('=== Chat API Request ===');
  console.log('URL:', url);
  console.log('Method:', config.method || 'GET');
  console.log('Headers:', config.headers);
  if (config.body) {
    console.log('Body:', config.body);
  }

  try {
    const response = await fetch(url, config);
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    // 401 - Unauthorized
    if (response.status === 401) {
      throw new Error('Unauthorized - Please login again');
    }
    
    // 403 - Forbidden (role yetki hatası)
    if (response.status === 403) {
      throw new Error('Access denied - Insufficient permissions');
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Chat API Error Response:', errorText);
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }

    // 200 response ama body yok (SendMessage için)
    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.log('✅ Chat API Success (no JSON response)');
      return {} as T;
    }

    const responseData = await response.json();
    console.log('✅ Chat API Success Response:', responseData);
    return responseData;
  } catch (error) {
    console.error(`Chat API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Helper function for retry logic - fallback için
const retryRequest = async <T>(
  request: () => Promise<T>, 
  maxRetries: number = 2,
  delay: number = 1000
): Promise<T> => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await request();
    } catch (error) {
      if (attempt === maxRetries) {
        console.warn('Chat API request failed after retries, using mock data');
        throw error;
      }
      console.warn(`Chat API request failed, retrying in ${delay}ms... (attempt ${attempt + 1}/${maxRetries + 1})`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
};

// Mock data for development when backend is not available
const mockUsers: ChatUser[] = [
  { id: '1', fullName: 'Ali Yılmaz' },
  { id: '2', fullName: 'Ayşe Demir' },
  { id: '3', fullName: 'Mehmet Kaya' }
];

const mockSupportUsers: SupportUser[] = [
  { id: 'support-1', fullName: 'Müşteri Hizmetleri' }
];

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    userId: 'support-1',
    toUserId: '1',
    message: 'Merhaba! Size nasıl yardımcı olabilirim?',
    createdDate: new Date().toISOString()
  }
];

export const chatApi = {
  /**
   * 1. GetChats - Belirli kullanıcıyla olan chat mesajlarını getir
   * Backend URL: /api/Chat/GetChats?toUserId={toUserId}
   * Roller: Admin, User, Support
   */
  getChats: async (toUserId: string): Promise<GetChatsResponse> => {
    try {
      return await apiRequest<GetChatsResponse>(`/api/Chat/GetChats?toUserId=${toUserId}`);
    } catch (error) {
      console.warn('GetChats failed, using mock data:', error);
      return mockMessages.filter(msg => 
        msg.toUserId === toUserId || msg.userId === toUserId
      );
    }
  },

  /**
   * 2. GetUsers - Mesajlaşılabilir kullanıcıları getir (Admin/Support için)
   * Backend URL: /api/Chat/GetUsers
   * Roller: Admin, Support
   */
  getUsers: async (): Promise<GetUsersResponse> => {
    try {
      return await apiRequest<GetUsersResponse>('/api/Chat/GetUsers');
    } catch (error) {
      console.warn('GetUsers failed, using mock data:', error);
      return mockUsers;
    }
  },

  /**
   * 3. GetSupport - Müşteri hizmetleri kullanıcılarını getir (User için)
   * Backend URL: /api/Chat/GetSupport
   * Roller: Admin, User
   */
  getSupport: async (): Promise<GetSupportResponse> => {
    console.log('ChatApi.getSupport called');
    try {
      const result = await apiRequest<GetSupportResponse>('/api/Chat/GetSupport');
      console.log('GetSupport result:', result);
      return result;
    } catch (error) {
      console.warn('GetSupport failed, using mock data:', error);
      return mockSupportUsers;
    }
  },

  /**
   * 4. SendMessage - Mesaj gönder
   * Backend URL: /api/Chat/SendMessage (POST)
   * Roller: Admin, User, Support
   * Response: 200 (no body)
   */
  sendMessage: async (messageData: SendMessageRequest): Promise<void> => {
    console.log('ChatApi.sendMessage called with:', messageData);
    
    try {
      await apiRequest<void>('/api/Chat/SendMessage', {
        method: 'POST',
        body: JSON.stringify(messageData),
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('SendMessage API error:', error);
      // Development için mock success
      console.warn('SendMessage failed, simulating success for development');
      return Promise.resolve();
    }
  },
};

// Error handling helper
export const handleChatApiError = (error: unknown): ChatApiError => {
  if (error instanceof Error) {
    return {
      message: error.message,
      status: error.message.includes('401') ? 401 : 
              error.message.includes('403') ? 403 : 
              error.message.includes('404') ? 404 : 500
    };
  }
  
  return {
    message: 'An unknown error occurred',
    status: 500
  };
};
