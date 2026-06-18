import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getVacationAPI,
  getApproversAPI,
  createVacationAPI,
  getApprovalsAPI,
  approveVacationAPI,
  rejectVacationAPI,
} from "@/api/vacation";
import { VacationResponse } from "@/types/vacation";
import { Approver, CreateVacationPayload } from "@/types/user";
import { useUserStore } from "@/store/useUserStore";
import { AxiosError } from "axios";

export const useVacation = () => {
  const queryClient = useQueryClient();

  const useVacationList = (page: number = 1) =>
    useQuery({
      queryKey: ["vacations", page],
      queryFn: () => getVacationAPI(page),
      staleTime: 1000 * 60 * 5,
      select: (response: VacationResponse) => ({
        list: response.data,
        summary: response.summary,
        metadata: response.meta,
      }),
    });

  const useApprovers = () =>
    useQuery<Approver[]>({
      queryKey: ["approvers"],
      queryFn: getApproversAPI,
    });

  const useCreateVacation = () =>
    useMutation<unknown, Error, CreateVacationPayload>({
      mutationFn: createVacationAPI,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vacations"] });
      },
    });

  const useApprovalList = (page: number, status?: string) => {
    // 1. useUserStore에서 유저 정보를 가져옵니다.
    const user = useUserStore((state) => state.user);

    // 2. 권한 확인 (user가 존재하고, role이 OWNER 또는 ADMIN인 경우)
    const isAdmin = user?.role === "OWNER" || user?.role === "ADMIN";

    return useQuery({
      queryKey: ["vacation", "approvals", page, status],
      queryFn: () => getApprovalsAPI({ page, limit: 10, status }),

      // 3. 관리자일 때만 API 호출 (원천 차단)
      enabled: isAdmin,

      // 4. 안전장치: 권한 에러는 재시도하지 않음
      retry: (failureCount, error) => {
        // 2. error를 AxiosError로 타입 단언(Type Assertion)하거나 검사
        const axiosError = error as AxiosError;

        // 3. 이제 error.response?.status에 안전하게 접근 가능
        if (axiosError.response?.status === 403) return false;

        return failureCount < 3;
      },
    });
  };

  const useApproveVacation = () =>
    useMutation({
      mutationFn: (id: string) => approveVacationAPI(id),
      onSuccess: () => {
        // ✅ 둘 다 무효화
        queryClient.invalidateQueries({ queryKey: ["vacation", "approvals"] });
        queryClient.invalidateQueries({ queryKey: ["vacations"] }); // USER 목록도 갱신
      },
    });

  const useRejectVacation = () =>
    useMutation({
      mutationFn: ({
        id,
        rejectReason,
      }: {
        id: string;
        rejectReason: string;
      }) => rejectVacationAPI(id, { rejectReason }), // API 함수에도 사유 객체 전달
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["vacation", "approvals"] });
        queryClient.invalidateQueries({ queryKey: ["vacations"] });
      },
    });

  return {
    useVacationList,
    useApprovers,
    useCreateVacation,
    useApprovalList,
    useApproveVacation,
    useRejectVacation,
  };
};
