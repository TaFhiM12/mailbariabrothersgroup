import { api } from "@/lib/api";
import type {
  MarkAllReadResponse,
  NotificationResponse,
  NotificationsResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const notificationService = {
  getMy: async () => {
    const response = await api.get<NotificationsResponse>("/notifications/my");
    return response.data;
  },

  unreadCount: async () => {
    const response = await api.get<UnreadCountResponse>(
      "/notifications/my/unread-count"
    );
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await api.patch<NotificationResponse>(
      `/notifications/${id}/read`
    );
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch<MarkAllReadResponse>(
      "/notifications/read-all"
    );
    return response.data;
  },
};
