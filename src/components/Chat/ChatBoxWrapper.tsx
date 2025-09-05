'use client';

import { useEffect, useState } from 'react';

export const ChatBox: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [ChatBoxComponent, setChatBoxComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    setIsClient(true);
    
    // Dynamic import both ChatBox and store to avoid SSR issues
    const loadChatBox = async () => {
      try {
        const { ChatBox } = await import('./ChatBox');
        setChatBoxComponent(() => ChatBox);
      } catch (error) {
        console.error('Failed to load ChatBox:', error);
      }
    };
    
    loadChatBox();
  }, []);

  // Sadece client-side'da render et
  if (!isClient || !ChatBoxComponent) {
    return null;
  }

  return <ChatBoxComponent />;
};
