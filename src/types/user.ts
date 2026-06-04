import type { ApiResponse } from "./api";
import type { Role, User } from "./auth";

export type UsersResponse = ApiResponse<User[]>;
export type UserResponse = ApiResponse<User>;

export type UpdateUserRoleInput = {
  role: Role;
};

export type UpdateUserStatusInput = {
  isActive: boolean;
};

export type UpdateMyProfileInput = {
  name?: string;
  imageUrl?: string;
  phone?: string;
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bio?: string;
};
