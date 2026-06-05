"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, Megaphone, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { noticeService } from "@/services/notice.service";

const CLOUDINARY_CLOUD_NAME = "dlrxpdjbz";
const CLOUDINARY_UPLOAD_PRESET = "mailbariabrothersgroup";

type AddNoticeModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type CloudinaryResponse = {
  secure_url: string;
};

export function AddNoticeModal({
  open,
  onClose,
  onSuccess,
}: AddNoticeModalProps) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

    event.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file only");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Notice image must be under 3MB");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const uploadedUrl = await uploadToCloudinary(file);

      setImageUrl(uploadedUrl);
      toast.success("Notice image uploaded");
    } catch {
      toast.error("Notice image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setBody("");
    setImageUrl("");
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (trimmedTitle.length < 2) {
      setError("Please enter a clear notice title");
      return;
    }

    if (trimmedBody.length < 5) {
      setError("Please write the notice message");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await noticeService.create({
        title: trimmedTitle,
        body: trimmedBody,
        imageUrl,
      });

      toast.success("Notice created successfully");

      resetForm();

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
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <Megaphone size={23} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Publish Notice
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Share a clear announcement with club members.
              </p>
            </div>
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
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">
            {error}
          </p>
        )}

        <div className="mt-5">
          <label className="text-sm font-black text-slate-700">
            Notice Title <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Monthly club meeting"
            required
          />
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {title.length}/120 characters
          </p>
        </div>

        <div className="mt-4">
          <label className="text-sm font-black text-slate-700">
            Notice Message <span className="text-red-500">*</span>
          </label>
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={1200}
            className="mt-2 min-h-36 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 font-medium leading-6 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
            placeholder="Write the details members need to know..."
            required
          />
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {body.length}/1200 characters
          </p>
        </div>

        <div className="mt-4">
          <label className="text-sm font-black text-slate-700">
            Notice Image
          </label>

          {!imageUrl ? (
            <label className="mt-2 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-7 text-center transition hover:bg-slate-100">
              <ImagePlus className="text-slate-400" size={30} />
              <span className="mt-2 text-sm font-black text-slate-700">
                {uploading ? "Uploading image..." : "Upload notice image"}
              </span>
              <span className="mt-1 text-xs font-semibold text-slate-400">
                Image only: JPG, PNG, WEBP under 3MB
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={uploading}
              />
            </label>
          ) : (
            <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={imageUrl}
                  alt="Notice preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <p className="text-xs font-bold text-slate-500">
                  Image attached
                </p>
                <button
                  type="button"
                  onClick={() => setImageUrl("")}
                  className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-xs font-black text-red-600 transition hover:bg-red-100"
                >
                  <Trash2 size={15} />
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          disabled={loading || uploading}
          type="submit"
          className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-black text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
        >
          {loading ? "Publishing..." : "Publish Notice"}
        </button>
      </form>
    </div>
  );
}
