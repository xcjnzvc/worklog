import Cookies from "js-cookie"; // 설치 필요: npm install js-cookie
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

        // 1. Zustand(localStorage)에 저장 (기존 방식)
        set({ token: res.token });

        // 2. 중요! 미들웨어가 읽을 수 있게 쿠키에 저장
        Cookies.set("accessToken", res.token, { expires: 7 });

        // 3. 유저 정보 저장
        useUserStore.getState().setUser(res.user);
      },
      logout: () => {
        set({ token: null });
        Cookies.remove("accessToken"); // 쿠키 삭제
        useUserStore.getState().clearUser();
      },
    }),
    { name: "auth-storage" },
  ),
);
