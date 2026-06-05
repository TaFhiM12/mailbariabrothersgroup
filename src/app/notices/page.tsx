"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  Eye,
  ImageIcon,
  Megaphone,
  Plus,
  Trash2,
  X,
} from "lucide-react";
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
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
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
      setSelectedNotice((notice) => (notice?.id === id ? null : notice));
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
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-100 hover:shadow-md"
                >
                  <div className="flex gap-4">
                    <div className="hidden h-24 w-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:block">
                      {notice.imageUrl ? (
                        <div className="relative h-full w-full">
                          <Image
                            src={notice.imageUrl}
                            alt={notice.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-slate-400">
                          <ImageIcon size={28} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                          <Megaphone size={14} />
                          Club Notice
                          </div>
                          <h2 className="line-clamp-2 text-lg font-black leading-6 text-slate-950">
                            {notice.title}
                          </h2>
                          <p className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-slate-400">
                            <CalendarDays size={14} />
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

                      <p className="mt-3 line-clamp-2 text-sm font-medium leading-6 text-slate-600">
                        {notice.body}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedNotice(notice)}
                          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:bg-slate-800"
                        >
                          <Eye size={16} />
                          View Details
                        </button>
                        {notice.imageUrl && (
                          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-500">
                            <ImageIcon size={15} />
                            Image attached
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
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

        <NoticeDetailsModal
          notice={selectedNotice}
          onClose={() => setSelectedNotice(null)}
        />
      </DashboardShell>
    </ProtectedRoute>
  );
}

function NoticeDetailsModal({
  notice,
  onClose,
}: {
  notice: Notice | null;
  onClose: () => void;
}) {
  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6">
      <article className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <Megaphone size={14} />
              Club Notice
            </div>
            <h2 className="mt-2 truncate text-lg font-black text-slate-950">
              Notice Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            aria-label="Close notice details"
          >
            <X size={20} />
          </button>
        </div>

        {notice.imageUrl && (
          <div className="relative aspect-[16/9] max-h-[520px] w-full bg-slate-100">
            <Image
              src={notice.imageUrl}
              alt={notice.title}
              fill
              className="object-contain"
            />
          </div>
        )}

        <div className="p-5 sm:p-6">
          <h1 className="text-2xl font-black leading-8 text-slate-950">
            {notice.title}
          </h1>
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-slate-400">
            <CalendarDays size={14} />
            {new Date(notice.createdAt).toLocaleString()}
          </p>

          <p className="mt-5 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700 sm:text-base sm:leading-8">
            {notice.body}
          </p>
        </div>
      </article>
    </div>
  );
}

function PanelText({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-sm text-slate-500 shadow-sm">
      {children}
    </div>
  );
}
