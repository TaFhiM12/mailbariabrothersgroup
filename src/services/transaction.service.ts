import { api } from "@/lib/api";
import type {
  CreateTransactionInput,
  TransactionResponse,
  TransactionsResponse,
} from "@/types/transaction";

export const transactionService = {
  create: async (payload: CreateTransactionInput) => {
    const response = await api.post<TransactionResponse>(
      "/transactions",
      payload
    );
    return response.data;
  },

  getMy: async () => {
    const response = await api.get<TransactionsResponse>("/transactions/my");
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<TransactionsResponse>("/transactions");
    return response.data;
  },
};
