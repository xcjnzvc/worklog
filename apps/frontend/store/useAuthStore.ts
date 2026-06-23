import Cookies from "js-cookie";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useUserStore } from "./useUserStore";
import { loginAPI } from "@/api/auth";
import { LoginForm } from "@/types/auth";
import { QueryClient } from "@tanstack/react-query";

interface AuthStore {
  token: string | null;
  login: (data: LoginForm) => Promise<void>;
  logout: () => void;
}

export const queryClient = new QueryClient();

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      login: async (data: LoginForm) => {
        useUserStore.getState().setIsLoading(true);
        const res = await loginAPI(data);
        set({ token: res.token });
        Cookies.set("accessToken", res.token, { expires: 7 });
        useUserStore.getState().setUser(res.user);
      },
      logout: () => {
        set({ token: null });
        Cookies.remove("accessToken");
        useUserStore.getState().clearUser();
        queryClient.clear();
      },
    }),
    { name: "auth-storage" },
  ),
);
