import type { ApiResponse } from "./api";

export type ClubSetting = {
  id: string;
  clubName: string;
  monthlySavingAmount: string;
  paymentDeadlineDay: number;
  reminderEnabled: boolean;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSettingInput = {
  clubName?: string;
  monthlySavingAmount?: number;
  paymentDeadlineDay?: number;
  reminderEnabled?: boolean;
};

export type SettingResponse = ApiResponse<ClubSetting>;
