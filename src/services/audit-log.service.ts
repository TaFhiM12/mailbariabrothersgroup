import { api } from "@/lib/api";
import type { AuditLogsResponse } from "@/types/audit-log";

export const auditLogService = {
  getAll: async () => {
    const response = await api.get<AuditLogsResponse>("/audit-logs");
    return response.data;
  },
};
