import { api } from "@/lib/api";
import type {
  AccountantDashboard,
  CoordinatorDashboard,
  DashboardResponse,
  MemberDashboard,
  PresidentDashboard,
} from "@/types/dashboard";

export const dashboardService = {
  member: async () => {
    const response = await api.get<DashboardResponse<MemberDashboard>>(
      "/dashboard/member"
    );

    return response.data;
  },

  president: async () => {
    const response = await api.get<DashboardResponse<PresidentDashboard>>(
      "/dashboard/president"
    );

    return response.data;
  },

  accountant: async () => {
    const response = await api.get<DashboardResponse<AccountantDashboard>>(
      "/dashboard/accountant"
    );

    return response.data;
  },

  coordinator: async () => {
    const response = await api.get<DashboardResponse<CoordinatorDashboard>>(
      "/dashboard/coordinator"
    );

    return response.data;
  },
};
