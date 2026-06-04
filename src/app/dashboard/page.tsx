"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Bell,
  CircleDollarSign,
  Clock,
  FileText,
  PiggyBank,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { dashboardService } from "@/services/dashboard.service";
import { useAuthStore } from "@/store/auth.store";
import type {
  AccountantDashboard,
  CoordinatorDashboard,
  MemberDashboard,
  PresidentDashboard,
} from "@/types/dashboard";

type DashboardData =
  | MemberDashboard
  | PresidentDashboard
  | AccountantDashboard
  | CoordinatorDashboard;

const currency = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    if (!user?.role) return;

    try {
      setLoading(true);
      setError("");

      const result =
        user.role === "PRESIDENT"
          ? await dashboardService.president()
          : user.role === "ACCOUNTANT"
          ? await dashboardService.accountant()
          : user.role === "COORDINATOR"
          ? await dashboardService.coordinator()
          : await dashboardService.member();

      setDashboard(result.data);
    } catch {
      setError("Could not load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadDashboard());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role]);

  const metrics = useMemo(() => buildMetrics(dashboard), [dashboard]);
  const quickActions = useMemo(
    () => buildQuickActions(user?.role || "MEMBER"),
    [user?.role]
  );
  const collectionRate = getCollectionRate(dashboard);
  const paymentStatus = getPaymentStatus(dashboard);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="space-y-5">
          <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/10">
            <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[1fr_340px]">
              <div className="flex min-w-0 flex-col justify-between gap-8">
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-emerald-200">
                    <ShieldCheck size={15} />
                    {user?.role || "MEMBER"} workspace
                  </div>

                  <div className="mt-5 flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/10">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          alt={user.name || "Profile"}
                          width={64}
                          height={64}
                          className="h-full w-full object-cover"
                          priority
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-2xl font-black text-emerald-200">
                          {(user?.name || "M").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h1 className="truncate text-3xl font-black tracking-tight sm:text-4xl">
                        Welcome back, {user?.name || "Member"}
                      </h1>
                      <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base">
                        Monitor savings, approvals, expenses and member activity
                        from one polished control room.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {quickActions.slice(0, 4).map((action) => {
                    const Icon = action.icon;

                    return (
                      <Link
                        key={action.href}
                        href={action.href}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-100"
                      >
                        <Icon size={18} />
                        {action.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-sm font-black text-emerald-200">
                  {dashboard?.month || "Current month"}
                </p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-300">
                  Collection health and account activity snapshot.
                </p>

                <div className="mt-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase text-slate-400">
                        Collection Rate
                      </p>
                      <p className="mt-1 text-4xl font-black">
                        {collectionRate}%
                      </p>
                    </div>
                    <TrendingUp className="text-emerald-300" size={34} />
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-400"
                      style={{ width: `${Math.min(collectionRate, 100)}%` }}
                    />
                  </div>
                </div>

                {paymentStatus && (
                  <div className="mt-5 rounded-2xl bg-slate-950/60 p-4">
                    <p className="text-xs font-bold uppercase text-slate-400">
                      Your Payment
                    </p>
                    <p className="mt-1 text-xl font-black text-white">
                      {paymentStatus}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {loading ? (
            <DashboardMessage>Loading dashboard...</DashboardMessage>
          ) : error ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-5">
              <p className="text-sm font-bold text-red-700">{error}</p>
              <button
                type="button"
                onClick={loadDashboard}
                className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          ) : (
            <>
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {metrics.map((metric) => (
                  <StatCard key={metric.title} {...metric} />
                ))}
              </section>

              <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-950">
                        Smart Shortcuts
                      </h2>
                      <p className="text-sm font-medium text-slate-600">
                        Common actions for your current role.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {quickActions.map((action) => {
                      const Icon = action.icon;

                      return (
                        <Link
                          key={action.href}
                          href={action.href}
                          className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4 transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                          <span className="flex items-center gap-3">
                            <span className="rounded-xl bg-slate-100 p-2 text-slate-700 group-hover:bg-white group-hover:text-emerald-700">
                              <Icon size={20} />
                            </span>
                            <span>
                              <span className="block text-sm font-black text-slate-950">
                                {action.label}
                              </span>
                              <span className="text-xs font-semibold text-slate-600">
                                {action.description}
                              </span>
                            </span>
                          </span>
                          <ArrowRight
                            className="text-slate-400 group-hover:text-emerald-700"
                            size={18}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-3xl bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-black text-slate-950">
                    Account Health
                  </h2>
                  <div className="mt-5 space-y-4">
                    <HealthRow
                      label="Profile"
                      value={user?.imageUrl ? "Photo added" : "Add photo"}
                      good={Boolean(user?.imageUrl)}
                    />
                    <HealthRow
                      label="Mobile"
                      value={user?.phone ? "Saved" : "Missing"}
                      good={Boolean(user?.phone)}
                    />
                    <HealthRow
                      label="Notifications"
                      value={`${getUnreadNotifications(dashboard)} unread`}
                      good={getUnreadNotifications(dashboard) === 0}
                    />
                    <Link
                      href="/profile"
                      className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                    >
                      Complete Profile
                    </Link>
                  </div>
                </div>
              </section>
            </>
          )}
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}

function buildMetrics(dashboard: DashboardData | null) {
  if (!dashboard) return [];

  if (dashboard.role === "COORDINATOR") {
    return [
      {
        title: "Active Members",
        value: String(dashboard.members.activeMembers),
        detail: `${dashboard.members.totalMembers} total members`,
        icon: Users,
      },
      {
        title: "Paid Members",
        value: String(dashboard.members.paidMembersThisMonth),
        detail: `${dashboard.members.unpaidMembersThisMonth} unpaid this month`,
        icon: PiggyBank,
      },
      {
        title: "Sent Reminders",
        value: String(dashboard.reminders.sentReminders),
        detail: `${dashboard.reminders.pendingReminders} pending reminders`,
        icon: Clock,
      },
      {
        title: "Unread Alerts",
        value: String(dashboard.unreadNotifications),
        detail: `${dashboard.notices.totalNotices} total notices`,
        icon: Bell,
      },
    ];
  }

  if (dashboard.role === "MEMBER") {
    return [
      {
        title: "Current Balance",
        value: `৳ ${currency(dashboard.savings.currentBalance)}`,
        detail: "Approved personal savings",
        icon: CircleDollarSign,
      },
      {
        title: "Total Savings",
        value: `৳ ${currency(dashboard.savings.totalApprovedSavings)}`,
        detail: "All approved deposits",
        icon: PiggyBank,
      },
      {
        title: "Pending Savings",
        value: String(dashboard.savings.myPendingSavings),
        detail: "Waiting for approval",
        icon: Clock,
      },
      {
        title: "Unread Alerts",
        value: String(dashboard.notifications.unreadNotifications),
        detail: `Payment status: ${dashboard.savings.thisMonthPaymentStatus}`,
        icon: Bell,
      },
    ];
  }

  return [
    {
      title: "Club Balance",
      value: `৳ ${currency(dashboard.finance.currentClubBalance)}`,
      detail: "Savings minus active expenses",
      icon: CircleDollarSign,
    },
    {
      title: "Approved Savings",
      value: `৳ ${currency(dashboard.finance.totalApprovedSavings)}`,
      detail: "Total approved collection",
      icon: PiggyBank,
    },
    {
      title: "Active Expenses",
      value: `৳ ${currency(dashboard.finance.totalActiveExpenses)}`,
      detail: "Current expense total",
      icon: ReceiptText,
    },
    {
      title: "Pending Approvals",
      value: String(dashboard.savings.pendingSavings),
      detail: `${dashboard.savings.unpaidMembersThisMonth} unpaid members`,
      icon: Clock,
    },
  ];
}

function buildQuickActions(role: string) {
  const common = [
    {
      label: "Savings",
      description: "Submit or review savings",
      href: "/savings",
      icon: PiggyBank,
    },
    {
      label: "Notices",
      description: "Read club announcements",
      href: "/notices",
      icon: FileText,
    },
    {
      label: "Notifications",
      description: "Review alerts and reminders",
      href: "/notifications",
      icon: Bell,
    },
    {
      label: "Profile",
      description: "Update member information",
      href: "/profile",
      icon: Users,
    },
  ];

  if (role === "PRESIDENT") {
    return [
      ...common,
      {
        label: "Members",
        description: "Manage roles and status",
        href: "/members",
        icon: Users,
      },
      {
        label: "Reports",
        description: "Export collection data",
        href: "/reports",
        icon: BarChart3,
      },
    ];
  }

  if (role === "ACCOUNTANT") {
    return [
      ...common,
      {
        label: "Expenses",
        description: "Create and review expenses",
        href: "/expenses",
        icon: ReceiptText,
      },
      {
        label: "Reports",
        description: "Analyze financial data",
        href: "/reports",
        icon: BarChart3,
      },
    ];
  }

  if (role === "COORDINATOR") {
    return [
      ...common,
      {
        label: "Members",
        description: "Review active members",
        href: "/members",
        icon: Users,
      },
    ];
  }

  return common;
}

function getCollectionRate(dashboard: DashboardData | null) {
  if (!dashboard) return 0;

  if (dashboard.role === "MEMBER") {
    return dashboard.savings.thisMonthPaymentStatus === "PAID" ? 100 : 0;
  }

  if (dashboard.role === "COORDINATOR") {
    const total = dashboard.members.activeMembers;
    return total > 0
      ? Math.round((dashboard.members.paidMembersThisMonth / total) * 100)
      : 0;
  }

  return dashboard.savings.collectionRate;
}

function getPaymentStatus(dashboard: DashboardData | null) {
  if (!dashboard || dashboard.role !== "MEMBER") return null;

  return dashboard.savings.thisMonthPaymentStatus === "PAID"
    ? "Paid for this month"
    : "Unpaid for this month";
}

function getUnreadNotifications(dashboard: DashboardData | null) {
  if (!dashboard) return 0;

  if (dashboard.role === "PRESIDENT") return dashboard.system.unreadNotifications;
  if (dashboard.role === "MEMBER")
    return dashboard.notifications.unreadNotifications;

  return dashboard.unreadNotifications;
}

function DashboardMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-sm font-bold text-slate-600 shadow-sm">
      {children}
    </div>
  );
}

function StatCard({
  title,
  value,
  detail,
  icon: Icon,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-600">{title}</p>
          <h2 className="mt-3 text-2xl font-black text-slate-950">{value}</h2>
        </div>
        <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-500">{detail}</p>
    </div>
  );
}

function HealthRow({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-black ${
          good ? "bg-emerald-100 text-emerald-800" : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
