import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { useAuthStore } from "@/store/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response, // 성공 시에는 그냥 넘김
  (error) => {
    // 에러 발생 시 Sentry로 전송
    Sentry.captureException(error, {
      extra: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data, // 서버에서 보내준 에러 메시지
      },
    });
    return Promise.reject(error); // UI에서 에러 처리를 할 수 있게 다시 던짐
  },
);
