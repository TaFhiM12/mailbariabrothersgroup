export type MemberDashboard = {
  role: "MEMBER";
  month: string;
  savings: {
    totalApprovedSavings: number;
    currentBalance: number;
    myPendingSavings: number;
    thisMonthPaymentStatus: "PAID" | "UNPAID";
    lastPaymentDate: string | null;
  };
  notifications: {
    unreadNotifications: number;
  };
};

export type PresidentDashboard = {
  role: "PRESIDENT";
  month: string;
  members: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
  };
  finance: {
    totalApprovedSavings: number;
    totalActiveExpenses: number;
    totalCancelledExpenses: number;
    currentClubBalance: number;
  };
  savings: {
    pendingSavings: number;
    rejectedSavings: number;
    paidMembersThisMonth: number;
    unpaidMembersThisMonth: number;
    collectionRate: number;
  };
  reminders: {
    totalReminders: number;
    failedReminders: number;
  };
  system: {
    totalNotices: number;
    unreadNotifications: number;
  };
};

export type AccountantDashboard = {
  role: "ACCOUNTANT";
  month: string;
  finance: {
    totalApprovedSavings: number;
    totalActiveExpenses: number;
    currentClubBalance: number;
  };
  savings: {
    pendingSavings: number;
    paidMembersThisMonth: number;
    unpaidMembersThisMonth: number;
    collectionRate: number;
  };
  unreadNotifications: number;
};

export type CoordinatorDashboard = {
  role: "COORDINATOR";
  month: string;
  members: {
    totalMembers: number;
    activeMembers: number;
    inactiveMembers: number;
    paidMembersThisMonth: number;
    unpaidMembersThisMonth: number;
  };
  reminders: {
    pendingReminders: number;
    sentReminders: number;
  };
  notices: {
    totalNotices: number;
  };
  unreadNotifications: number;
};

export type DashboardResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
