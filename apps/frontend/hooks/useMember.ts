import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMemberListAPI, deleteMemberAPI } from "@/api/member";
import { MemberListResponse } from "@/types/member";

export const useMember = () => {
  const queryClient = useQueryClient();

  // 팀원 목록 조회 훅
  const useMemberList = (page: number = 1) =>
    useQuery<MemberListResponse>({
      queryKey: ["members", page],
      queryFn: () => getMemberListAPI(page),
      staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    });

  // 팀원 삭제(탈퇴) 훅
  const useDeleteMember = (onSuccessCallback?: () => void) =>
    useMutation({
      mutationFn: (id: string) => deleteMemberAPI(id),
      onSuccess: () => {
        // 목록 갱신
        queryClient.invalidateQueries({ queryKey: ["members"] });
        if (onSuccessCallback) onSuccessCallback();
      },
    });

  return {
    useMemberList,
    useDeleteMember,
  };
};
