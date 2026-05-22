import { axiosInstance } from "@/lib/axios";
import { Approver, CreateVacationPayload } from "@/types/user";

export const getApproversAPI = async (): Promise<Approver[]> => {
  const res = await axiosInstance.get("/users/approvers");
  return res.data;
};

export const createVacationAPI = async (payload: CreateVacationPayload) => {
  const res = await axiosInstance.post("/vacation", payload);
  return res.data;
};

export const getVacationAPI = async (page: number) => {
  const res = await axiosInstance.get(`/vacation?page=${page}`);
  return res.data;
};

export const getApprovalsAPI = async ({
  page,
  limit,
  status,
}: {
  page: number;
  limit: number;
  status?: string;
}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    ...(status ? { status } : {}),
  });
  const res = await axiosInstance.get(`/vacation/approvals?${params}`);
  return res.data;
};

export const approveVacationAPI = async (id: string) => {
  const res = await axiosInstance.patch(`/vacation/${id}/approve`);
  return res.data;
};

export const rejectVacationAPI = async (
  id: string,
  data: { rejectReason: string },
) => {
  const res = await axiosInstance.patch(`/vacation/${id}/reject`, data);
  return res.data;
};
