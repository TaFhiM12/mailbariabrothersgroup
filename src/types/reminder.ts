import type { ApiResponse } from "./api";
import type { Role } from "./auth";

export type ReminderStatus = "PENDING" | "SENT" | "FAILED";

export type PaymentReminder = {
  id: string;
  month: string;
  message: string;
  status: ReminderStatus;
  userId: string;
  sentAt?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
};

export type CreateMonthlyRemindersResponse = ApiResponse<{
  month: string;
  unpaidMembersCount: number;
  remindersCreated: number;
  reminders: PaymentReminder[];
}>;

export type RemindersResponse = ApiResponse<PaymentReminder[]>;
