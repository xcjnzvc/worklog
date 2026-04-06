import { axiosInstance } from "@/lib/axios";
import {
  InvitedSignupForm,
  LoginForm,
  SignupForm,
  InviteForm,
} from "@/types/auth";

export const loginAPI = async (data: LoginForm) => {
  const res = await axiosInstance.post("/auth/login", data);
  console.log("로그인 백엔드 응답", res);
  return res.data;
};

export const signupAPI = async (data: SignupForm) => {
  const res = await axiosInstance.post("/auth/company", data);
  console.log("회원가입 백엔드 응답", res);
  return res.data;
};

export const inviteRegisterAPI = async (
  token: string,
  data: InvitedSignupForm,
) => {
  const res = await axiosInstance.post(`/invite/signup/${token}`, data);
  return res.data;
};

export const inviteAPI = async (data: InviteForm) => {
  const res = await axiosInstance.post("/invite", data);
  return res.data;
};

export const verifyInviteAPI = async (token: string) => {
  // GET /invite/verify/{token} 형태
  const res = await axiosInstance.get(`/invite/verify/${token}`);

  // axiosInstance가 response.data를 반환하도록 설정되어 있다면 res를,
  // 아니라면 res.data를 반환하세요.
  return res.data;
};
