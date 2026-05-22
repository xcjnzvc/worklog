export type UserRole = "OWNER" | "ADMIN" | "USER";

export interface VacationItem {
  id: string;
  displayId: string;
  type: "ANNUAL" | "HALF_AM" | "HALF_PM";
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason: string;
  durationText: string;
  timeDetail: "오전" | "오후" | null;
  approver: string;
  createdAt: string;
  timeRange: string;
  // 유저 상세 정보 추가
  user: {
    name: string;
    role: UserRole;
    department: string;
    position: string;
    displayTitle: string;
  };
}

export interface VacationTableRow extends VacationData {
  formattedPeriod: string;
  approverPosition?: string;
}

export interface VacationResponse {
  summary: {
    total: number;
    used: number;
    remaining: number;
  };
  data: VacationItem[];
  meta: {
    totalCount: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

/** * 아래 VacationData가 기존에 "HALF"로 되어 있어서 에러가 난 것입니다.
 * 아래처럼 수정하거나, 아예 삭제하고 VacationItem을 사용하세요.
 */
export interface VacationData extends VacationItem {
  formattedPeriod?: string;
}

export type VacationTabType = "LIST" | "STATISTICS";

// interface VacationTabsProps {
//   activeTab: VacationTabType;
//   onTabChange: (tab: VacationTabType) => void;
//   searchKeyword: string;
//   onSearchChange: (value: string) => void;
// }

export interface ApprovalItem {
  id: string;
  displayId: string;
  type: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  durationText: string;
  applicant: { name: string; position: string };
  approver: string;
  createdAt: string;
}
