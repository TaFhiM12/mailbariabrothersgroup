"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CircleDollarSign, Clock, PiggyBank } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { useAuthStore } from "@/store/auth.store";
import { dashboardService } from "@/services/dashboard.service";
import type {
  AccountantDashboard,
  CoordinatorDashboard,
  MemberDashboard,
  PresidentDashboard,
} from "@/types/dashboard";
import { ProtectedRoute } from "@/components/shared/protected-route";

type DashboardData =
  | MemberDashboard
  | PresidentDashboard
  | AccountantDashboard
  | CoordinatorDashboard;

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    const fetchDashboard = async () => {
      try {
        if (user?.role === "PRESIDENT") {
          const result = await dashboardService.president();
          setDashboard(result.data);
        } else if (user?.role === "ACCOUNTANT") {
          const result = await dashboardService.accountant();
          setDashboard(result.data);
        } else if (user?.role === "COORDINATOR") {
          const result = await dashboardService.coordinator();
          setDashboard(result.data);
        } else {
          const result = await dashboardService.member();
          setDashboard(result.data);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router, user?.role]);

  if (loading) {
    return (
      <DashboardShell>
        <p className="text-slate-500">Loading dashboard...</p>
      </DashboardShell>
    );
  }

  const isPresident = dashboard?.role === "PRESIDENT";
  const isAccountant = dashboard?.role === "ACCOUNTANT";
  const isCoordinator = dashboard?.role === "COORDINATOR";
  const hasFinance = isPresident || isAccountant;

  const balance = hasFinance
    ? dashboard.finance.currentClubBalance
    : isCoordinator
    ? 0
    : dashboard?.savings.currentBalance ?? 0;

  const totalSavings = hasFinance
    ? dashboard.finance.totalApprovedSavings
    : isCoordinator
    ? 0
    : dashboard?.savings.totalApprovedSavings ?? 0;

  const pendingSavings = hasFinance
    ? dashboard.savings.pendingSavings
    : isCoordinator
    ? dashboard.reminders.pendingReminders
    : dashboard?.savings.myPendingSavings ?? 0;

  const unreadNotifications = isPresident
    ? dashboard.system?.unreadNotifications ?? 0
    : isAccountant || isCoordinator
    ? dashboard.unreadNotifications
    : dashboard?.notifications.unreadNotifications ?? 0;

  return (
    <ProtectedRoute>
        <DashboardShell>
      <div className="grid gap-6">
        <section className="rounded-3xl bg-slate-950 p-8 text-white shadow">
          <p className="text-sm font-medium text-emerald-400">
            {user?.role || "MEMBER"} DASHBOARD
          </p>

          <h1 className="mt-3 text-3xl font-bold">
            Welcome back, {user?.name || "Member"}
          </h1>

          <p className="mt-2 max-w-2xl text-slate-300">
            Track savings, expenses, reports and club activities from one secure
            private dashboard.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Current Balance"
            value={`৳ ${balance}`}
            icon={<CircleDollarSign size={22} />}
          />

          <StatCard
            title="Total Savings"
            value={`৳ ${totalSavings}`}
            icon={<PiggyBank size={22} />}
          />

          <StatCard
            title="Pending Savings"
            value={String(pendingSavings)}
            icon={<Clock size={22} />}
          />

          <StatCard
            title="Notifications"
            value={String(unreadNotifications)}
            icon={<Bell size={22} />}
          />
        </section>

        {(isPresident || isCoordinator) && (
          <section className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Total Members"
              value={String(dashboard.members.totalMembers)}
            />

            <StatCard
              title="Paid This Month"
              value={String(
                isCoordinator
                  ? dashboard.members.paidMembersThisMonth
                  : dashboard.savings.paidMembersThisMonth
              )}
            />

            <StatCard
              title="Collection Rate"
              value={
                isCoordinator
                  ? `${dashboard.members.unpaidMembersThisMonth} unpaid`
                  : `${dashboard.savings.collectionRate}%`
              }
            />
          </section>
        )}
      </div>
    </DashboardShell>
    </ProtectedRoute>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{title}</p>
        {icon && (
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
            {icon}
          </div>
        )}
      </div>

      <h2 className="mt-3 text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}
