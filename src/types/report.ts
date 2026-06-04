import type { ApiResponse } from "./api";
import type { Expense } from "./expense";
import type { Saving } from "./saving";
import type { Role } from "./auth";

export type ReportMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive?: boolean;
};

export type MonthlyCollectionReport = {
  month: string;
  totalCollected: number;
  totalPayments: number;
  savings: Saving[];
};

export type MonthlyExpenseReport = {
  month: string;
  totalActiveExpenses: number;
  totalCancelledExpenses: number;
  totalExpensesCount: number;
  expenses: Expense[];
};

export type UnpaidMembersReport = {
  month: string;
  activeMembersCount: number;
  paidMembersCount: number;
  unpaidMembersCount: number;
  collectionRate: number;
  unpaidMembers: ReportMember[];
};

export type ClubFinancialSummary = {
  totalApprovedSavings: number;
  totalActiveExpenses: number;
  totalCancelledExpenses: number;
  currentClubBalance: number;
};

export type MonthlyCollectionReportResponse =
  ApiResponse<MonthlyCollectionReport>;
export type MonthlyExpenseReportResponse = ApiResponse<MonthlyExpenseReport>;
export type UnpaidMembersReportResponse = ApiResponse<UnpaidMembersReport>;
export type ClubFinancialSummaryResponse = ApiResponse<ClubFinancialSummary>;
