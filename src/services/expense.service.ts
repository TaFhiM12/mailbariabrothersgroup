import { api } from "@/lib/api";
import type {
  CreateExpenseInput,
  ExpenseResponse,
  ExpensesResponse,
  UpdateExpenseInput,
} from "@/types/expense";

export const expenseService = {
  create: async (payload: CreateExpenseInput) => {
    const response = await api.post<ExpenseResponse>("/expenses", payload);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<ExpensesResponse>("/expenses");
    return response.data;
  },

  update: async (id: string, payload: UpdateExpenseInput) => {
    const response = await api.patch<ExpenseResponse>(
      `/expenses/${id}`,
      payload
    );
    return response.data;
  },

  cancel: async (id: string) => {
    const response = await api.patch<ExpenseResponse>(
      `/expenses/${id}/cancel`
    );
    return response.data;
  },
};