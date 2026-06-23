import { axiosInstance } from "@/lib/axios";

export const completePaymentAPI = async (data: {
  paymentId: string;
  planName: string;
  seatCount: number;
}) => {
  console.log("API로 전송되는 데이터:", data);

  const res = await axiosInstance.post("/payment/complete", data);
  return res.data;
};

export const cancelPaymentAPI = async () => {
  const res = await axiosInstance.post("/payment/cancel");
  return res.data;
};

export const getCurrentPaymentAPI = async () => {
  const res = await axiosInstance.get("/payment/current");
  return res.data;
};
