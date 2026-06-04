import { api } from "../lib/api";
import type {
  AuthResponse,
  LoginInput,
  MeResponse,
  RegisterInput,
} from "../types/auth";

export const authService = {
  register: async (payload: RegisterInput) => {
    const response = await api.post<AuthResponse>("/auth/register", payload);
    return response.data;
  },

  login: async (payload: LoginInput) => {
    const response = await api.post<AuthResponse>("/auth/login", payload);
    return response.data;
  },

  me: async () => {
    const response = await api.get<MeResponse>("/auth/me");
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  resetPassword: async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
      token,
      password,
    });

    return response.data;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },
};