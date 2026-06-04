"use client";

import { useEffect, useState } from "react";
import { Plus, Ban } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { RoleGuard } from "@/components/shared/role-guard";
import { AddExpenseModal } from "@/features/expenses/add-expense-modal";
import { expenseService } from "@/services/expense.service";
import type { Expense } from "@/types/expense";
import { useAuthStore } from "@/store/auth.store";

export default function ExpensesPage() {
  const { user } = useAuthStore();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const canCancel = user?.role === "PRESIDENT";

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const result = await expenseService.getAll();
      setExpenses(result.data);
    } catch (error) {
      console.error("Failed to fetch expenses:", error);
      toast.error("Failed to fetch expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      setActionLoadingId(id);

      await expenseService.cancel(id);

      toast.success("Expense cancelled successfully");
      await loadExpenses();
    } catch (error) {
      console.error("Failed to cancel expense:", error);
      toast.error("Failed to cancel expense");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadExpenses());
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <RoleGuard allowedRoles={["PRESIDENT", "ACCOUNTANT"]}>
          <div className="min-w-0 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-slate-900">
                  Expenses
                </h1>
                <p className="text-sm font-medium text-slate-600">
                  Track club expenses and cancelled expense history.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 sm:w-auto"
              >
                <Plus size={18} />
                Add Expense
              </button>
            </div>

            <div className="table-scroll table-scroll-tight rounded-xl border border-slate-200 bg-white shadow-sm">
              <table
                className={`table-fixed text-left text-sm ${
                  canCancel ? "min-w-[700px]" : "min-w-[600px]"
                }`}
              >
                <colgroup>
                  <col className="w-[150px]" />
                  <col className="w-[96px]" />
                  <col className="w-[104px]" />
                  <col className="w-[150px]" />
                  <col className="w-[100px]" />
                  {canCancel && <col className="w-[100px]" />}
                </colgroup>
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Created At</th>
                    {canCancel && <th className="px-4 py-3">Action</th>}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        className="px-4 py-5 text-slate-600"
                        colSpan={canCancel ? 6 : 5}
                      >
                        Loading expenses...
                      </td>
                    </tr>
                  ) : expenses.length === 0 ? (
                    <tr>
                      <td
                        className="px-4 py-5 text-slate-600"
                        colSpan={canCancel ? 6 : 5}
                      >
                        No expenses found.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((expense) => (
                      <tr
                        key={expense.id}
                        className="border-t border-slate-100"
                      >
                        <td className="truncate px-4 py-3 font-bold text-slate-900">
                          {expense.title}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-bold">
                          ৳ {expense.amount}
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              expense.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {expense.status}
                          </span>
                        </td>

                        <td className="max-w-72 truncate px-4 py-3 text-slate-700">
                          {expense.description || "-"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {new Date(expense.createdAt).toLocaleDateString()}
                        </td>

                        {canCancel && (
                          <td className="px-4 py-3">
                            {expense.status === "ACTIVE" ? (
                              <button
                                disabled={actionLoadingId === expense.id}
                                onClick={() => handleCancel(expense.id)}
                                className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                              >
                                <Ban size={15} />
                                Cancel
                              </button>
                            ) : (
                              <span className="whitespace-nowrap text-xs font-semibold text-slate-600">
                                No action
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <AddExpenseModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={loadExpenses}
          />
        </RoleGuard>
      </DashboardShell>
    </ProtectedRoute>
  );
}
