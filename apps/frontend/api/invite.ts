import { axiosInstance } from "@/lib/axios";
import { InviteForm, InvitedSignupForm } from "@/types/auth";

// 초대 관련 API만 모아둡니다.
export const inviteAPI = async (data: InviteForm) => {
  const res = await axiosInstance.post("/invite", data);
  return res.data;
};

export const verifyInviteAPI = async (token: string) => {
  const res = await axiosInstance.get(`/invite/verify/${token}`);
  return res.data;
};

export const inviteRegisterAPI = async (
  token: string,
  data: InvitedSignupForm,
) => {
  const res = await axiosInstance.post(`/invite/signup/${token}`, data);
  return res.data;
};

// 💡 새로 추가할 리스트 조회 및 재발송 API
export const getInviteHistoryAPI = async () => {
  const res = await axiosInstance.get("/invite");
  return res.data;
};

export const resendInviteAPI = async (email: string) => {
  const res = await axiosInstance.post("/invite/resend", { email });
  return res.data;
};
