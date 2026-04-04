import { axiosInstance } from "@/lib/axios";
import { InvitedSignupForm, LoginForm, SignupForm } from "@/types/auth";

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
