import { useQuery } from "@tanstack/react-query";
import { getWeeklyAttendanceAPI } from "@/api/attendance";
import { WeeklyAttendanceResponse } from "@/types/attendance";
// import { AttendanceStatus } from "@/types/attendance";

// export interface AttendanceStat {
//   label: string;
//   value: string | number;
//   unit: string;
// }

// export interface WeeklyAttendanceResponse {
//   weeklySummary: {
//     period: string;
//     totalHours: number;
//     totalMinutes: number;
//   };
//   stats: AttendanceStat[];
//   dailyGraph: Array<{
//     day: string;
//     actualMinutes: number;
//     targetMinutes: number;
//     percent: number;
//     status: AttendanceStatus;
//   }>;
// }

export const useAttendanceSummary = () => {
  return useQuery<WeeklyAttendanceResponse>({
    queryKey: ["summaryAttendance"],
    queryFn: getWeeklyAttendanceAPI,
    staleTime: 1000 * 60 * 5, // 5분 동안은 신선한 데이터로 간주
  });
};
