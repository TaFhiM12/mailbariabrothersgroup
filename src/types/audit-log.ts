import type { ApiResponse } from "./api";

export type AuditLog = {
  id: string;
  action: string;
  userId?: string | null;
  metadata?: unknown;
  createdAt: string;
};

export type AuditLogsResponse = ApiResponse<AuditLog[]>;
