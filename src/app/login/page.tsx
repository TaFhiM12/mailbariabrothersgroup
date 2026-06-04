"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { getApiErrorMessage } from "@/lib/get-api-error-message";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const result = await authService.login({
        email,
        password,
      });

      setAuth(result.data.user, result.data.token);

      router.push("/dashboard");
    } catch (error) {
      setError(getApiErrorMessage(error, "Invalid email or password"));
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
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl shadow-emerald-950/10 sm:p-8"
      >
        <Link href="/" className="mb-6 flex items-center gap-3">
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

        <h1 className="text-2xl font-black text-slate-950">Welcome back</h1>

        <p className="mt-2 text-sm font-medium text-slate-600">
          Login to your private club account
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6">
          <label className="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mt-4">
          <label className="text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-950 outline-none focus:border-emerald-600"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="******"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white transition hover:bg-slate-800 disabled:opacity-60"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <div className="mt-5 flex flex-col gap-2 text-center text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
          <Link href="/forgot-password" className="text-emerald-700 hover:text-emerald-800">
            Forgot password?
          </Link>
          <Link href="/register" className="text-slate-700 hover:text-slate-950">
            Create an account
          </Link>
        </div>
      </form>
    </main>
  );
}
