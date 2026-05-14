import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFixWorkLogAPI,
  getWeeklyAttendanceAPI,
  getWorkLogDashboardAPI,
  getWorkLogListAPI,
  postFixWorkLogAPI,
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
    staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주
  });
};

//  근무 기록 목록 조회 (LIST 탭용)
export const useWorkLogList = (page: number) => {
  return useQuery<AttendanceResponse>({
    queryKey: ["workLogList", page],
    queryFn: () => getWorkLogListAPI(page),
  });
};

//  내 정정 신청 내역 조회 (STATISTICS 탭용)
export const useFixLogList = (page: number) => {
  return useQuery({
    queryKey: ["fixLogList", page], // 쿼리키에도 page 추가
    queryFn: () => getFixWorkLogAPI(page), // API 함수에도 page 전달
  });
};

//  근무 기록 수정 요청
// export const useCreateFixRequest = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     // id와 나머지 데이터를 분리해서 받음
//     mutationFn: ({ id, data }: { id: string; data: CreateFixRequestPayload }) =>
//       postFixWorkLogAPI(id, data),

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
//       queryClient.invalidateQueries({ queryKey: ["workLogList"] });
//     },
//   });
// };

// 대시보드 통계 조회 (정정 요청/완료 건수 및 총 근무시간)
export const useWorkLogDashboard = () => {
  return useQuery<WorkLogDashboardResponseDto>({
    queryKey: ["workLogDashboard"],
    queryFn: getWorkLogDashboardAPI,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
};

// 근무 기록 수정 요청 (onSuccess 부분 업데이트)
export const useCreateFixRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: CreateFixRequestPayload }) =>
      postFixWorkLogAPI(id, data),

    onSuccess: () => {
      // 💡 정정 요청이 성공하면 대시보드의 '요청 중' 개수도 변해야 하므로 추가
      queryClient.invalidateQueries({ queryKey: ["workLogDashboard"] });
      queryClient.invalidateQueries({ queryKey: ["fixLogList"] });
      queryClient.invalidateQueries({ queryKey: ["workLogList"] });
    },
  });
};
