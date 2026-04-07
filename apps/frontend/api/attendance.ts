import { axiosInstance } from "@/lib/axios";
import { AttendanceAction, AttendanceData } from "@/types/attendance";

export const getTodayAttendanceAPI = async (): Promise<AttendanceData> => {
  const res = await axiosInstance.get("/attendance");
  return res.data;
};

export const recordAttendanceAPI = async (
  action: AttendanceAction,
): Promise<AttendanceData> => {
  const res = await axiosInstance.post("/attendance", { action });
  return res.data;
};
