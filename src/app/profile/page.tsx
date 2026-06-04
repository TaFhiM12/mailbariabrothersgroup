"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Camera, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ProtectedRoute } from "@/components/shared/protected-route";
import { userService } from "@/services/user.service";
import { useAuthStore } from "@/store/auth.store";
import type { UpdateMyProfileInput } from "@/types/user";

const CLOUDINARY_CLOUD_NAME = "dlrxpdjbz";
const CLOUDINARY_UPLOAD_PRESET = "mailbariabrothersgroup";

type CloudinaryResponse = {
  secure_url: string;
};

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [form, setForm] = useState<UpdateMyProfileInput>({
    name: "",
    imageUrl: "",
    phone: "",
    address: "",
    occupation: "",
    dateOfBirth: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;

    void Promise.resolve().then(() => {
      setForm({
        name: user.name || "",
        imageUrl: user.imageUrl || "",
        phone: user.phone || "",
        address: user.address || "",
        occupation: user.occupation || "",
        dateOfBirth: user.dateOfBirth || "",
        emergencyContactName: user.emergencyContactName || "",
        emergencyContactPhone: user.emergencyContactPhone || "",
        bio: user.bio || "",
      });
    });
  }, [user]);

  const updateField = (field: keyof UpdateMyProfileInput, value: string) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

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
      updateField("imageUrl", uploadedUrl);
      toast.success("Profile photo uploaded");
    } catch {
      toast.error("Photo upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setSaving(true);
      const result = await userService.updateMyProfile(form);
      setUser(result.data);
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardShell>
        <div className="mx-auto max-w-5xl space-y-6">
          <div>
            <h1 className="text-2xl font-black text-slate-950">
              Profile Settings
            </h1>
            <p className="text-sm font-medium text-slate-600">
              Keep your member information, contact details and profile photo up
              to date.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-2xl bg-white p-5 shadow-sm lg:grid-cols-[280px_1fr] lg:p-6"
          >
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mx-auto h-36 w-36 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                {form.imageUrl ? (
                  <Image
                    src={form.imageUrl}
                    alt={form.name || "Profile photo"}
                    width={144}
                    height={144}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500">
                    <UserRound size={54} />
                  </div>
                )}
              </div>

              <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
                <Camera size={18} />
                {uploading ? "Uploading..." : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              <p className="mt-4 text-center text-xs font-semibold leading-5 text-slate-600">
                JPG, PNG or WEBP. Maximum file size 3MB.
              </p>
            </section>

            <section className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <ProfileField
                  label="Full Name"
                  value={form.name || ""}
                  onChange={(value) => updateField("name", value)}
                  required
                />
                <ProfileField
                  label="Email"
                  value={user?.email || ""}
                  disabled
                  helper="Email changes are managed by club admins."
                />
                <ProfileField
                  label="Mobile Number"
                  value={form.phone || ""}
                  onChange={(value) => updateField("phone", value)}
                  placeholder="+8801XXXXXXXXX"
                />
                <ProfileField
                  label="Occupation"
                  value={form.occupation || ""}
                  onChange={(value) => updateField("occupation", value)}
                  placeholder="Business, service, student..."
                />
                <ProfileField
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth || ""}
                  onChange={(value) => updateField("dateOfBirth", value)}
                />
                <ProfileField
                  label="Emergency Contact Phone"
                  value={form.emergencyContactPhone || ""}
                  onChange={(value) =>
                    updateField("emergencyContactPhone", value)
                  }
                  placeholder="+8801XXXXXXXXX"
                />
                <ProfileField
                  label="Emergency Contact Name"
                  value={form.emergencyContactName || ""}
                  onChange={(value) =>
                    updateField("emergencyContactName", value)
                  }
                  placeholder="Family member or trusted contact"
                />
                <ProfileField
                  label="Profile Image URL"
                  value={form.imageUrl || ""}
                  onChange={(value) => updateField("imageUrl", value)}
                  placeholder="Uploaded photo URL"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800">
                  Address
                </label>
                <textarea
                  value={form.address || ""}
                  onChange={(event) => updateField("address", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600"
                  rows={3}
                  placeholder="Village, post office, upazila, district"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-800">Bio</label>
                <textarea
                  value={form.bio || ""}
                  onChange={(event) => updateField("bio", event.target.value)}
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600"
                  rows={4}
                  placeholder="Short member note"
                />
              </div>

              <button
                type="submit"
                disabled={saving || uploading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60 sm:w-auto"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </section>
          </form>
        </div>
      </DashboardShell>
    </ProtectedRoute>
  );
}

function ProfileField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  helper,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-800">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600 disabled:bg-slate-100 disabled:text-slate-600"
        placeholder={placeholder}
        disabled={disabled}
        required={required}
      />
      {helper && <p className="mt-1 text-xs font-medium text-slate-600">{helper}</p>}
    </div>
  );
}
