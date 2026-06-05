"use client";

import { ReactNode } from "react";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { SanchoySathi } from "../shared/sanchoy-sathi";

type DashboardShellProps = {
  children: ReactNode;
};

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-100 lg:h-screen lg:overflow-hidden">
      <div className="flex min-w-0 lg:h-full">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col lg:h-full">
          <DashboardHeader />

          <main className="min-w-0 max-w-full flex-1 overflow-x-hidden p-4 pb-24 sm:p-6 lg:overflow-y-auto lg:pb-6">
            {children}
          </main>

          <SanchoySathi />
        </div>
      </div>
    </div>
  );
}
