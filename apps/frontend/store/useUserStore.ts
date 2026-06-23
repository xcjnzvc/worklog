import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "USER" | "SUPER_ADMIN";
  companyId: string;
  companyName: string;
  plan: string; // "FREE" | "Basic" | "Pro"
  maxMembers: number; // 3 | 50 | 999999
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setIsLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: true,
      setUser: (user) => set({ user, isLoggedIn: true, isLoading: false }),
      clearUser: () => set({ user: null, isLoggedIn: false, isLoading: true }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        // isLoading은 저장 제외
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.user) {
          state.setIsLoading(false); // 유저 있을 때만 false
        }
        // user가 null이면 isLoading: true 유지 → 로그인 전까지 PageLoading
      },
    },
  ),
);
