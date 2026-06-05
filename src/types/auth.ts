export type Role = "PRESIDENT" | "ACCOUNTANT" | "COORDINATOR" | "MEMBER";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  imageUrl?: string | null;
  phone?: string | null;
  address?: string | null;
  occupation?: string | null;
  dateOfBirth?: string | null;
  emergencyContactName?: string | null;
  emergencyContactPhone?: string | null;
  bio?: string | null;
  createdAt: string;
  updatedAt: string;
  savingsSummary?: {
    approvedTotal: number;
    pendingTotal: number;
    rejectedTotal: number;
    approvedCount: number;
    pendingCount: number;
    rejectedCount: number;
    currentMonthApprovedTotal: number;
    currentMonthApprovedCount: number;
  };
};

export type AuthResponse = {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
};

export type MeResponse = {
  success: boolean;
  message: string;
  data: User;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
};
