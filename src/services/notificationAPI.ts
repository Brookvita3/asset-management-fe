import axios from "./axios.customize";

export interface Notification {
  id: number;
  userId: number;
  assetId: number | null;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR" | "USER_CREATED"|"USER_UPDATED";
  isRead: boolean;
  linkUrl: string | null;
  createdAt?: string;
}

export interface NotificationCreateRequest {
  userId: number;
  assetId?: number;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR" | "USER_CREATED"|"USER_UPDATED";
  isRead?: boolean;
  linkUrl?: string;
}

const BASE_PATH = "/api/v1/notifications";

/**
 * Get all notifications
 */
const getAllNotificationsAPI = () => {
  return axios.get(BASE_PATH);
};

/**
 * Get notifications by user ID
 */
const getNotificationsByUserIdAPI = (userId: number) => {
  return axios.get(`${BASE_PATH}/user/${userId}`);
};

/**
 * Get notification by ID
 */
const getNotificationByIdAPI = (id: number) => {
  return axios.get(`${BASE_PATH}/${id}`);
};

/**
 * Create new notification
 */
const createNotificationAPI = (data: NotificationCreateRequest) => {
  return axios.post(BASE_PATH, data);
};

/**
 * Update notification (mark as read, etc.)
 */
const updateNotificationAPI = (id: number, data: NotificationCreateRequest) => {
  return axios.put(`${BASE_PATH}/${id}`, data);
};

/**
 * Delete notification
 */
const deleteNotificationAPI = (id: number) => {
  return axios.delete(`${BASE_PATH}/${id}`);
};

/**
 * Mark notification as read
 */
const markAsReadAPI = (id: number, notification: Notification) => {
  return axios.put(`${BASE_PATH}/${id}`, {
    ...notification,
    isRead: true,
  });
};

/**
 * Mark all notifications as read for a user
 */
const markAllAsReadAPI = (userId: number, notifications: Notification[]) => {
  const promises = notifications
    .filter(n => !n.isRead)
    .map(n => markAsReadAPI(n.id, n));
  return Promise.all(promises);
};

export {
  getAllNotificationsAPI,
  getNotificationsByUserIdAPI,
  getNotificationByIdAPI,
  createNotificationAPI,
  updateNotificationAPI,
  deleteNotificationAPI,
  markAsReadAPI,
  markAllAsReadAPI,
};
