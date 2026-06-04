import type { ApiResponse } from "./api";

export type Notification = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export type NotificationsResponse = ApiResponse<Notification[]>;
export type NotificationResponse = ApiResponse<Notification>;
export type UnreadCountResponse = ApiResponse<{ unreadCount: number }>;
export type MarkAllReadResponse = ApiResponse<{ count: number }>;
