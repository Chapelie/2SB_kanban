import { useState, useEffect } from 'react';

type NotificationType = 'success' | 'error';

interface Notification {
  message: string;
  type: NotificationType;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);
  
  const showNotification = (message: string, type: NotificationType) => {
    setNotification({ message, type });
  };
  
  // Nettoyer les notifications après 3 secondes
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  return { notification, showNotification };
};

export default useNotification;