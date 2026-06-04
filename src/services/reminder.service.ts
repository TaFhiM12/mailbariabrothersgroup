import { api } from "@/lib/api";
import type {
  CreateMonthlyRemindersResponse,
  RemindersResponse,
} from "@/types/reminder";

export const reminderService = {
  getMy: async () => {
    const response = await api.get<RemindersResponse>("/reminders/my");
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<RemindersResponse>("/reminders");
    return response.data;
  },

  createMonthly: async (month: string) => {
    const response = await api.post<CreateMonthlyRemindersResponse>(
      "/reminders/monthly",
      { month }
    );
    return response.data;
  },
};
