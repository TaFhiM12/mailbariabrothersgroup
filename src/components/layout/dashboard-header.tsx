"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Command,
  Home,
  LogOut,
  Search,
  ShieldCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { notificationService } from "@/services/notification.service";
import { useAuthStore } from "@/store/auth.store";
import type { Notification } from "@/types/notification";

const pageLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/savings": "Savings",
  "/expenses": "Expenses",
  "/notifications": "Notifications",
  "/profile": "Profile",
  "/notices": "Notices",
  "/members": "Members",
  "/reports": "Reports",
  "/audit-logs": "Audit Logs",
  "/settings": "Settings",
};

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isNotificationsLoading, setIsNotificationsLoading] = useState(false);
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const currentPage = pageLabels[normalizedPath] || "Workspace";

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
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-xl sm:px-6">
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 xl:grid-cols-[280px_minmax(280px,1fr)_auto]">
        <div className="flex min-w-0 items-center gap-3 xl:w-[280px]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-emerald-300 shadow-lg shadow-slate-950/10">
            <ShieldCheck size={22} />
          </div>

          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-2">
              <h2 className="max-w-[9rem] truncate text-base font-black leading-5 text-slate-950 sm:max-w-[13rem] sm:text-lg xl:max-w-[11rem]">
                Mailbaria Club
              </h2>
              <ChevronRight
                size={16}
                className="hidden shrink-0 text-slate-300 2xl:block"
              />
              <p className="hidden max-w-[6rem] truncate text-sm font-black text-slate-500 2xl:block">
                {currentPage}
              </p>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
              <p className="max-w-[9rem] truncate text-xs font-bold uppercase text-slate-500 sm:max-w-[13rem] xl:max-w-[12rem]">
                {user?.role || "MEMBER"} workspace
              </p>
            </div>
          </div>
        </div>

        <div className="hidden h-12 min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 shadow-inner shadow-white xl:flex">
          <Search size={19} className="text-slate-400" />
          <input
            placeholder="Search savings, reports, members..."
            className="w-full bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
          />
          <div className="hidden items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-black text-slate-400 xl:flex">
            <Command size={12} />
            K
          </div>
        </div>

        <div className="flex min-w-0 shrink-0 items-center justify-end gap-2 sm:gap-3">
          <Link
            href="/"
            className="rounded-2xl border border-slate-200 bg-white p-2.5 text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Go to home page"
            title="Home"
          >
            <Home size={20} />
          </Link>

          <div ref={notificationRef} className="relative">
            <button
              type="button"
              onClick={handleToggleNotifications}
              className={`relative rounded-2xl border p-2.5 shadow-sm transition ${
                isNotificationsOpen
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
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

          <div className="hidden min-w-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-right shadow-sm lg:block">
            <p className="max-w-36 truncate text-sm font-black text-slate-950 2xl:max-w-44">
              {user?.name || "User"}
            </p>
            <p className="max-w-36 truncate text-xs font-semibold text-slate-500 2xl:max-w-44">
              {user?.email}
            </p>
          </div>

          <Link
            href="/profile"
            className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-slate-700 shadow-sm sm:flex sm:items-center sm:justify-center"
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
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-5 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800"
          >
            <span className="hidden sm:inline">Logout</span>
            <LogOut size={18} className="sm:hidden" />
          </button>
        </div>
      </div>
    </header>
  );
}
