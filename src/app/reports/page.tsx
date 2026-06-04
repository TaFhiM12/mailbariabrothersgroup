"use client";

import { useEffect, useState } from "react";
import { Download, FileSpreadsheet, FileText, Send } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { RoleGuard } from "@/components/shared/role-guard";
import { exportService } from "@/services/export.service";
import { reminderService } from "@/services/reminder.service";
import { reportService } from "@/services/report.service";
import type {
  ClubFinancialSummary,
  MonthlyCollectionReport,
  MonthlyExpenseReport,
  UnpaidMembersReport,
} from "@/types/report";

type ReportTab = "collection" | "expenses" | "unpaid" | "summary";

const currentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

export default function ReportsPage() {
  const [month, setMonth] = useState(currentMonth());
  const [tab, setTab] = useState<ReportTab>("collection");
  const [collection, setCollection] = useState<MonthlyCollectionReport | null>(
    null
  );
  const [expenses, setExpenses] = useState<MonthlyExpenseReport | null>(null);
  const [unpaid, setUnpaid] = useState<UnpaidMembersReport | null>(null);
  const [summary, setSummary] = useState<ClubFinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadReports = async () => {
    try {
      setLoading(true);
      const [collectionResult, expenseResult, unpaidResult, summaryResult] =
        await Promise.all([
          reportService.monthlyCollection(month),
          reportService.monthlyExpenses(month),
          reportService.unpaidMembers(month),
          reportService.financialSummary(),
        ]);

      setCollection(collectionResult.data);
      setExpenses(expenseResult.data);
      setUnpaid(unpaidResult.data);
      setSummary(summaryResult.data);
    } catch {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  const createReminders = async () => {
    try {
      setActionLoading(true);
      const result = await reminderService.createMonthly(month);
      toast.success(`${result.data.remindersCreated} reminders created`);
    } catch {
      toast.error("Failed to create reminders");
    } finally {
      setActionLoading(false);
    }
  };

  const downloadReport = async (kind: "xlsx" | "pdf") => {
    if (tab === "summary" && kind === "xlsx") {
      toast.error("Financial summary is available as PDF only");
      return;
    }

    try {
      setActionLoading(true);
      if (tab === "collection") {
        await exportService.monthlyCollection(month, kind);
      } else if (tab === "expenses") {
        await exportService.expenses(kind);
      } else if (tab === "unpaid") {
        await exportService.unpaidMembers(month, kind);
      } else if (kind === "pdf") {
        await exportService.financialSummaryPdf();
      }
    } catch {
      toast.error("Failed to download report");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadReports());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <RoleGuard allowedRoles={["PRESIDENT", "ACCOUNTANT"]}>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
                <p className="text-sm text-slate-500">
                  Review collections, expenses, unpaid members and summaries.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="month"
                  value={month}
                  onChange={(event) => setMonth(event.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-emerald-500"
                />
                <button
                  disabled={actionLoading || tab === "summary"}
                  onClick={() => downloadReport("xlsx")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <FileSpreadsheet size={17} />
                  Excel
                </button>
                <button
                  disabled={actionLoading}
                  onClick={() => downloadReport("pdf")}
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
                >
                  <FileText size={17} />
                  PDF
                </button>
                {tab === "unpaid" && (
                  <button
                    disabled={actionLoading}
                    onClick={createReminders}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                  >
                    <Send size={17} />
                    Send Reminders
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <TabButton active={tab === "collection"} onClick={() => setTab("collection")}>
                Collection
              </TabButton>
              <TabButton active={tab === "expenses"} onClick={() => setTab("expenses")}>
                Expenses
              </TabButton>
              <TabButton active={tab === "unpaid"} onClick={() => setTab("unpaid")}>
                Unpaid Members
              </TabButton>
              <TabButton active={tab === "summary"} onClick={() => setTab("summary")}>
                Summary
              </TabButton>
            </div>

            {loading ? (
              <Panel>Loading reports...</Panel>
            ) : (
              <>
                {tab === "collection" && collection && (
                  <ReportPanel
                    stats={[
                      ["Total Collected", `৳ ${collection.totalCollected}`],
                      ["Payments", String(collection.totalPayments)],
                      ["Month", collection.month],
                    ]}
                  >
                    <SimpleTable
                      headers={["Member", "Amount", "Status", "Approved"]}
                      rows={collection.savings.map((saving) => [
                        saving.user?.name || "Member",
                        `৳ ${saving.amount}`,
                        saving.status,
                        saving.approvedAt
                          ? new Date(saving.approvedAt).toLocaleDateString()
                          : "-",
                      ])}
                    />
                  </ReportPanel>
                )}

                {tab === "expenses" && expenses && (
                  <ReportPanel
                    stats={[
                      ["Active Expenses", `৳ ${expenses.totalActiveExpenses}`],
                      [
                        "Cancelled Expenses",
                        `৳ ${expenses.totalCancelledExpenses}`,
                      ],
                      ["Records", String(expenses.totalExpensesCount)],
                    ]}
                  >
                    <SimpleTable
                      headers={["Title", "Amount", "Status", "Date"]}
                      rows={expenses.expenses.map((expense) => [
                        expense.title,
                        `৳ ${expense.amount}`,
                        expense.status,
                        new Date(expense.createdAt).toLocaleDateString(),
                      ])}
                    />
                  </ReportPanel>
                )}

                {tab === "unpaid" && unpaid && (
                  <ReportPanel
                    stats={[
                      ["Active Members", String(unpaid.activeMembersCount)],
                      ["Paid Members", String(unpaid.paidMembersCount)],
                      ["Collection Rate", `${unpaid.collectionRate}%`],
                    ]}
                  >
                    <SimpleTable
                      headers={["Name", "Email", "Role"]}
                      rows={unpaid.unpaidMembers.map((member) => [
                        member.name,
                        member.email,
                        member.role,
                      ])}
                    />
                  </ReportPanel>
                )}

                {tab === "summary" && summary && (
                  <ReportPanel
                    stats={[
                      ["Approved Savings", `৳ ${summary.totalApprovedSavings}`],
                      ["Active Expenses", `৳ ${summary.totalActiveExpenses}`],
                      [
                        "Cancelled Expenses",
                        `৳ ${summary.totalCancelledExpenses}`,
                      ],
                      ["Current Balance", `৳ ${summary.currentClubBalance}`],
                    ]}
                  >
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                      <Download size={17} />
                      Financial summary is available as PDF from this tab.
                    </div>
                  </ReportPanel>
                )}
              </>
            )}
          </div>
        </RoleGuard>
      </DashboardShell>
    </ProtectedRoute>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-slate-950 text-white"
          : "bg-white text-slate-600 shadow-sm hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
      {children}
    </div>
  );
}

function ReportPanel({
  stats,
  children,
}: {
  stats: [string, string][];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
          </div>
        ))}
      </div>
      {children}
    </div>
  );
}

function SimpleTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-5 py-4">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-5 py-6 text-slate-500" colSpan={headers.length}>
                No records found.
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-t border-slate-100">
                {row.map((cell, cellIndex) => (
                  <td key={`${rowIndex}-${cellIndex}`} className="px-5 py-4">
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
