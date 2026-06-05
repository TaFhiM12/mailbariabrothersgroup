"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Home } from "lucide-react";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const passwordsDoNotMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (passwordsDoNotMatch) {
      setError("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);
      const result = await authService.register({ name, email, password });
      setAuth(result.data.user, result.data.token);
      router.push("/dashboard");
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Could not create account. Please check your details."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#bbf7d0_0,#f8fafc_56%)] px-4 py-10">
      <Link
        href="/"
        className="fixed left-4 top-4 z-10 rounded-2xl border border-slate-200 bg-white/90 p-3 text-slate-800 shadow-sm backdrop-blur transition hover:bg-white"
        aria-label="Go to home page"
        title="Home"
      >
        <Home size={20} />
      </Link>

      <form
        onSubmit={handleRegister}
        className="w-full max-w-lg rounded-3xl bg-white p-7 shadow-xl shadow-emerald-950/10 sm:p-8"
      >
        <AuthBrand />

        <h1 className="mt-6 text-2xl font-black text-slate-950">
          Create your member account
        </h1>
        <p className="mt-2 text-sm font-medium text-slate-600">
          Register as a member and access the savings dashboard.
        </p>

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </p>
        )}

        <div className="mt-6">
          <label className="text-sm font-bold text-slate-800">Full Name</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600"
            placeholder="Your name"
            required
          />
        </div>

        <div className="mt-4">
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-800">Password</label>
            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-12 text-slate-950 outline-none focus:border-emerald-600"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-800">
              Confirm Password
            </label>
            <div className="relative mt-2">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={`w-full rounded-xl border px-4 py-3 pr-12 text-slate-950 outline-none ${
                  passwordsDoNotMatch
                    ? "border-red-300 focus:border-red-500"
                    : "border-slate-300 focus:border-emerald-600"
                }`}
                placeholder="Repeat password"
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                title={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {passwordsDoNotMatch && (
              <p className="mt-2 text-xs font-bold text-red-600">
                Password and confirm password do not match.
              </p>
            )}
          </div>
        </div>

        <button
          disabled={isLoading || passwordsDoNotMatch}
          type="submit"
          className="mt-6 w-full rounded-xl bg-emerald-500 px-4 py-3 font-black text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="mt-5 text-center text-sm font-semibold text-slate-700">
          Already have an account?{" "}
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
