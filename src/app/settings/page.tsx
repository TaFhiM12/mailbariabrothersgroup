"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { RoleGuard } from "@/components/shared/role-guard";
import { settingService } from "@/services/setting.service";

export default function SettingsPage() {
  const [clubName, setClubName] = useState("");
  const [monthlySavingAmount, setMonthlySavingAmount] = useState(1000);
  const [paymentDeadlineDay, setPaymentDeadlineDay] = useState(10);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await settingService.get();
        setClubName(result.data.clubName);
        setMonthlySavingAmount(Number(result.data.monthlySavingAmount));
        setPaymentDeadlineDay(result.data.paymentDeadlineDay);
        setReminderEnabled(result.data.reminderEnabled);
      } catch {
        toast.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      await settingService.update({
        clubName,
        monthlySavingAmount,
        paymentDeadlineDay,
        reminderEnabled,
      });
      toast.success("Settings updated");
    } catch {
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardShell>
        <RoleGuard allowedRoles={["PRESIDENT"]}>
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
              <p className="text-sm text-slate-500">
                Configure club defaults and reminder rules.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-w-2xl rounded-2xl bg-white p-6 shadow-sm"
            >
              {loading ? (
                <p className="text-sm text-slate-500">Loading settings...</p>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Club Name
                    </label>
                    <input
                      value={clubName}
                      onChange={(event) => setClubName(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                      required
                    />
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Default Saving Amount
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={monthlySavingAmount}
                        onChange={(event) =>
                          setMonthlySavingAmount(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                        required
                      />
                      <p className="mt-1 text-xs text-slate-500">
                        Shown as the starting amount. Users can edit it.
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-700">
                        Payment Deadline Day
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={28}
                        value={paymentDeadlineDay}
                        onChange={(event) =>
                          setPaymentDeadlineDay(Number(event.target.value))
                        }
                        className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                        required
                      />
                    </div>
                  </div>

                  <label className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <span>
                      <span className="block text-sm font-medium text-slate-800">
                        Monthly Reminders
                      </span>
                      <span className="text-xs text-slate-500">
                        Enable reminder automation.
                      </span>
                    </span>
                    <input
                      type="checkbox"
                      checked={reminderEnabled}
                      onChange={(event) =>
                        setReminderEnabled(event.target.checked)
                      }
                      className="h-5 w-5 accent-emerald-500"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={saving}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
                  >
                    <Save size={18} />
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </>
              )}
            </form>
          </div>
        </RoleGuard>
      </DashboardShell>
    </ProtectedRoute>
  );
}
