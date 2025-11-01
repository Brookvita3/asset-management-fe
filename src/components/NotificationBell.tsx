import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockNotifications } from '../lib/mockData';
import { formatDateTime } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export function NotificationBell() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [notifications] = useState(
    mockNotifications.filter(n => currentUser && n.userId === currentUser.id)
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'success':
        return 'border-l-4 border-l-green-500 bg-green-50';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50';
    }
  };

  const handleNotificationClick = (assetId?: string) => {
    if (assetId) {
      navigate(`/assets/${assetId}`);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Thông báo</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} chưa đọc</Badge>
            )}
          </div>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Không có thông báo mới
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  } ${getNotificationColor(notification.type)}`}
                  onClick={() => handleNotificationClick(notification.assetId)}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {formatDateTime(notification.createdAt)}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
