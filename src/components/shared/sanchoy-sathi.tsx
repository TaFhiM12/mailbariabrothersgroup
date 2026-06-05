"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Bot,
  ChevronDown,
  CircleHelp,
  FileSpreadsheet,
  Megaphone,
  MessageCircle,
  PiggyBank,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

type HelpTopic = {
  id: string;
  title: string;
  category: string;
  audience: "ALL" | "MEMBER" | "ADMIN";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  answer: string;
  steps?: string[];
};

const topics: HelpTopic[] = [
  {
    id: "submit-saving",
    title: "How do I submit savings?",
    category: "Savings",
    audience: "ALL",
    icon: PiggyBank,
    answer:
      "Go to Savings, press Add Saving, enter your amount, choose month, upload payment screenshot, then submit. You can save any amount and multiple times in the same month.",
    steps: [
      "Open Savings from sidebar.",
      "Click Add Saving.",
      "Enter amount and month.",
      "Upload payment proof screenshot.",
      "Submit and wait for approval.",
    ],
  },
  {
    id: "saving-status",
    title: "How do I know if my saving is approved?",
    category: "Savings",
    audience: "ALL",
    icon: ShieldCheck,
    answer:
      "Your Savings page shows each entry status. Pending means waiting for review, Approved means added to your account, and Rejected means proof or details need correction.",
  },
  {
    id: "rejected-saving",
    title: "What should I do if saving is rejected?",
    category: "Savings",
    audience: "ALL",
    icon: CircleHelp,
    answer:
      "Check the notification message first. Usually you should upload a clearer payment screenshot or correct the month/amount, then submit a new saving entry.",
  },
  {
    id: "notifications",
    title: "What will notifications tell me?",
    category: "Notifications",
    audience: "ALL",
    icon: Bell,
    answer:
      "Notifications tell you about saving approvals/rejections, payment reminders, new notices, expenses, and important member/account activity.",
  },
  {
    id: "profile",
    title: "How do I update my profile?",
    category: "Profile",
    audience: "ALL",
    icon: UserRound,
    answer:
      "Go to Profile, update your phone, address, occupation, emergency contact, bio, or photo, then save. Keeping profile data updated helps club admins contact you.",
  },
  {
    id: "notice",
    title: "Where can I see club notices?",
    category: "Notices",
    audience: "ALL",
    icon: Megaphone,
    answer:
      "Open Notices from the sidebar. New notices also create notifications, so members do not miss important club announcements.",
  },
  {
    id: "reports",
    title: "How do admins check reports?",
    category: "Reports",
    audience: "ADMIN",
    icon: FileSpreadsheet,
    answer:
      "Admins can open Reports to see savings, expenses, member summaries, and export professional PDF/Excel files for meetings or records.",
  },
  {
    id: "approve-saving",
    title: "How should admins approve savings?",
    category: "Admin",
    audience: "ADMIN",
    icon: WalletCards,
    answer:
      "Check payment proof, amount, and month carefully. Approve only valid entries. When approved, the member gets notified and the amount is added to the ledger.",
  },
  {
    id: "member-totals",
    title: "How can admins see user-wise savings?",
    category: "Admin",
    audience: "ADMIN",
    icon: UserRound,
    answer:
      "Open Members. Each member row shows total approved savings, this month savings, and pending amount so leadership can quickly understand each account.",
  },
];

const adminRoles = new Set(["PRESIDENT", "COORDINATOR", "ACCOUNTANT"]);

