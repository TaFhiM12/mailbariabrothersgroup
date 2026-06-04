import { api } from "@/lib/api";
import type {
  CreateSavingInput,
  SavingResponse,
  SavingsResponse,
} from "@/types/saving";

export const savingService = {
  create: async (payload: CreateSavingInput) => {
    const response = await api.post<SavingResponse>("/savings", payload);
    return response.data;
  },

  getMySavings: async () => {
    const response = await api.get<SavingsResponse>("/savings/my");
    return response.data;
  },

  getAllSavings: async () => {
    const response = await api.get<SavingsResponse>("/savings");
    return response.data;
  },

  approve: async (id: string, note = "") => {
    const response = await api.patch<SavingResponse>(`/savings/${id}/approve`, {
      note,
    });
    return response.data;
  },

  reject: async (id: string, note = "") => {
    const response = await api.patch<SavingResponse>(`/savings/${id}/reject`, {
      note,
    });
    return response.data;
  },
};
