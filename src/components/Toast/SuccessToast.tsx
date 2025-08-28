import React, { useState, useEffect } from 'react';

interface SuccessToastProps {
  show: boolean;
  message: string;
  onClose: () => void;
  duration?: number;
}

const SuccessToast: React.FC<SuccessToastProps> = ({ 
  show, 
  message, 
  onClose, 
  duration = 2000 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      setIsLeaving(false);
      
      // Duration kadar bekle, sonra fade out animasyonu başlat
      const timer = setTimeout(() => {
        setIsLeaving(true);
        
        // Fade out animasyonu için biraz daha bekle
        setTimeout(() => {
          setIsVisible(false);
          onClose();
        }, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        className={`bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transition-all duration-300 transform ${
          isLeaving 
            ? 'opacity-0 scale-95 translate-y-2' 
            : 'opacity-100 scale-100 translate-y-0'
        }`}
      >
        <div className="flex items-center space-x-3">
          {/* Başarı İkonu */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">{message}</span>
        </div>
      </div>
    </div>
  );
};

export default SuccessToast;
