export type StatusType = "BEFORE" | "WORKING" | "AFTER";
export type AttendanceAction = "CLOCK_IN" | "CLOCK_OUT";

export interface AttendanceData {
  status: StatusType;
  startTime: string | null;
  endTime: string | null;
}
