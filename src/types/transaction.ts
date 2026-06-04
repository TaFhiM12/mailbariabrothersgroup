import type { ApiResponse } from "./api";
import type { Role } from "./auth";

export type TransactionType = "DEPOSIT" | "WITHDRAW" | "ADJUSTMENT";

export type Transaction = {
  id: string;
  amount: string;
  type: TransactionType;
  note?: string | null;
  userId: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
};

export type CreateTransactionInput = {
  userId: string;
  amount: number;
  type: TransactionType;
  note?: string;
};

export type TransactionResponse = ApiResponse<Transaction>;
export type TransactionsResponse = ApiResponse<Transaction[]>;
