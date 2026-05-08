import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Approver, CreateVacationPayload } from "@/types/user";

export const useUser = () => {
  const queryClient = useQueryClient();

  // 1. 결재권자 목록 가져오기
  const useApprovers = () =>
    useQuery<Approver[]>({
      queryKey: ["approvers"],
      queryFn: async () => {
        const res = await fetch("/api/users/approvers");
        if (!res.ok) throw new Error("결재권자 로드 실패");
        return res.json();
      },
    });

  // 2. 휴가 신청하기 (Mutation)
  // any 대신 unknown 또는 구체적인 응답 인터페이스를 넣으세요.
  const useCreateVacation = () =>
    useMutation<unknown, Error, CreateVacationPayload>({
      mutationFn: async (payload: CreateVacationPayload) => {
        const res = await fetch("/api/vacations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("신청 실패");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vacations"] });
      },
    });

  return { useApprovers, useCreateVacation };
};
