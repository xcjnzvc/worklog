// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { Approver, CreateVacationPayload } from "@/types/user";

// export const useUser = () => {
//   const queryClient = useQueryClient();

//   // 1. 결재권자 목록 가져오기
//   const useApprovers = () =>
//     useQuery<Approver[]>({
//       queryKey: ["approvers"],
//       queryFn: async () => {
//         const res = await fetch("/api/users/approvers");
//         if (!res.ok) throw new Error("결재권자 로드 실패");
//         return res.json();
//       },
//     });

//   // 2. 휴가 신청하기 (Mutation)
//   // any 대신 unknown 또는 구체적인 응답 인터페이스를 넣으세요.
//   const useCreateVacation = () =>
//     useMutation<unknown, Error, CreateVacationPayload>({
//       mutationFn: async (payload: CreateVacationPayload) => {
//         const res = await fetch("/api/vacations", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(payload),
//         });
//         if (!res.ok) throw new Error("신청 실패");
//         return res.json();
//       },
//       onSuccess: () => {
//         queryClient.invalidateQueries({ queryKey: ["vacations"] });
//       },
//     });

//   return { useApprovers, useCreateVacation };
// };

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types/user";

interface User {
  id: string;
  name: string;
  email: string;
  companyName: string;
  role: UserRole; // types/user.ts에서 가져온 타입 적용
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
