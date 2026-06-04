"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { expenseService } from "@/services/expense.service";

type AddExpenseModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function AddExpenseModal({
  open,
  onClose,
  onSuccess,
}: AddExpenseModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      await expenseService.create({
        title,
        amount,
        description,
      });

      toast.success("Expense created successfully");

      setTitle("");
      setAmount(0);
      setDescription("");

      onSuccess();
      onClose();
    } catch {
      toast.error("Failed to create expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Expense</h2>
            <p className="text-sm text-slate-500">
              Record club spending or operational cost.
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
            placeholder="Meeting snacks"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            rows={3}
            placeholder="Optional details"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Expense"}
        </button>
      </form>
    </div>
  );
}