"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, Mail } from "lucide-react";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { authService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setIsLoading(true);
      const result = await authService.forgotPassword(email);
      setMessage(result.message || "If this email exists, a reset link has been sent.");
    } catch (error) {
      setError(
        getApiErrorMessage(error, "Could not send reset link. Please try again.")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#dcfce7_0,#f8fafc_58%)] px-4 py-10">
      <Link
        href="/"
        className="fixed left-4 top-4 z-10 rounded-2xl border border-slate-200 bg-white/90 p-3 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
        aria-label="Go to home page"
        title="Home"
      >
        <Home size={20} />
      </Link>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-emerald-950/10 sm:p-8"
      >
        <AuthBrand />

        <div className="mt-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Mail size={24} />
        </div>

        <h1 className="mt-5 text-2xl font-black text-slate-950">
          Forgot password
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
          Enter your account email. If it exists, the server will send a reset
          link to that address.
        </p>

        {message && (
          <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm font-semibold text-emerald-800">
            {message}
          </p>
        )}

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6">
          <label className="text-sm font-bold text-slate-800">Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600"
            placeholder="you@example.com"
            required
          />
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>

        <p className="mt-5 text-center text-sm font-semibold text-slate-700">
          Remembered your password?{" "}
          <Link href="/login" className="text-emerald-700 hover:text-emerald-800">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}

function AuthBrand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <Image
          src="/club-logo.jpeg"
          alt="Mailbaria Brothers Group logo"
          width={56}
          height={56}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <span>
        <span className="block text-base font-black text-slate-950">
          Mailbaria Brothers Group
        </span>
        <span className="text-sm font-semibold text-emerald-700">
          Savings Club
        </span>
      </span>
    </Link>
  );
}
