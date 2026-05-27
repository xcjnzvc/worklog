// 상태 관련 타입 (근태 상태 + 결재 상태)
export type AttendanceStatus =
  | "NOT_STARTED"
  | "WORKING"
  | "NORMAL"
  | "LATE"
  | "EARLY_LEAVE"
  | "LATE_EARLY"
  | "INSUFFICIENT"
  | "MISSING_OUT"
  | "ABSENT";

// 정정 신청 전용 결재 상태
export type CorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

// 테이블에서 사용할 통합 상태 타입
export type CombinedStatus = AttendanceStatus | CorrectionStatus;

//  근태 기록 (WorkLog) 관련 인터페이스
export interface AttendanceWorkLog {
  id: string;
  date: string; // 근무 날짜
  clockIn: string | null;
  clockOut: string | null;
  workMinutes: number | null;
  status: CombinedStatus;
  isOvertime: boolean;
  createdAt: string; // 생성일 (정정 신청일로 활용 가능)
  isFix: boolean; // 정정 여부
  fixReason?: string; // 정정 사유
  fixClockIn?: string; // 정정 요청 출근 시간
  fixClockOut?: string; // 정정 요청 퇴근 시간
  approverName?: string; // 승인자 이름
  apprStatus: "PENDING" | "APPROVED" | "REJECTED" | null;
  approverPosition?: string | null;
}

//  API 응답 형식 (목록 조회용)
export interface AttendanceResponse {
  result: AttendanceWorkLog[];
  metadata: {
    totalCount: number; // totalItemCount → totalCount
    totalPages: number; // totalPage → totalPages
    currentPage: number;
    limit: number;
  };
}

// 주간 통계 및 대시보드 관련 타입
export interface AttendanceStat {
  label: string;
  value: string | number;
  unit: string;
}

export interface WeeklyAttendanceResponse {
  weeklySummary: {
    period: string;
    totalHours: number;
    totalMinutes: number;
  };
  stats: AttendanceStat[];
  dailyGraph: Array<{
    day: string;
    actualMinutes: number;
    targetMinutes: number;
    percent: number;
    status: AttendanceStatus;
  }>;
}

//  근무 정책 및 실시간 데이터 타입
export interface WorkPolicy {
  workType: string;
  workStartTime: string;
  workEndTime: string;
  workMinutes: number;
  lunchMinutes: number;
}

export interface AttendanceData {
  status: AttendanceStatus;
  isClockedIn: boolean;
  isClockedOut: boolean;
  workMinutes: number;
  clockIn: string | null;
  clockOut: string | null;
  serverTime?: string;
  policy: WorkPolicy | null;
}

export type AttendanceTabType = "LIST" | "STATISTICS";

export interface CreateFixRequestPayload {
  reason: string;
  fixClockIn: string; // ISO 8601 형식 (e.g., "2026-05-11T07:56:12Z")
  fixClockOut: string;
  approverId: string; // 결재권자 ID도 포함되어야 하므로 추가
}

export interface WorkLogDashboardResponseDto {
  /** 정정 요청 중 건수 (주황색 카드) */
  pendingCount: number;

  /** 정정 완료 건수 (초록색 카드) */
  approvedCount: number;

  /** 이번 달 총 근무 시간 (보라색 카드 - 시간 단위) */
  totalWorkHours: number;

  /** (선택 사항) 상세 계산을 위한 전체 분 데이터 */
  totalWorkMinutes: number;
}
