"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  Clock,
  Database,
  FileJson,
  History,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { RoleGuard } from "@/components/shared/role-guard";
import { auditLogService } from "@/services/audit-log.service";
import type { AuditLog } from "@/types/audit-log";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

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

  const actions = useMemo(
    () => ["ALL", ...Array.from(new Set(logs.map((log) => log.action)))],
    [logs]
  );

  const filteredLogs = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return logs.filter((log) => {
      const matchesAction =
        actionFilter === "ALL" || log.action === actionFilter;
      const searchable = [
        log.action,
        log.userId,
        JSON.stringify(log.metadata ?? {}),
        log.createdAt,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesAction && searchable.includes(normalizedSearch);
    });
  }, [actionFilter, logs, search]);

  const todaysLogs = useMemo(() => {
    const today = new Date().toDateString();
    return logs.filter((log) => new Date(log.createdAt).toDateString() === today)
      .length;
  }, [logs]);

  const uniqueUsers = useMemo(
    () => new Set(logs.map((log) => log.userId).filter(Boolean)).size,
    [logs]
  );

  const savingEvents = useMemo(
    () => logs.filter((log) => log.action.includes("SAVING")).length,
    [logs]
  );

  return (
    <ProtectedRoute>
      <DashboardShell>
        <RoleGuard allowedRoles={["PRESIDENT"]}>
          <div className="space-y-5">
            <section className="overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-950/10">
              <div className="grid gap-6 p-5 sm:p-7 xl:grid-cols-[1fr_420px]">
                <div className="min-w-0">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-black text-emerald-200">
                    <ShieldCheck size={15} />
                    President control center
                  </div>

                  <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-4xl">
                    Audit Logs
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300 sm:text-base">
                    Review every important system action with clean event
                    history, searchable records, and readable metadata.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <MetricTile
                    icon={History}
                    label="Total Events"
                    value={logs.length}
                    tone="emerald"
                  />
                  <MetricTile
                    icon={Clock}
                    label="Today"
                    value={todaysLogs}
                    tone="sky"
                  />
                  <MetricTile
                    icon={Sparkles}
                    label="Saving Events"
                    value={savingEvents}
                    tone="amber"
                  />
                  <MetricTile
                    icon={UserRound}
                    label="Users"
                    value={uniqueUsers}
                    tone="rose"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search action, user ID, amount, month..."
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                <div className="table-scroll">
                  <div className="flex min-w-max gap-2">
                    {actions.map((action) => (
                      <button
                        key={action}
                        type="button"
                        onClick={() => setActionFilter(action)}
                        className={`rounded-2xl px-4 py-2 text-xs font-black transition ${
                          actionFilter === action
                            ? "bg-slate-950 text-white shadow-sm"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {action === "ALL" ? "All" : formatAction(action)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">
                      Event Timeline
                    </h2>
                    <p className="text-sm font-medium text-slate-500">
                      Showing {filteredLogs.length} of {logs.length} recorded
                      event{logs.length === 1 ? "" : "s"}.
                    </p>
                  </div>
                  <p className="text-xs font-black uppercase text-slate-400">
                    Live system records
                  </p>
                </div>
              </div>

              <div className="table-scroll table-scroll-tight">
                <table className="min-w-[1040px] text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-5 py-4">Event</th>
                    <th className="px-5 py-4">Actor</th>
                    <th className="px-5 py-4">Details</th>
                    <th className="px-5 py-4">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-5 py-10" colSpan={4}>
                        <EmptyState
                          icon={Activity}
                          title="Loading audit logs"
                          description="Fetching the latest system history..."
                        />
                      </td>
                    </tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr>
                      <td className="px-5 py-10" colSpan={4}>
                        <EmptyState
                          icon={Database}
                          title="No matching audit logs"
                          description="Try another search term or choose a different event type."
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="border-t border-slate-100 transition hover:bg-slate-50/70"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <ActionIcon action={log.action} />
                            <div>
                              <p className="font-black text-slate-950">
                                {formatAction(log.action)}
                              </p>
                              <p className="mt-1 font-mono text-xs font-bold text-slate-400">
                                {log.action}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="inline-flex max-w-[260px] items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2">
                            <UserRound
                              size={16}
                              className="shrink-0 text-slate-500"
                            />
                            <span className="truncate font-mono text-xs font-bold text-slate-700">
                              {log.userId || "System"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <MetadataPreview metadata={log.metadata} />
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-slate-600">
                            <CalendarClock size={17} className="text-slate-400" />
                            <div>
                              <p className="font-bold text-slate-700">
                                {dateFormatter.format(new Date(log.createdAt))}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-400">
                                {timeAgo(log.createdAt)}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            </section>
          </div>
        </RoleGuard>
      </DashboardShell>
    </ProtectedRoute>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: number;
  tone: "emerald" | "sky" | "amber" | "rose";
}) {
  const tones = {
    emerald: "bg-emerald-400/15 text-emerald-200",
    sky: "bg-sky-400/15 text-sky-200",
    amber: "bg-amber-400/15 text-amber-200",
    rose: "bg-rose-400/15 text-rose-200",
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tones[tone]}`}
      >
        <Icon size={20} />
      </div>
      <p className="mt-4 text-2xl font-black text-white">{value}</p>
      <p className="mt-1 text-xs font-black uppercase text-slate-400">
        {label}
      </p>
    </div>
  );
}

function ActionIcon({ action }: { action: string }) {
  const isApproved = action.includes("APPROVED");
  const isCreated = action.includes("CREATED");
  const Icon = isApproved ? CheckCircle2 : isCreated ? Sparkles : Activity;
  const color = isApproved
    ? "bg-emerald-100 text-emerald-700"
    : isCreated
    ? "bg-sky-100 text-sky-700"
    : "bg-amber-100 text-amber-700";

  return (
    <div
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${color}`}
    >
      <Icon size={20} />
    </div>
  );
}

function MetadataPreview({ metadata }: { metadata: unknown }) {
  const entries = getMetadataEntries(metadata);

  if (entries.length === 0) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
        <FileJson size={15} />
        No metadata
      </div>
    );
  }

  return (
    <div className="flex max-w-2xl flex-wrap gap-2">
      {entries.slice(0, 4).map(([key, value]) => (
        <div
          key={key}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2"
        >
          <p className="text-[10px] font-black uppercase text-slate-400">
            {formatKey(key)}
          </p>
          <p className="mt-1 max-w-[210px] truncate font-mono text-xs font-bold text-slate-700">
            {formatMetadataValue(key, value)}
          </p>
        </div>
      ))}
      {entries.length > 4 && (
        <div className="rounded-2xl bg-slate-950 px-3 py-2 text-xs font-black text-white">
          +{entries.length - 4} more
        </div>
      )}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div className="mx-auto flex max-w-sm flex-col items-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Icon size={22} />
      </div>
      <p className="mt-3 font-black text-slate-900">{title}</p>
      <p className="mt-1 text-sm font-medium text-slate-500">{description}</p>
    </div>
  );
}

function getMetadataEntries(metadata: unknown) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    return [];
  }

  return Object.entries(metadata as Record<string, unknown>);
}

function formatAction(action: string) {
  return action
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatKey(key: string) {
  return key.replace(/([a-z])([A-Z])/g, "$1 $2");
}

function formatMetadataValue(key: string, value: unknown) {
  if (value === null || value === undefined || value === "") return "-";

  if (key.toLowerCase().includes("amount") && !Number.isNaN(Number(value))) {
    return `BDT ${new Intl.NumberFormat("en-BD", {
      maximumFractionDigits: 0,
    }).format(Number(value))}`;
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
}

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diff / 60000));

  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
