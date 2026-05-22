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

// 👤 일반 유저 본인의 정정 신청 내역 조회 (STATISTICS 탭용)
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

// -------------------------------------------------------------
// 👑 [관리자/대표 전용 API 영역] - 백엔드 새로운 엔드포인트 주소와 매핑
// -------------------------------------------------------------

// 💡 1. 팀원들이 보낸 전체 정정 요청 목록 조회
export const getFixWorkLogListMgmtAPI = async (page: number = 1) => {
  const res = await axiosInstance.get("/attendance/work-log/mgmt/list", {
    params: {
      page: page,
      limit: 10,
    },
  });
  console.log("getFixWorkLogListMgmtAPI (관리자 전체 조회)", res.data);
  return res.data;
};

// 2. 정정 최종 승인 (PATCH /attendance/work-log/mgmt/:id/approve)
export const approveAttendanceAPI = async (id: string) => {
  const res = await axiosInstance.patch(
    `/attendance/work-log/mgmt/${id}/approve`,
  );
  return res.data;
};

// 3. 정정 신청 반려 (PATCH /attendance/work-log/mgmt/:id/reject)
export const rejectAttendanceAPI = async (
  id: string,
  data: { rejectReason: string },
) => {
  const res = await axiosInstance.patch(
    `/attendance/work-log/mgmt/${id}/reject`,
    data,
  );
  return res.data;
};
