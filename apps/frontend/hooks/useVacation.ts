import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVacationAPI,
  getApproversAPI,
  createVacationAPI,
} from "@/api/vacation";
import { VacationResponse } from "@/types/vacation";
import { Approver, CreateVacationPayload } from "@/types/user";

export const useVacation = () => {
  const queryClient = useQueryClient();

  // 1. 휴가 내역 목록 조회
  const useVacationList = () =>
    useQuery({
      queryKey: ["vacations"],
      queryFn: getVacationAPI,
      staleTime: 1000 * 60 * 5,
      select: (response: VacationResponse) => ({
        list: response.data,
        summary: response.summary,
        meta: response.meta,
      }),
    });

  // 2. 결재권자 목록 조회 (Axios 적용)
  const useApprovers = () =>
    useQuery<Approver[]>({
      queryKey: ["approvers"],
      queryFn: getApproversAPI,
    });

  // 3. 휴가 신청하기 (Mutation)
  const useCreateVacation = () =>
    useMutation<unknown, Error, CreateVacationPayload>({
      mutationFn: createVacationAPI,
      onSuccess: () => {
        // 성공 시 휴가 목록과 요약 데이터를 무효화하여 새로고침
        queryClient.invalidateQueries({ queryKey: ["vacations"] });
      },
    });

  return { useVacationList, useApprovers, useCreateVacation };
};
