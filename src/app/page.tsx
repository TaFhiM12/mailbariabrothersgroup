import Image from "next/image";
import type { ElementType } from "react";
import {
  Bell,
  ClipboardCheck,
  FileText,
  LockKeyhole,
  PiggyBank,
  Users,
} from "lucide-react";
import { HomeAuthActions } from "@/components/shared/home-auth-actions";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f4f8f5] text-slate-950">
      <section className="relative overflow-hidden border-b border-emerald-900/10 bg-[radial-gradient(circle_at_top_left,#d9f99d_0,#ecfdf5_32%,#f8fafc_68%)]">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f4f8f5] to-transparent" />

        <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col px-5 py-5 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-emerald-900/10 bg-white shadow-sm">
                <Image
                  src="/club-logo.jpeg"
                  alt="Mailbaria Brothers Group logo"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                  priority
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-950 sm:text-base">
                  Mailbaria Brothers Group
                </p>
                <p className="text-xs font-medium text-emerald-800">
                  Savings Club
                </p>
              </div>
            </div>

            <HomeAuthActions variant="header" />
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.04fr_0.96fr] lg:py-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-800/15 bg-white/80 px-4 py-2 text-sm font-bold text-emerald-800 shadow-sm">
                <LockKeyhole size={16} />
                Private savings management
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Mailbaria Brothers Group
              </h1>

              <p className="mt-5 max-w-2xl text-lg font-medium leading-8 text-slate-700 sm:text-xl">
                Manage monthly savings, payment proof, expenses, notices,
                reports and member activity from one clear club dashboard.
              </p>

              <HomeAuthActions variant="hero" />
            </div>

            <div className="relative mx-auto w-full max-w-xl">
              <div className="overflow-hidden rounded-[2rem] border border-white bg-white p-5 shadow-2xl shadow-emerald-950/10">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-3xl bg-emerald-50">
                    <Image
                      src="/club-logo.jpeg"
                      alt="Mailbaria Brothers Group"
                      width={80}
                      height={80}
                      className="h-full w-full object-contain"
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold uppercase text-emerald-700">
                      Club Dashboard
                    </p>
                    <h2 className="text-2xl font-black text-slate-950">
                      Savings made visible
                    </h2>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <Feature icon={PiggyBank} label="Savings" value="Monthly proof" />
                  <Feature icon={ClipboardCheck} label="Approvals" value="Fast review" />
                  <Feature icon={FileText} label="Reports" value="PDF & Excel" />
                  <Feature icon={Bell} label="Reminders" value="Member alerts" />
                </div>

                <div className="mt-5 rounded-2xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-300">
                        Built for members
                      </p>
                      <p className="mt-2 text-3xl font-black">Clear. Secure. Simple.</p>
                    </div>
                    <Users className="text-emerald-300" size={42} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <Icon className="text-emerald-600" size={24} />
      <p className="mt-3 text-sm font-black text-slate-950">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-600">{value}</p>
    </div>
  );
}
