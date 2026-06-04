import { api } from "@/lib/api";
import type { AuditLogsResponse } from "@/types/audit-log";

export const activityFeedService = {
  recent: async () => {
    const response = await api.get<AuditLogsResponse>("/activity-feed");
    return response.data;
  },
};
