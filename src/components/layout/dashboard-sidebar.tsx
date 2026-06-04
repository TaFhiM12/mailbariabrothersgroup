"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  PiggyBank,
  ReceiptText,
  Bell,
  FileText,
  Users,
  UserRound,
  BarChart3,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types/auth";

const navItems: {
  label: string;
  href: string;
  icon: React.ElementType;
  roles: Role[];
}[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    roles: ["PRESIDENT", "ACCOUNTANT", "COORDINATOR", "MEMBER"],
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["PRESIDENT", "ACCOUNTANT", "COORDINATOR", "MEMBER"],
  },
  {
    label: "Savings",
    href: "/savings",
    icon: PiggyBank,
    roles: ["PRESIDENT", "ACCOUNTANT", "COORDINATOR", "MEMBER"],
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: ReceiptText,
    roles: ["PRESIDENT", "ACCOUNTANT"],
  },
  {
    label: "Notifications",
    href: "/notifications",
    icon: Bell,
    roles: ["PRESIDENT", "ACCOUNTANT", "COORDINATOR", "MEMBER"],
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
    roles: ["PRESIDENT", "ACCOUNTANT", "COORDINATOR", "MEMBER"],
  },
  {
    label: "Notices",
    href: "/notices",
    icon: FileText,
    roles: ["PRESIDENT", "COORDINATOR", "MEMBER", "ACCOUNTANT"],
  },
  {
    label: "Members",
    href: "/members",
    icon: Users,
    roles: ["PRESIDENT", "COORDINATOR"],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    roles: ["PRESIDENT", "ACCOUNTANT"],
  },
  {
    label: "Audit Logs",
    href: "/audit-logs",
    icon: ShieldCheck,
    roles: ["PRESIDENT"],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    roles: ["PRESIDENT"],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const visibleItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  return (
    <>
      <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950 px-4 py-6 text-white lg:block">
        <div className="px-3">
          <h1 className="text-xl font-bold tracking-tight">Mailbaria Club</h1>
          <p className="mt-1 text-xs font-medium text-slate-300">
            Savings Management System
          </p>
        </div>

        <nav className="mt-8 space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  isActive
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-200 hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 py-2 shadow-2xl backdrop-blur lg:hidden">
        <div className="flex gap-1 overflow-x-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-20 flex-col items-center gap-1 rounded-xl px-3 py-2 text-xs font-bold transition ${
                  isActive
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Icon size={18} />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
