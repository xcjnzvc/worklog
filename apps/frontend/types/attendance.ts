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

// ✅ 정정 신청 전용 결재 상태 추가
export type CorrectionStatus = "PENDING" | "APPROVED" | "REJECTED";

// ✅ 테이블에서 사용할 통합 상태 타입
export type CombinedStatus = AttendanceStatus | CorrectionStatus;

export interface AttendanceRow {
  id: string;
  date?: string;
  checkIn?: string;
  checkOut?: string;
  duration?: string;
  requestDate?: string;
  targetDate?: string;
  oldTime?: string;
  newTime?: string;
  reason?: string;
  approver?: string;
  // ✅ status 타입을 CombinedStatus로 변경하여 두 종류의 상태를 모두 허용
  status: CombinedStatus;
}

export interface WorkPolicy {
  workType: string;
  workStartTime: string;
  workEndTime: string;
  workMinutes: number;
  lunchMinutes: number;
}

export interface AttendanceData {
  status: AttendanceStatus;
  isClockedIn: boolean; // ✅ 추가
  isClockedOut: boolean; // ✅ 추가
  workMinutes: number;
  clockIn: string | null;
  clockOut: string | null;
  serverTime?: string;
  policy: WorkPolicy | null;
}

export type AttendanceTabType = "LIST" | "STATISTICS";
