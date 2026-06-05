"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Check,
  X,
  Eye,
  CircleDollarSign,
  Clock,
  Filter,
  Search,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AddSavingModal } from "@/features/savings/add-saving-modal";
import { useAuthStore } from "@/store/auth.store";
import { savingService } from "@/services/saving.service";
import type { Saving } from "@/types/saving";

export default function SavingsPage() {
  const { user } = useAuthStore();

  const [savings, setSavings] = useState<Saving[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSaving, setSelectedSaving] = useState<Saving | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"ALL" | Saving["status"]>(
    "ALL"
  );
  const [monthFilter, setMonthFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");

  const canApprove =
    user?.role === "PRESIDENT" || user?.role === "ACCOUNTANT";

  const loadSavings = async () => {
    try {
      setLoading(true);

      const result = canApprove
        ? await savingService.getAllSavings()
        : await savingService.getMySavings();

      setSavings(result.data);
    } catch (error) {
      console.error("Failed to fetch savings:", error);
      toast.error("Failed to fetch savings");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await savingService.approve(id);
      toast.success("Saving approved successfully");
      setSelectedSaving(null);
      await loadSavings();
    } catch (error) {
      console.error("Failed to approve saving:", error);
      toast.error("Failed to approve saving");
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredSavings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const minimum = minAmount ? Number(minAmount) : null;
    const maximum = maxAmount ? Number(maxAmount) : null;

    return savings.filter((saving) => {
      const amount = Number(saving.amount);
      const searchable = [
        saving.user?.name,
        saving.user?.email,
        saving.month,
        saving.status,
        saving.note,
        saving.amount,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (statusFilter === "ALL" || saving.status === statusFilter) &&
        (!monthFilter || saving.month === monthFilter) &&
        (!query || searchable.includes(query)) &&
        (minimum === null || amount >= minimum) &&
        (maximum === null || amount <= maximum)
      );
    });
  }, [maxAmount, minAmount, monthFilter, savings, searchQuery, statusFilter]);

  const summary = useMemo(() => {
    return savings.reduce(
      (totals, saving) => {
        const amount = Number(saving.amount);

        totals.all += amount;
        totals.count += 1;

        if (saving.status === "APPROVED") {
          totals.approved += amount;
        } else if (saving.status === "PENDING") {
          totals.pending += amount;
        } else {
          totals.rejected += amount;
        }

        return totals;
      },
      {
        all: 0,
        approved: 0,
        pending: 0,
        rejected: 0,
        count: 0,
      }
    );
  }, [savings]);

  const months = useMemo(
    () => Array.from(new Set(savings.map((saving) => saving.month))).sort(),
    [savings]
  );

  const handleReject = async (id: string, note = "") => {
    try {
      setActionLoadingId(id);
      await savingService.reject(id, note);
      toast.success("Saving rejected successfully");
      setSelectedSaving(null);
      await loadSavings();
    } catch (error) {
      console.error("Failed to reject saving:", error);
      toast.error("Failed to reject saving");
    } finally {
      setActionLoadingId(null);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadSavings());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canApprove]);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="min-w-0 space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-slate-900">Savings</h1>
              <p className="text-sm font-medium text-slate-600">
                Submit, track, filter and verify savings with payment proof.
              </p>
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-400 sm:w-auto"
            >
              <Plus size={18} />
              Add Saving
            </button>
          </div>

          <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SavingStatCard
              title="Total Savings"
              value={`৳ ${formatMoney(summary.all)}`}
              detail={`${summary.count} entr${summary.count === 1 ? "y" : "ies"}`}
              icon={CircleDollarSign}
              tone="slate"
            />
            <SavingStatCard
              title="Approved"
              value={`৳ ${formatMoney(summary.approved)}`}
              detail="Added to account"
              icon={ShieldCheck}
              tone="emerald"
            />
            <SavingStatCard
              title="Pending"
              value={`৳ ${formatMoney(summary.pending)}`}
              detail="Waiting for review"
              icon={Clock}
              tone="amber"
            />
            <SavingStatCard
              title="Rejected"
              value={`৳ ${formatMoney(summary.rejected)}`}
              detail="Needs correction"
              icon={XCircle}
              tone="rose"
            />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
              <Filter size={18} className="text-slate-500" />
              Savings Filters
            </div>

            <div className="grid gap-3 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.6fr_0.6fr]">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search member, email, note..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "ALL" | Saving["status"])
                }
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                <option value="ALL">All status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">All months</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="0"
                value={minAmount}
                onChange={(event) => setMinAmount(event.target.value)}
                placeholder="Min ৳"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              <input
                type="number"
                min="0"
                value={maxAmount}
                onChange={(event) => setMaxAmount(event.target.value)}
                placeholder="Max ৳"
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </section>

          <div className="table-scroll table-scroll-tight rounded-xl border border-slate-200 bg-white shadow-sm">
            <table
              className={`table-fixed text-left text-sm ${
                canApprove ? "min-w-[640px]" : "min-w-[520px]"
              }`}
            >
              <colgroup>
                <col className={canApprove ? "w-[150px]" : "w-[130px]"} />
                <col className="w-[92px]" />
                <col className="w-[96px]" />
                <col className="w-[104px]" />
                <col className="w-[98px]" />
                {canApprove && <col className="w-[100px]" />}
              </colgroup>
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Proof</th>
                  <th className="px-4 py-3">Status</th>
                  {canApprove && <th className="px-4 py-3">Action</th>}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                        className="px-4 py-5 text-slate-600"
                      colSpan={canApprove ? 6 : 5}
                    >
                      Loading savings...
                    </td>
                  </tr>
                ) : filteredSavings.length === 0 ? (
                  <tr>
                    <td
                        className="px-4 py-5 text-slate-600"
                      colSpan={canApprove ? 6 : 5}
                    >
                      No savings matched your filters.
                    </td>
                  </tr>
                ) : (
                  filteredSavings.map((saving) => (
                    <tr key={saving.id} className="border-t border-slate-100">
                      <td className="px-4 py-3">
                        <div>
                          <p className="truncate font-bold text-slate-900">
                            {saving.user?.name || user?.name}
                          </p>
                          {saving.user?.email && (
                            <p className="truncate text-xs font-medium text-slate-600">
                              {saving.user.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-3">{saving.month}</td>

                      <td className="px-4 py-3 font-bold text-slate-900">
                        ৳ {saving.amount}
                      </td>

                      <td className="px-4 py-3">
                        {saving.proofImageUrl ? (
                          <button
                            onClick={() => setSelectedSaving(saving)}
                            className="inline-flex items-center gap-2 whitespace-nowrap rounded-lg bg-blue-50 px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-100"
                          >
                            <Eye size={15} />
                            <span className="sm:hidden">View</span>
                            <span className="hidden sm:inline">View Proof</span>
                          </button>
                        ) : (
                          <span className="whitespace-nowrap text-xs font-semibold text-slate-600">
                            No proof
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={saving.status} />
                      </td>

                      {canApprove && (
                        <td className="px-4 py-3">
                          {saving.status === "PENDING" ? (
                            <button
                              onClick={() => setSelectedSaving(saving)}
                              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-800 transition hover:bg-slate-200"
                            >
                              Review
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

        <AddSavingModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={loadSavings}
        />

        <SavingProofModal
          key={selectedSaving?.id || "empty-saving-proof"}
          saving={selectedSaving}
          canApprove={canApprove}
          actionLoadingId={actionLoadingId}
          onClose={() => setSelectedSaving(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    maximumFractionDigits: 0,
  }).format(value);

function SavingStatCard({
  title,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  title: string;
  value: string;
  detail: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  tone: "slate" | "emerald" | "amber" | "rose";
}) {
  const tones = {
    slate: "bg-slate-950 text-white",
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase text-slate-400">{title}</p>
          <p className="mt-2 text-xl font-black text-slate-950">{value}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">{detail}</p>
        </div>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Saving["status"] }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        status === "APPROVED"
          ? "bg-green-100 text-green-700"
          : status === "REJECTED"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {status}
    </span>
  );
}

function SavingProofModal({
  saving,
  canApprove,
  actionLoadingId,
  onClose,
  onApprove,
  onReject,
}: {
  saving: Saving | null;
  canApprove: boolean;
  actionLoadingId: string | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, note?: string) => void;
}) {
  const [rejectionReason, setRejectionReason] = useState("");

  if (!saving) return null;

  const isPending = saving.status === "PENDING";
  const isLoading = actionLoadingId === saving.id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Payment Proof Review
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Verify screenshot before approving the saving.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {saving.proofImageUrl ? (
              <Image
                src={saving.proofImageUrl}
                alt="Payment proof"
                width={900}
                height={700}
                className="max-h-[520px] w-full object-contain"
              />
            ) : (
              <div className="flex h-72 items-center justify-center text-sm text-slate-400">
                No proof image uploaded
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Saving Details
            </p>

            <div className="mt-4 space-y-4 text-sm">
              <InfoRow label="Member" value={saving.user?.name || "Member"} />
              <InfoRow label="Email" value={saving.user?.email || "-"} />
              <InfoRow label="Month" value={saving.month} />
              <InfoRow label="Amount" value={`৳ ${saving.amount}`} />
              <InfoRow label="Status" value={saving.status} />
              <InfoRow label="Note" value={saving.note || "-"} />
              <InfoRow
                label="Submitted"
                value={new Date(saving.createdAt).toLocaleString()}
              />
            </div>

            {canApprove && isPending && (
              <div className="mt-6 space-y-3">
                <div>
                  <label className="text-xs font-black uppercase text-slate-400">
                    Rejection reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(event) => setRejectionReason(event.target.value)}
                    placeholder="Optional, but helpful for the member"
                    className="mt-2 min-h-24 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                <button
                  disabled={isLoading}
                  onClick={() => onReject(saving.id, rejectionReason)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                >
                  <X size={17} />
                  Reject
                </button>

                <button
                  disabled={isLoading}
                  onClick={() => onApprove(saving.id)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                >
                  <Check size={17} />
                  Approve
                </button>
                </div>
              </div>
            )}

            {(!canApprove || !isPending) && (
              <div className="mt-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-500">
                No action available for this record.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}
