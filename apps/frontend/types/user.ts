export type UserRole = "ADMIN" | "OWNER" | "USER" | "SUPER_ADMIN";

export interface Approver {
  id: string;
  name: string;
  role: UserRole;
}

export interface CreateVacationPayload {
  type: "ANNUAL" | "HALF" | "OTHER";
  startDate: string;
  endDate: string;
  reason: string;
  approverId: string;
  timeDetail?: "AM" | "PM" | null;
}
