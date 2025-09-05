'use client';

import React from 'react';
import { useChatStore } from '@/features/chat';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const UserDropdown: React.FC = () => {
  const {
    users,
    supportUsers,
    selectedUserId,
    selectUser,
    unreadMessages,
  } = useChatStore();

  // Use either users or supportUsers based on what's available
  const availableUsers = users.length > 0 ? users : supportUsers;

  const handleUserSelect = (userId: string) => {
    selectUser(userId);
  };

  const getUnreadCount = (userId: string): number => {
    return unreadMessages[userId] || 0;
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Konuşmak istediğiniz kişi:
      </label>
      
      <div className="relative">
        <select
          value={selectedUserId || ''}
          onChange={(e) => handleUserSelect(e.target.value)}
          className="w-full p-2 pr-8 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm"
        >
          <option value="">Kullanıcı seçin...</option>
          {availableUsers.map((user) => (
            <option key={user.id} value={user.id}>
              {user.fullName}
              {getUnreadCount(user.id) > 0 && ` (${getUnreadCount(user.id)} yeni)`}
            </option>
          ))}
        </select>
        
        <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Alternative: Custom dropdown with badges */}
      <div className="mt-2">
        {availableUsers.map((user) => {
          const unreadCount = getUnreadCount(user.id);
          const isSelected = selectedUserId === user.id;
          
          return (
            <div
              key={user.id}
              onClick={() => handleUserSelect(user.id)}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                isSelected 
                  ? 'bg-blue-100 border border-blue-300' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className={`text-sm ${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                {user.fullName}
              </span>
              
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {availableUsers.length === 0 && (
        <div className="text-gray-500 text-sm text-center py-4">
          Henüz kullanıcı bulunamadı
        </div>
      )}
    </div>
  );
};
