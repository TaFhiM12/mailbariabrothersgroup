"use client";

import { useEffect, useState } from "react";
import { ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { RoleGuard } from "@/components/shared/role-guard";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import type { Role, User } from "@/types/auth";

const roles: Role[] = ["PRESIDENT", "ACCOUNTANT", "COORDINATOR", "MEMBER"];

const formatMoney = (value = 0) => `৳ ${value.toLocaleString("en-US")}`;

export default function MembersPage() {
  const { user } = useAuthStore();
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const canManage = user?.role === "PRESIDENT";

  const loadMembers = async () => {
    try {
      setLoading(true);
      const result = await userService.getAll();
      setMembers(result.data);
    } catch {
      toast.error("Failed to fetch members");
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (memberId: string, role: Role) => {
    try {
      setUpdatingId(memberId);
      await userService.updateRole(memberId, { role });
      toast.success("Member role updated");
      await loadMembers();
    } catch {
      toast.error("Failed to update member role");
    } finally {
      setUpdatingId(null);
    }
  };

  const updateStatus = async (member: User) => {
    try {
      setUpdatingId(member.id);
      await userService.updateStatus(member.id, {
        isActive: !member.isActive,
      });
      toast.success("Member status updated");
      await loadMembers();
    } catch {
      toast.error("Failed to update member status");
    } finally {
      setUpdatingId(null);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadMembers());
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <RoleGuard allowedRoles={["PRESIDENT", "COORDINATOR"]}>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Members</h1>
              <p className="text-sm text-slate-500">
                Review active members and manage access.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="w-full min-w-[1120px] text-left text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Total Savings</th>
                    <th className="px-5 py-4">This Month</th>
                    <th className="px-5 py-4">Pending</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Joined</th>
                    {canManage && <th className="px-5 py-4">Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        className="px-5 py-6 text-slate-500"
                        colSpan={canManage ? 9 : 8}
                      >
                        Loading members...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td
                        className="px-5 py-6 text-slate-500"
                        colSpan={canManage ? 9 : 8}
                      >
                        No members found.
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => (
                      <tr
                        key={member.id}
                        className="border-t border-slate-100"
                      >
                        <td className="px-5 py-4 font-medium text-slate-900">
                          {member.name}
                        </td>
                        <td className="px-5 py-4 text-slate-600">
                          {member.email}
                        </td>
                        <td className="px-5 py-4">
                          {canManage ? (
                            <select
                              value={member.role}
                              disabled={updatingId === member.id}
                              onChange={(event) =>
                                updateRole(member.id, event.target.value as Role)
                              }
                              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500"
                            >
                              {roles.map((role) => (
                                <option key={role} value={role}>
                                  {role}
                                </option>
                              ))}
                            </select>
                          ) : (
                            member.role
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">
                            {formatMoney(member.savingsSummary?.approvedTotal)}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {member.savingsSummary?.approvedCount ?? 0} approved
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-900">
                            {formatMoney(
                              member.savingsSummary?.currentMonthApprovedTotal
                            )}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {member.savingsSummary?.currentMonthApprovedCount ??
                              0}{" "}
                            approved
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-bold text-amber-700">
                            {formatMoney(member.savingsSummary?.pendingTotal)}
                          </p>
                          <p className="text-xs font-medium text-slate-500">
                            {member.savingsSummary?.pendingCount ?? 0} pending
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              member.isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {member.isActive ? "ACTIVE" : "INACTIVE"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(member.createdAt).toLocaleDateString()}
                        </td>
                        {canManage && (
                          <td className="px-5 py-4">
                            <button
                              disabled={updatingId === member.id}
                              onClick={() => updateStatus(member)}
                              className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
                            >
                              {member.isActive ? (
                                <ToggleRight size={16} />
                              ) : (
                                <ToggleLeft size={16} />
                              )}
                              {member.isActive ? "Deactivate" : "Activate"}
                            </button>
                          </td>
                        )}
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
