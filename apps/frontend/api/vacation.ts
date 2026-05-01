import { axiosInstance } from "@/lib/axios";

export const getVacationAPI = async () => {
  const res = await axiosInstance.get("/vacation");
  console.log("apiData", res);
  return res.data;
};
