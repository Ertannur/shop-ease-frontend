'use client';

import { useState, useEffect } from 'react';
import { SupportButton } from './SupportButton';
import { LiveChat } from './LiveChat';
import { useAuthStore } from '@/features/auth';

export const LiveSupport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { isAuthed } = useAuthStore();
  
  // Hydration mismatch'i önlemek için client-side'da mount durumunu kontrol et
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isAuthenticated = isMounted ? isAuthed() : false;

  const handleOpenChat = () => {
    if (!isAuthenticated) {
      // Optionally show login prompt or redirect to login
      console.log('User must be logged in to use live support');
      return;
    }
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
  };

  // SSR sırasında hiçbir şey render etme
  if (!isMounted) {
    return null;
  }

  return (
    <>
      <SupportButton 
        onClick={handleOpenChat}
        isOnline={isAuthenticated}
      />
      
      <LiveChat 
        isOpen={isChatOpen}
        onClose={handleCloseChat}
      />
    </>
  );
};
