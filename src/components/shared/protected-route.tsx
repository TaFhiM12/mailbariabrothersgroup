"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    void Promise.resolve().then(() => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.replace("/login");
        return;
      }

      setIsChecking(false);
    });
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <div className="rounded-2xl bg-white px-5 py-4 text-sm font-bold text-slate-700 shadow-sm">
          Loading secure dashboard...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
