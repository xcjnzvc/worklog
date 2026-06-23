import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveAttendanceAPI,
  getFixWorkLogAPI,
  getWeeklyAttendanceAPI,
  getWorkLogDashboardAPI,
  getWorkLogListAPI,
  postFixWorkLogAPI,
  rejectAttendanceAPI,
  getFixWorkLogListMgmtAPI,
} from "@/api/attendance";
import {
  WeeklyAttendanceResponse,
  AttendanceResponse,
  CreateFixRequestPayload,
  WorkLogDashboardResponseDto,
} from "@/types/attendance";

export const useAttendanceSummary = () => {
  return useQuery<WeeklyAttendanceResponse>({
    queryKey: ["summaryAttendance"],
    queryFn: getWeeklyAttendanceAPI,
  });
};

// 근무 기록 목록 조회 (LIST 탭용)
export const useWorkLogList = (page: number) => {
  return useQuery<AttendanceResponse>({
    queryKey: ["workLogList", page],
    queryFn: () => getWorkLogListAPI(page),
  });
};

// 내 정정 신청 내역 조회 (STATISTICS 탭용 - 유저 본인 전용)
export const useFixLogList = (page: number) => {
  return useQuery({
    queryKey: ["fixLogList", page],
    queryFn: () => getFixWorkLogAPI(page),
  });
};

// 💡 [새로 추가] 관리자/대표용 팀원 전체 정정 신청 목록 조회 훅
export const useFixLogListMgmt = (page: number) => {
  return useQuery({
    queryKey: ["fixLogListMgmt", page], // 👈 관리자 전용 고유 쿼리키 지정
    queryFn: () => getFixWorkLogListMgmtAPI(page),
  });
};

// 대시보드 통계 조회 (정정 요청/완료 건수 및 총 근무시간)
export const useWorkLogDashboard = () => {
  return useQuery<WorkLogDashboardResponseDto>({
    queryKey: ["workLogDashboard"],
    queryFn: getWorkLogDashboardAPI,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

// 근무 기록 수정 요청
export const useCreateFixRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateFixRequestPayload }) =>
      postFixWorkLogAPI(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workLogDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
      queryClient.invalidateQueries({ queryKey: ["workLogList"] });
    },
  });
};

// 관리자/대표용 정정 최종 승인 훅
export const useApproveAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => approveAttendanceAPI(id),
    onSuccess: () => {
      // 💡 승인되면 대표 화면의 팀원 목록("fixLogListMgmt")도 즉시 새로고침되도록 추가!
      queryClient.invalidateQueries({ queryKey: ["workLogDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogListMgmt"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
      queryClient.invalidateQueries({ queryKey: ["workLogList"] });
    },
  });
};

// 관리자/대표용 정정 신청 반려 훅
// export const useRejectAttendance = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, reason }: { id: string; reason: string }) =>
//       rejectAttendanceAPI(id, { rejectReason: reason }),
//     onSuccess: () => {
//       // 💡 반려되면 대표 화면의 팀원 목록("fixLogListMgmt")도 즉시 새로고침되도록 추가!
//       queryClient.invalidateQueries({ queryKey: ["workLogDashboard"] });
//       queryClient.invalidateQueries({ queryKey: ["fixLogListMgmt"] });
//       queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
//       queryClient.invalidateQueries({ queryKey: ["workLogList"] });
//     },
//   });
// };

export const useRejectAttendance = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectAttendanceAPI(id, { rejectReason: reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workLogDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogListMgmt"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
      queryClient.invalidateQueries({ queryKey: ["workLogList"] });

      // 전달받은 콜백이 있다면 실행
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
  });
};
