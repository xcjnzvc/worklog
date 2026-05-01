import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "USER";
  companyId: string;
  companyName: string;
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
      clearUser: () => set({ user: null, isLoggedIn: false, isLoading: false }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "user-storage" },
  ),
);
