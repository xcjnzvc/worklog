import { axiosInstance } from "@/lib/axios";
import { AttendanceData } from "@/types/attendance";

export const getTodayAttendanceAPI = async (): Promise<AttendanceData> => {
  const res = await axiosInstance.get("/attendance/live");
  return res.data;
};

export const recordAttendanceAPI = async (
  action: "CLOCK_IN" | "CLOCK_OUT",
): Promise<AttendanceData> => {
  const endpoint =
    action === "CLOCK_IN" ? "/attendance/clock-in" : "/attendance/clock-out";

  const res = await axiosInstance.post(endpoint); // 이제 body에 { action }을 담을 필요도 없겠네요!
  return res.data;
};
