import { serverFetch } from "@/lib/serverFetch";
import { AttendanceData } from "@/types/attendance";

export const getTodayAttendanceServer = () =>
  serverFetch<AttendanceData>("/attendance/live");
