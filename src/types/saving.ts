export type SavingStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Saving = {
  id: string;
  amount: string;
  month: string;
  note?: string | null;
  status: SavingStatus;

  proofImageUrl?: string | null;

  userId: string;
  approvedBy?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  updatedAt: string;

  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
};

export type CreateSavingInput = {
  amount: number;
  month: string;
  note?: string;
  proofImageUrl: string;
};

export type SavingsResponse = {
  success: boolean;
  message: string;
  data: Saving[];
};

export type SavingResponse = {
  success: boolean;
  message: string;
  data: Saving;
};
