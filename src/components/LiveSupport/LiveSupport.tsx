'use client';

import { useState } from 'react';
import { SupportButton } from './SupportButton';
import { LiveChat } from './LiveChat';
import { useAuthStore } from '@/features/auth';

export const LiveSupport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { isAuthed } = useAuthStore();
  const isAuthenticated = isAuthed();

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
