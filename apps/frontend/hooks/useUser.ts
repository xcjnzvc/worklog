import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/user";

interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: UserRole;
}

interface UserStore {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoading: false,
      setUser: (user) => set({ user, isLoggedIn: true }),
      clearUser: () => set({ user: null, isLoggedIn: false }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "user-storage",
    },
  ),
);
