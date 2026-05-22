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

  const useApprovalList = (page: number, status?: string) =>
    useQuery({
      queryKey: ["vacation", "approvals", page, status],
      queryFn: () => getApprovalsAPI({ page, limit: 10, status }),
    });

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
