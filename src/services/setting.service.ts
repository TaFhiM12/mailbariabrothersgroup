import { api } from "@/lib/api";
import type { SettingResponse, UpdateSettingInput } from "@/types/setting";

export const settingService = {
  get: async () => {
    const response = await api.get<SettingResponse>("/settings");
    return response.data;
  },

  update: async (payload: UpdateSettingInput) => {
    const response = await api.patch<SettingResponse>("/settings", payload);
    return response.data;
  },
};
