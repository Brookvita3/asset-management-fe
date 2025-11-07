import { useState, useEffect } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { formatDateTime } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { 
  Notification,
  getNotificationsByUserIdAPI, 
  markAsReadAPI,
  markAllAsReadAPI,
  deleteNotificationAPI 
} from '../services/notificationAPI';
import { toast } from 'sonner';

export function NotificationBell() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Fetch notifications when component mounts or user changes
  useEffect(() => {
    if (currentUser?.id) {
      fetchNotifications();
    }
  }, [currentUser?.id]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (!currentUser?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentUser?.id]);

  const fetchNotifications = async () => {
    if (!currentUser?.id) return;

    try {
      const response = await getNotificationsByUserIdAPI(Number(currentUser.id));
      const data = response.data || [];
      // Sort notifications by createdAt from newest to oldest
      const sortedData = data.sort((a: Notification, b: Notification) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });
      setNotifications(sortedData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (notification.isRead) return;

    try {
      await markAsReadAPI(notification.id, notification);
      // Update local state
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Không thể đánh dấu đã đọc');
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!currentUser?.id || unreadCount === 0) return;

    setLoading(true);
    try {
      await markAllAsReadAPI(Number(currentUser.id), notifications);
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      toast.success('Đã đánh dấu tất cả là đã đọc');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Không thể đánh dấu tất cả');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: number) => {
    // Prevent triggering the notification click event
    e.stopPropagation();

    try {
      await deleteNotificationAPI(notificationId);
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast.success('Đã xóa thông báo');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Không thể xóa thông báo');
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'ERROR':
        return 'border-l-4 border-l-red-500 bg-red-50';
      case 'WARNING':
        return 'border-l-4 border-l-yellow-500 bg-yellow-50';
      case 'SUCCESS':
        return 'border-l-4 border-l-green-500 bg-green-50';
      default:
        return 'border-l-4 border-l-blue-500 bg-blue-50';
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read when clicked
    await handleMarkAsRead(notification);

    // Close popover
    setIsOpen(false);

    // Navigate based on notification content
    if (notification.linkUrl) {
      // If there's a custom link URL, use it
      navigate(notification.linkUrl);
    } else if (notification.assetId) {
      // Navigate to assets page with assetId as query param to auto-open detail dialog
      navigate(`/assets?assetId=${notification.assetId}`);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
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
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <>
                  <Badge variant="secondary">{unreadCount} chưa đọc</Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    disabled={loading}
                    className="text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Đánh dấu đã đọc
                  </Button>
                </>
              )}
            </div>
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
                  className={`relative group flex items-center gap-2 p-4 hover:bg-gray-50 transition-colors ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  } ${getNotificationColor(notification.type)}`}
                >
                  <div 
                    className="flex-1 flex justify-between items-start gap-2 cursor-pointer"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-2">
                        {notification.createdAt ? formatDateTime(new Date(notification.createdAt)) : 'Vừa xong'}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1" />
                    )}
                  </div>
                  
                  {/* Delete button - shows on hover, centered vertically */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-700 flex-shrink-0"
                    onClick={(e: React.MouseEvent) => handleDeleteNotification(e, notification.id)}
                    title="Xóa thông báo"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
