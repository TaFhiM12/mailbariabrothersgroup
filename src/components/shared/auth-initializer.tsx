"use client";

import { useEffect } from "react";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function AuthInitializer() {
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    const loadUser = async () => {
      try {
        const result = await authService.me();
        setUser(result.data);
      } catch {
        logout();
      }
    };

    loadUser();
  }, [setUser, logout]);

  return null;
}