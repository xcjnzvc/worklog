import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./useUserStore";
import { loginAPI } from "@/api/auth";
import { LoginForm } from "@/types/auth";

interface AuthStore {
  token: string | null;
  login: (data: LoginForm) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      login: async (data: LoginForm) => {
        const res = await loginAPI(data);
        set({ token: res.token });
        useUserStore.getState().setUser(res.user);
      },
      logout: () => {
        set({ token: null });
        useUserStore.getState().clearUser();
      },
    }),
    { name: "auth-storage" },
  ),
);
