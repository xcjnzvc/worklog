import "@tanstack/react-query";
import { AxiosError } from "axios"; // axios가 설치되어 있어야 합니다.

declare global {
  interface ApiErrorResponse {
    message?: string;
    code?: string;
  }
}

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: AxiosError<ApiErrorResponse>;
  }
}