export function SanchoySathi() {
  const { user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(topics[0].id);

  const isAdmin = adminRoles.has(user?.role || "");

  const visibleTopics = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return topics.filter((topic) => {
      const allowed =
        topic.audience === "ALL" ||
        (topic.audience === "ADMIN" && isAdmin) ||
        (topic.audience === "MEMBER" && !isAdmin);
      const searchable = `${topic.title} ${topic.category} ${topic.answer}`.toLowerCase();

      return allowed && searchable.includes(normalizedQuery);
    });
  }, [isAdmin, query]);

  const selectedTopic =
    visibleTopics.find((topic) => topic.id === selectedId) ||
    visibleTopics[0] ||
    topics[0];
  const SelectedIcon = selectedTopic.icon;

  return (
    <div className="fixed bottom-24 right-3 z-40 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="fixed inset-x-3 bottom-24 flex max-h-[min(640px,calc(100vh-8rem))] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/15 sm:static sm:mb-3 sm:w-[420px] sm:max-h-[min(720px,calc(100vh-7rem))]">
          <div className="bg-slate-950 p-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-slate-950">
                  <Bot size={23} />
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-base font-black">
                    Sanchoy Sathi
                  </h2>
                  <p className="text-xs font-semibold text-slate-300">
                    Club website helper
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-2xl p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Close helper"
              >
                <X size={19} />
              </button>
            </div>

            <p className="mt-4 text-sm font-medium leading-6 text-slate-300">
              Ask from ready-made questions. I help members use savings,
              notices, reports, notifications, and profile pages.
            </p>
          </div>

          <div className="border-b border-slate-100 p-4">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search help topics..."
                className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-semibold outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="grid min-h-0 flex-1 md:grid-cols-[160px_1fr]">
            <div className="table-scroll max-h-56 border-b border-slate-100 p-3 md:max-h-none md:border-b-0 md:border-r">
              <div className="flex gap-2 md:block md:space-y-2">
                {visibleTopics.length === 0 ? (
                  <p className="px-2 py-3 text-sm font-semibold text-slate-500">
                    No topic found.
                  </p>
                ) : (
                  visibleTopics.map((topic) => {
                    const Icon = topic.icon;
                    const active = topic.id === selectedTopic.id;

                    return (
                      <button
                        key={topic.id}
                        type="button"
                        onClick={() => setSelectedId(topic.id)}
                        className={`flex min-w-40 items-center gap-2 rounded-2xl px-3 py-2 text-left text-xs font-black transition md:w-full ${
                          active
                            ? "bg-slate-950 text-white"
                            : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <Icon size={16} className="shrink-0" />
                        <span className="truncate">{topic.category}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="table-scroll max-h-[360px] p-4">
              <div className="inline-flex items-center gap-2 rounded-2xl bg-emerald-50 px-3 py-1.5 text-xs font-black text-emerald-700">
                <SelectedIcon size={15} />
                {selectedTopic.category}
              </div>

              <h3 className="mt-4 text-lg font-black leading-6 text-slate-950">
                {selectedTopic.title}
              </h3>
              <p className="mt-3 text-sm font-medium leading-6 text-slate-600">
                {selectedTopic.answer}
              </p>

              {selectedTopic.steps && (
                <div className="mt-4 space-y-2">
                  {selectedTopic.steps.map((step, index) => (
                    <div
                      key={step}
                      className="flex gap-3 rounded-2xl bg-slate-50 p-3"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white">
                        {index + 1}
                      </span>
                      <p className="text-sm font-semibold leading-6 text-slate-700">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-3">
                <p className="text-xs font-bold leading-5 text-amber-800">
                  Sanchoy Sathi gives prepared help only. For payment disputes
                  or account changes, contact club leadership.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 font-black text-white shadow-2xl shadow-slate-950/20 transition hover:bg-slate-800 sm:h-14 sm:w-auto sm:gap-3 sm:px-4"
        aria-label={isOpen ? "Close Sanchoy Sathi helper" : "Open Sanchoy Sathi helper"}
      >
        <MessageCircle size={22} className="text-emerald-300" />
        <span className="hidden sm:inline">Sanchoy Sathi</span>
        <ChevronDown
          size={18}
          className={`transition ${isOpen ? "" : "rotate-180"}`}
        />
      </button>
    </div>
  );
}
