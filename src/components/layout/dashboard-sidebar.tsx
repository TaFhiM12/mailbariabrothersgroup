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
  Sparkles,
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
      <aside className="hidden min-h-screen w-72 shrink-0 overflow-y-auto border-r border-slate-800 bg-slate-950 px-4 py-6 text-white lg:block lg:h-screen">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-black/20">
          <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-2xl" />
          <div className="absolute -bottom-12 left-8 h-24 w-24 rounded-full bg-cyan-400/10 blur-2xl" />

          <div className="relative flex items-center gap-3">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl border border-emerald-300/20 bg-slate-950 text-emerald-300 shadow-lg shadow-emerald-950/20">
              <ShieldCheck size={25} />
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-black leading-5 text-white">
                Mailbaria Club
              </p>
              <p className="mt-1 truncate text-xs font-bold text-slate-400">
                Savings Management Suite
              </p>
            </div>
          </div>

          <div className="relative mt-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.14)]" />
              <span className="truncate text-[11px] font-black uppercase text-slate-300">
                Live Workspace
              </span>
            </div>
            <Sparkles size={15} className="shrink-0 text-emerald-300" />
          </div>

          <div className="relative mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/[0.06] px-3 py-2">
              <p className="text-[10px] font-black uppercase text-slate-500">
                Role
              </p>
              <p className="mt-1 truncate text-xs font-black text-emerald-200">
                {user?.role || "Member"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/[0.06] px-3 py-2">
              <p className="text-[10px] font-black uppercase text-slate-500">
                Mode
              </p>
              <p className="mt-1 text-xs font-black text-white">Club</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 space-y-1">
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
