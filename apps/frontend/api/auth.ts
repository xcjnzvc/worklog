import { axiosInstance } from "@/lib/axios";
import { LoginForm, SignupForm } from "@/types/auth";

export const loginAPI = async (data: LoginForm) => {
  const res = await axiosInstance.post("/auth/login", data);
  return res.data;
};

export const signupAPI = async (data: SignupForm) => {
  const res = await axiosInstance.post("/auth/company", data);
  return res.data;
};
