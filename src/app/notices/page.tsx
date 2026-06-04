"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { AddNoticeModal } from "@/features/notices/add-notice-modal";
import { noticeService } from "@/services/notice.service";
import { useAuthStore } from "@/store/auth.store";
import type { Notice } from "@/types/notice";

export default function NoticesPage() {
  const { user } = useAuthStore();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const canCreate = user?.role === "PRESIDENT" || user?.role === "COORDINATOR";
  const canDelete = user?.role === "PRESIDENT";

  const loadNotices = async () => {
    try {
      setLoading(true);
      const result = await noticeService.getAll();
      setNotices(result.data);
    } catch {
      toast.error("Failed to fetch notices");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await noticeService.delete(id);
      toast.success("Notice deleted");
      await loadNotices();
    } catch {
      toast.error("Failed to delete notice");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadNotices());
  }, []);

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Notices</h1>
              <p className="text-sm text-slate-500">
                Read and publish club announcements.
              </p>
            </div>

            {canCreate && (
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                <Plus size={18} />
                Add Notice
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {loading ? (
              <PanelText>Loading notices...</PanelText>
            ) : notices.length === 0 ? (
              <PanelText>No notices found.</PanelText>
            ) : (
              notices.map((notice) => (
                <article
                  key={notice.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {notice.title}
                      </h2>
                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(notice.createdAt).toLocaleString()}
                      </p>
                    </div>

                    {canDelete && (
                      <button
                        disabled={deletingId === notice.id}
                        onClick={() => handleDelete(notice.id)}
                        className="rounded-xl p-2 text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                        aria-label="Delete notice"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {notice.body}
                  </p>
                </article>
              ))
            )}
          </div>
        </div>

        <AddNoticeModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={loadNotices}
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}

function PanelText({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
      {children}
    </div>
  );
}
