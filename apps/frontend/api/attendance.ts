import { axiosInstance } from "@/lib/axios";
import { AttendanceData, CreateFixRequestPayload } from "@/types/attendance";

export const getTodayAttendanceAPI = async (): Promise<AttendanceData> => {
  const res = await axiosInstance.get("/attendance/live");
  return res.data;
};

export const recordAttendanceAPI = async (
  action: "CLOCK_IN" | "CLOCK_OUT",
): Promise<AttendanceData> => {
  const endpoint =
    action === "CLOCK_IN" ? "/attendance/clock-in" : "/attendance/clock-out";

  const res = await axiosInstance.post(endpoint);
  return res.data;
};

export const getWeeklyAttendanceAPI = async () => {
  const res = await axiosInstance.get("/attendance/weekly");
  return res.data;
};

export const getWorkLogListAPI = async (page: number = 1) => {
  const res = await axiosInstance.get("/attendance/work-log", {
    params: {
      page: page,
      limit: 10,
    },
  });
  console.log(`workLogListAPI (page: ${page})`, res.data);
  return res.data;
};

export const getFixWorkLogAPI = async (page: number = 1) => {
  const res = await axiosInstance.get("/attendance/work-log/fix/own", {
    params: {
      page: page,
      limit: 10,
    },
  });
  console.log("getFixWorkLogAPI", res.data);
  return res.data;
};

export const postFixWorkLogAPI = async (
  id: string,
  data: CreateFixRequestPayload,
) => {
  const res = await axiosInstance.post(`/attendance/work-log/fix/${id}`, data);
  return res.data;
};

export const getWorkLogDashboardAPI = async () => {
  const res = await axiosInstance.get("/attendance/work-log/own/dashboard");
  return res.data;
};
