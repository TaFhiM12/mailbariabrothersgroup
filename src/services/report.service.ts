import { api } from "@/lib/api";
import type {
  ClubFinancialSummaryResponse,
  MonthlyCollectionReportResponse,
  MonthlyExpenseReportResponse,
  UnpaidMembersReportResponse,
} from "@/types/report";

const monthParams = (month: string) => ({
  params: {
    month,
  },
});

export const reportService = {
  monthlyCollection: async (month: string) => {
    const response = await api.get<MonthlyCollectionReportResponse>(
      "/reports/monthly-collection",
      monthParams(month)
    );
    return response.data;
  },

  monthlyExpenses: async (month: string) => {
    const response = await api.get<MonthlyExpenseReportResponse>(
      "/reports/monthly-expenses",
      monthParams(month)
    );
    return response.data;
  },

  unpaidMembers: async (month: string) => {
    const response = await api.get<UnpaidMembersReportResponse>(
      "/reports/unpaid-members",
      monthParams(month)
    );
    return response.data;
  },

  financialSummary: async () => {
    const response = await api.get<ClubFinancialSummaryResponse>(
      "/reports/club-financial-summary"
    );
    return response.data;
  },
};
