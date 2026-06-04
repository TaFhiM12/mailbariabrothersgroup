"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Check, X, Eye } from "lucide-react";
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

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);
      await savingService.reject(id);
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
                Submit and verify monthly savings with payment proof.
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
                ) : savings.length === 0 ? (
                  <tr>
                    <td
                        className="px-4 py-5 text-slate-600"
                      colSpan={canApprove ? 6 : 5}
                    >
                      No savings found.
                    </td>
                  </tr>
                ) : (
                  savings.map((saving) => (
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
  onReject: (id: string) => void;
}) {
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
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  disabled={isLoading}
                  onClick={() => onReject(saving.id)}
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
