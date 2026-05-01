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
