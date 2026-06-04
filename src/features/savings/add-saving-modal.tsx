"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import { savingService } from "@/services/saving.service";

const CLOUDINARY_CLOUD_NAME = "dlrxpdjbz";
const CLOUDINARY_UPLOAD_PRESET = "mailbariabrothersgroup";

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};

type AddSavingModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type CloudinaryResponse = {
  secure_url: string;
};

export function AddSavingModal({
  open,
  onClose,
  onSuccess,
}: AddSavingModalProps) {
  const [amount, setAmount] = useState(1000);
  const [month, setMonth] = useState(getCurrentMonth());
  const [note, setNote] = useState("");
  const [proofImageUrl, setProofImageUrl] = useState("");

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const data = (await response.json()) as CloudinaryResponse;

    return data.secure_url;
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Image size must be under 3MB");
      return;
    }

    try {
      setUploading(true);

      const uploadedUrl = await uploadToCloudinary(file);

      setProofImageUrl(uploadedUrl);
      toast.success("Proof image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setAmount(1000);
    setMonth(getCurrentMonth());
    setNote("");
    setProofImageUrl("");
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await savingService.create({
        amount,
        month,
        note,
        proofImageUrl,
      });

      toast.success("Saving submitted successfully");

      resetForm();
      onSuccess();
      onClose();
    } catch {
      setError(
        "Failed to submit saving. Maybe already submitted for this month."
      );
      toast.error("Failed to submit saving");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Add Saving</h2>
            <p className="text-sm text-slate-500">
              Submit your monthly club saving with payment proof.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5">
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
          <label className="text-sm font-medium text-slate-700">Month</label>
          <input
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">
            Payment Proof Screenshot
          </label>

          <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center hover:bg-slate-100">
            <ImagePlus className="text-slate-400" size={28} />

            <span className="mt-2 text-sm font-medium text-slate-700">
              {uploading ? "Uploading..." : "Upload payment screenshot"}
            </span>

            <span className="mt-1 text-xs text-slate-400">
              JPG, PNG, WEBP under 3MB
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {proofImageUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
              <Image
                src={proofImageUrl}
                alt="Payment proof"
                width={500}
                height={300}
                className="h-48 w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Note</label>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
            rows={3}
            placeholder="Optional note"
          />
        </div>

        <button
          disabled={loading || uploading}
          type="submit"
          className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Submitting..." : "Submit Saving"}
        </button>
      </form>
    </div>
  );
}
