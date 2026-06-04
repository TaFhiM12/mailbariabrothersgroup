"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { noticeService } from "@/services/notice.service";

type AddNoticeModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddNoticeModal({
  open,
  onClose,
  onSuccess,
}: AddNoticeModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      await noticeService.create({
        title,
        body,
      });

      toast.success("Notice created successfully");

      setTitle("");
      setBody("");

      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to create notice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Notice</h2>
            <p className="text-sm text-slate-500">
              Publish an announcement for club members.
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

        <div className="mt-5">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            placeholder="Monthly meeting"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Message</label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            rows={5}
            placeholder="Write notice details..."
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Notice"}
        </button>
      </form>
    </div>
  );
}