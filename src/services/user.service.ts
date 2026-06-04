import { api } from "@/lib/api";
import type {
  UpdateMyProfileInput,
  UpdateUserRoleInput,
  UpdateUserStatusInput,
  UserResponse,
  UsersResponse,
} from "@/types/user";

export const userService = {
  updateMyProfile: async (payload: UpdateMyProfileInput) => {
    const response = await api.patch<UserResponse>("/users/me", payload);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get<UsersResponse>("/users");
    return response.data;
  },

  updateRole: async (id: string, payload: UpdateUserRoleInput) => {
    const response = await api.patch<UserResponse>(`/users/${id}/role`, payload);
    return response.data;
  },

  updateStatus: async (id: string, payload: UpdateUserStatusInput) => {
    const response = await api.patch<UserResponse>(
      `/users/${id}/status`,
      payload
    );
    return response.data;
  },
};
