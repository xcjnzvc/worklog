// export type StatusType = "NOT_STARTED" | "WORKING" | "FINISHED";

// // 1. 먼저 정책(Policy) 인터페이스를 정의합니다.
// export interface WorkPolicy {
//   workType: "FIXED" | "FLEXIBLE";
//   workStartTime: string;
//   workEndTime?: string;
//   coreTimeStart: string | null;
//   coreTimeEnd: string | null;
//   lunchMinutes: number;
//   lunchStartTime: string;
//   lunchEndTime: string;
// }

// // 2. 전체 데이터 구조에서 위에서 만든 WorkPolicy를 사용합니다.
// export interface AttendanceData {
//   status: StatusType;
//   isClockedIn: boolean;
//   workMinutes: number;
//   clockIn: string | null;
//   clockOut: string | null;
//   serverTime: string; // ✅ 이 줄을 꼭 추가해 주세요!
//   policy: WorkPolicy;
// }

// export type StatusType =
//   | "NOT_STARTED"
//   | "WORKING"
//   | "NORMAL"
//   | "LATE"
//   | "EARLY_LEAVE"
//   | "LATE_EARLY"
//   | "INSUFFICIENT"
//   | "MISSING_OUT";

// export interface AttendanceData {
//   status: StatusType; // 여기를 string이 아니라 StatusType으로 지정
//   workMinutes: number;
//   clockIn?: string;
//   clockOut?: string;
//   serverTime: string;
//   policy?: {
//     workType: string;
//     workStartTime: string;
//     workEndTime: string;
//   };
// }

// types/attendance.ts

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
  workEndTime: string; // 추가
  workMinutes: number; // 추가
  lunchMinutes: number;
}

export interface AttendanceData {
  status: AttendanceStatus;
  workMinutes: number | null;
  clockIn: string | null; // undefined → null
  clockOut: string | null; // undefined → null
  serverTime?: string;
  policy: WorkPolicy | null;
}
