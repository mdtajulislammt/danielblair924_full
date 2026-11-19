import { Fetch } from "@/lib/Fetch";
import { unwrap } from "@/lib/apiResponse";

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  items: NotificationItem[];
  total: number;
  unreadCount: number;
  page: number;
  limit: number;
}

export const NotificationService = {
  getNotifications: async (page = 1, limit = 20): Promise<NotificationListResponse> => {
    const response = await Fetch.get(`/notifications?page=${page}&limit=${limit}`);
    return unwrap<NotificationListResponse>(response);
  },

  getUnreadCount: async (): Promise<{ unreadCount: number }> => {
    const response = await Fetch.get("/notifications/unread-count");
    return unwrap<{ unreadCount: number }>(response);
  },

  markAsRead: async (id: string): Promise<NotificationItem> => {
    const response = await Fetch.patch(`/notifications/${id}/read`, {});
    return unwrap<NotificationItem>(response);
  },

  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await Fetch.post("/notifications/read-all", {});
    return unwrap<{ count: number }>(response);
  },

  deleteNotification: async (id: string): Promise<any> => {
    const response = await Fetch.delete(`/notifications/${id}`);
    return unwrap(response);
  },
};

