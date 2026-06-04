export type ExpenseStatus = "ACTIVE" | "CANCELLED";

export type Expense = {
  id: string;
  title: string;
  amount: string;
  description?: string | null;
  status: ExpenseStatus;
  createdBy: string;
  cancelledBy?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateExpenseInput = {
  title: string;
  amount: number;
  description?: string;
};

export type UpdateExpenseInput = {
  title?: string;
  amount?: number;
  description?: string;
};

export type ExpenseResponse = {
  success: boolean;
  message: string;
  data: Expense;
};

export type ExpensesResponse = {
  success: boolean;
  message: string;
  data: Expense[];
};