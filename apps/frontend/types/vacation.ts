// export interface VacationItem {
//   id: string;
//   type: "ANNUAL" | "HALF_AM" | "HALF_PM";
//   startDate: string;
//   endDate: string;
//   status: "PENDING" | "APPROVED" | "REJECTED";
//   reason: string;
//   createdAt: string;
//   timeRange: string;
// }

// export interface VacationResponse {
//   summary: {
//     total: number;
//     used: number;
//     remaining: number;
//   };
//   data: VacationItem[];
//   meta: {
//     totalCount: number;
//     page: number;
//     limit: number;
//     lastPage: number;
//   };
// }

export interface VacationItem {
  id: string;
  type: "ANNUAL" | "HALF_AM" | "HALF_PM";
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
  createdAt: string;
  timeRange: string;
}

export interface VacationResponse {
  summary: { total: number; used: number; remaining: number };
  data: VacationItem[];
  meta: { totalCount: number; page: number; limit: number; lastPage: number };
}

// 목록 표(Table)에서 사용하는 확장 타입
export interface VacationTableRow extends VacationItem {
  formattedPeriod: string;
  durationText: string;
  approver: string;
}
