import { axiosInstance } from "@/lib/axios";
import { Approver, CreateVacationPayload } from "@/types/user";

//  결재권자 목록 가져오기 API
export const getApproversAPI = async (): Promise<Approver[]> => {
  const res = await axiosInstance.get("/users/approvers");
  return res.data;
};

//  휴가 신청하기 API
export const createVacationAPI = async (payload: CreateVacationPayload) => {
  const res = await axiosInstance.post("/vacation", payload);
  return res.data;
};

export const getVacationAPI = async (page: number) => {
  const res = await axiosInstance.get(`/vacation?page=${page}`);
  return res.data;
};
