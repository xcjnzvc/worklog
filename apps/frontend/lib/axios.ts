import axios from "axios";
import * as Sentry from "@sentry/nextjs";
import { useAuthStore } from "@/store/useAuthStore";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 20000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error, {
      extra: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      },
    });

    // 네트워크 에러 또는 타임아웃 = 서버 다운으로 간주
    const isNetworkOrTimeout = error.code === "ECONNABORTED" || !error.response;

    // /health 요청은 ServerWakeUpSlot이 직접 처리하니 제외 (무한루프 방지)
    const isHealthCheck = error.config?.url?.includes("/health");

    if (isNetworkOrTimeout && !isHealthCheck) {
      useAuthStore.getState().setServerDown(true);
    }

    return Promise.reject(error);
  },
);
