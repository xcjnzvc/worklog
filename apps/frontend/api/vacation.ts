import { axiosInstance } from "@/lib/axios";
import { Approver, CreateVacationPayload } from "@/types/user";

// 1. 결재권자 목록 가져오기 API
export const getApproversAPI = async (): Promise<Approver[]> => {
  const res = await axiosInstance.get("/users/approvers");
  return res.data;
};

// 2. 휴가 신청하기 API
export const createVacationAPI = async (payload: CreateVacationPayload) => {
  const res = await axiosInstance.post("/vacation", payload);
  return res.data;
};

// 3. 휴가 내역 가져오기 API (기존)
export const getVacationAPI = async () => {
  const res = await axiosInstance.get("/vacation");
  console.log("apiData", res);
  return res.data;
};
