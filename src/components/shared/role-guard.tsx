"use client";

import { ReactNode } from "react";
import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types/auth";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: ReactNode;
};

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="rounded-2xl bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
        <p className="mt-2 text-slate-500">
          You are not allowed to view this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}