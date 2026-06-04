"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { RoleGuard } from "@/components/shared/role-guard";
import { auditLogService } from "@/services/audit-log.service";
import type { AuditLog } from "@/types/audit-log";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const result = await auditLogService.getAll();
        setLogs(result.data);
      } catch {
        toast.error("Failed to fetch audit logs");
      } finally {
        setLoading(false);
      }
    };

    loadLogs();
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <RoleGuard allowedRoles={["PRESIDENT"]}>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Audit Logs
              </h1>
              <p className="text-sm text-slate-500">
                Track recorded system actions.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Action</th>
                    <th className="px-5 py-4">User ID</th>
                    <th className="px-5 py-4">Metadata</th>
                    <th className="px-5 py-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-5 py-6 text-slate-500" colSpan={4}>
                        Loading audit logs...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td className="px-5 py-6 text-slate-500" colSpan={4}>
                        No audit logs found.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="border-t border-slate-100">
                        <td className="px-5 py-4 font-semibold text-slate-900">
                          {log.action}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {log.userId || "-"}
                        </td>
                        <td className="px-5 py-4">
                          <code className="block max-w-md overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                            {JSON.stringify(log.metadata ?? {})}
                          </code>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </RoleGuard>
      </DashboardShell>
    </ProtectedRoute>
  );
}
