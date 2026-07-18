import { axiosInstance } from "@/lib/axios";
import { Member } from "@/types/member";

export const getMemberListAPI = async (page: number) => {
  const { data } = await axiosInstance.get(`/users/members?page=${page}`);
  return data;
};

export const deleteMemberAPI = async (id: string) => {
  const { data } = await axiosInstance.delete(`/users/members/${id}`);
  return data;
};
