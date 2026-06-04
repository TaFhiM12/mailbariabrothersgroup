"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bell, CheckCheck, Home, LogOut, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { useAuthStore } from "@/store/auth.store";
import type { Notification } from "@/types/notification";

export function DashboardHeader() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setIsNotificationsLoading(true);
      const [notificationsResult, unreadResult] = await Promise.all([
        notificationService.getMy(),
        notificationService.unreadCount(),
      ]);

      setNotifications(notificationsResult.data.slice(0, 5));
      setUnreadCount(unreadResult.data.unreadCount);
    } catch {
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setIsNotificationsLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch {
      // Keep the dropdown quiet; the full notifications page has toasts.
    }
  };

  const handleToggleNotifications = async () => {
    const nextOpen = !isNotificationsOpen;
    setIsNotificationsOpen(nextOpen);

    if (nextOpen) {
      await loadNotifications();
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadNotifications());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-base font-bold text-slate-900 sm:text-lg">
            Welcome back, {user?.name || "Member"}
          </h2>
          <p className="truncate text-sm font-medium text-slate-600">
            {user?.role || "MEMBER"} dashboard overview
          </p>
        </div>

        <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            placeholder="Search savings, reports, members..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-xl border border-slate-200 p-2 text-slate-700 transition hover:bg-slate-50"
            aria-label="Go to home page"
            title="Home"
          >
            <Home size={20} />
          </Link>

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`relative rounded-xl border p-2 transition ${
                isNotificationsOpen
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
              aria-label="Open notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-black leading-none text-white ring-2 ring-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 top-12 z-50 w-[min(22rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/10">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                  <div>
                    <p className="text-sm font-black text-slate-950">
                      Notifications
                    </p>
                    <p className="text-xs font-semibold text-slate-600">
                      {unreadCount} unread
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={unreadCount === 0}
                    onClick={markAllAsRead}
                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-50 disabled:text-slate-400 disabled:hover:bg-transparent"
                  >
                    <CheckCheck size={14} />
                    Read all
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto">
                  {isNotificationsLoading ? (
                    <p className="px-4 py-5 text-sm font-semibold text-slate-600">
                      Loading notifications...
                    </p>
                  ) : notifications.length === 0 ? (
                    <p className="px-4 py-5 text-sm font-semibold text-slate-600">
                      No notifications found.
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                          notification.isRead ? "bg-white" : "bg-emerald-50/60"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {!notification.isRead && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                          )}
                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-950">
                              {notification.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-700">
                              {notification.message}
                            </p>
                            <p className="mt-2 text-[11px] font-semibold text-slate-500">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <Link
                  href="/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-black text-emerald-700 hover:bg-emerald-50"
                >
                  View all notifications
                </Link>
              </div>
            )}
          </div>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-slate-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <Link
            href="/profile"
            className="hidden h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 text-slate-700 sm:flex sm:items-center sm:justify-center"
            aria-label="Open profile settings"
            title="Profile"
          >
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.name || "Profile"}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-sm font-black">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <span className="hidden sm:inline">Logout</span>
            <LogOut size={18} className="sm:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
