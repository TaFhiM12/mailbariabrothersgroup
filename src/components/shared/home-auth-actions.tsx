"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

type HomeAuthActionsProps = {
  variant: "header" | "hero";
};

export function HomeAuthActions({ variant }: HomeAuthActionsProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    void Promise.resolve().then(() => {
      setHasToken(Boolean(localStorage.getItem("accessToken")));
    });
  }, []);

  const isLoggedIn = isAuthenticated || hasToken;

  const handleLogout = () => {
    logout();
    setHasToken(false);
  };

  if (variant === "header") {
    return (
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-white/80"
            >
              Dashboard
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-white/80"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800"
            >
              Register
            </Link>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
      {isLoggedIn ? (
        <>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-400"
          >
            Go to Dashboard
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-black text-slate-900 shadow-sm transition hover:border-slate-400"
          >
            Edit Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 bg-white px-6 py-4 text-base font-black text-red-700 shadow-sm transition hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </>
      ) : (
        <>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-black text-slate-950 shadow-lg shadow-emerald-900/10 transition hover:bg-emerald-400"
          >
            Login to Dashboard
            <ArrowRight size={20} />
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 text-base font-black text-slate-900 shadow-sm transition hover:border-slate-400"
          >
            Create Account
          </Link>
        </>
      )}
      {isLoggedIn && user?.name && (
        <p className="self-center text-sm font-bold text-slate-700 sm:pl-2">
          Signed in as {user.name}
        </p>
      )}
    </div>
  );
}
