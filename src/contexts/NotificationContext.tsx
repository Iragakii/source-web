import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  showNotification: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((
    message: string, 
    type: 'success' | 'error' | 'warning' | 'info', 
    duration: number = 5000
  ) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after duration
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const value: NotificationContextType = {
    notifications,
    showNotification,
    removeNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onRemove }) => {
  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-600 border-green-500 text-white';
      case 'error':
        return 'bg-red-600 border-red-500 text-white';
      case 'warning':
        return 'bg-yellow-600 border-yellow-500 text-black';
      case 'info':
        return 'bg-[#61b3dc] border-[#61b3dc] text-black';
      default:
        return 'bg-gray-600 border-gray-500 text-white';
    }
  };

  return (
    <div
      className={`
        ${getNotificationStyles(notification.type)}
        border-2 rounded-lg p-4 min-w-[300px] max-w-[400px]
        shadow-lg transform transition-all duration-300 ease-in-out
        slide-in-from-right
      `}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-mono text-sm font-medium">
            [{notification.type.toUpperCase()}]
          </p>
          <p className="font-mono text-sm mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="ml-4 text-current hover:opacity-70 transition-opacity duration-200 font-mono text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  );
};
