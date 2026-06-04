"use client";

import { useEffect, useState } from "react";
import { CheckCheck, MailOpen } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { notificationService } from "@/services/notification.service";
import type { Notification } from "@/types/notification";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getMy();
      setNotifications(result.data);
    } catch {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      setActionLoading(true);
      await notificationService.markAllAsRead();
      toast.success("Notifications marked as read");
      await loadNotifications();
    } catch {
      toast.error("Failed to mark notifications as read");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadNotifications());
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Notifications
              </h1>
              <p className="text-sm text-slate-500">
                {unreadCount} unread notification{unreadCount === 1 ? "" : "s"}.
              </p>
            </div>

            <button
              disabled={actionLoading || unreadCount === 0}
              onClick={markAllAsRead}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          </div>

          <div className="grid gap-3">
            {loading ? (
              <PanelText>Loading notifications...</PanelText>
            ) : notifications.length === 0 ? (
              <PanelText>No notifications found.</PanelText>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border bg-white p-5 shadow-sm ${
                    notification.isRead
                      ? "border-transparent"
                      : "border-emerald-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-bold text-slate-900">
                        {notification.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {notification.message}
                      </p>
                      <p className="mt-3 text-xs text-slate-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {!notification.isRead && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="rounded-xl p-2 text-emerald-600 transition hover:bg-emerald-50"
                        aria-label="Mark notification as read"
                      >
                        <MailOpen size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}

function PanelText({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
      {children}
    </div>
  );
}
