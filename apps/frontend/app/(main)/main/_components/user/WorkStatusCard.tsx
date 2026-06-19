"use client";

import { useMemo } from "react";
import { Briefcase, Calendar } from "lucide-react";
import { AxiosError } from "axios";
import Button from "@/components/Button";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodayAttendanceAPI, recordAttendanceAPI } from "@/api/attendance";
import { AttendanceData, AttendanceStatus } from "@/types/attendance";

interface ApiErrorResponse {
  message?: string;
  code?: string;
}

const STATUS_STYLE: Record<
  AttendanceStatus,
  { label: string; color: string; dot: string; pulse: string }
> = {
  NOT_STARTED: {
    label: "출근 전",
    color: "text-gray-400",
    dot: "bg-gray-300",
    pulse: "",
  },
  WORKING: {
    label: "근무 중",
    color: "text-[#2357E5]",
    dot: "bg-[#2357E5]",
    pulse: "animate-pulse",
  },
  NORMAL: {
    label: "정상 근무",
    color: "text-green-500",
    dot: "bg-green-500",
    pulse: "",
  },
  LATE: {
    label: "지각 출근",
    color: "text-orange-500",
    dot: "bg-orange-500",
    pulse: "",
  },
  EARLY_LEAVE: {
    label: "조기 퇴근",
    color: "text-red-400",
    dot: "bg-red-400",
    pulse: "",
  },
  LATE_EARLY: {
    label: "지각 & 조퇴",
    color: "text-red-600",
    dot: "bg-red-600",
    pulse: "",
  },
  INSUFFICIENT: {
    label: "시간 미달",
    color: "text-purple-500",
    dot: "bg-purple-500",
    pulse: "",
  },
  MISSING_OUT: {
    label: "퇴근 누락",
    color: "text-gray-600",
    dot: "bg-gray-600",
    pulse: "",
  },
  ABSENT: {
    label: "결근",
    color: "text-red-700",
    dot: "bg-red-700",
    pulse: "",
  },
};

export default function WorkStatusCard() {
  const queryClient = useQueryClient();

  const {
    data: attendance,
    isLoading,
    isError,
  } = useQuery<AttendanceData>({
    queryKey: ["todayAttendance"],
    queryFn: getTodayAttendanceAPI,
    refetchInterval: 60_000,
  });

  const displayStatus = useMemo(() => {
    if (!attendance) return "NOT_STARTED";
    if (attendance.isClockedIn) return "WORKING";
    return attendance.status;
  }, [attendance?.isClockedIn, attendance?.status]);

  const config =
    STATUS_STYLE[displayStatus as AttendanceStatus] ?? STATUS_STYLE.NORMAL;

  const displayTime = useMemo(() => {
    const totalMin = attendance?.workMinutes ?? 0;
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }, [attendance?.workMinutes]);

  const checkInBadge = useMemo(() => {
    const clockIn = attendance?.clockIn;
    const status = attendance?.status;
    if (!clockIn) return null;
    const isLate = status === "LATE" || status === "LATE_EARLY";
    return isLate
      ? { label: "지각", color: "text-red-500" }
      : { label: "정상 출근", color: "text-[#2357E5]" };
  }, [attendance?.clockIn, attendance?.status]);

  const checkOutBadge = useMemo(() => {
    const clockOut = attendance?.clockOut;
    const status = attendance?.status;
    if (!clockOut || !status) return null;
    const isInsufficient = [
      "EARLY_LEAVE",
      "LATE_EARLY",
      "INSUFFICIENT",
    ].includes(status);
    if (isInsufficient) return { label: "시간 미달", color: "text-red-500" };
    if (status === "MISSING_OUT")
      return { label: "퇴근 누락", color: "text-gray-500" };
    if (status === "ABSENT") return { label: "결근", color: "text-red-700" };
    return { label: "정상 퇴근", color: "text-green-500" };
  }, [attendance?.clockOut, attendance?.status]);

  const mutation = useMutation({
    mutationFn: recordAttendanceAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todayAttendance"] }),
    onError: (error: AxiosError<ApiErrorResponse>) => {
      alert(error.response?.data?.message ?? "에러가 발생했습니다.");
    },
  });

  // if (isLoading)
  //   return <CardSkeleton className="w-full h-full min-h-[500px]" />;

  if (isLoading)
    return (
      <article className="p-[30px] bg-white rounded-[32px] shadow-sm border border-gray-100 w-full flex-1 flex flex-col min-h-[500px]">
        <div className="text-[44px] md:text-[48px] font-black text-gray-950 leading-none">
          --:--
        </div>
      </article>
    );

  if (isError || !attendance) {
    return (
      <article className="p-8 bg-white rounded-[32px] border border-red-50 w-full flex-1 flex flex-col items-center justify-center text-center">
        <p className="text-red-400 font-bold mb-4">
          근태 정보를 불러올 수 없습니다.
        </p>
        <Button
          text="다시 시도"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["todayAttendance"] })
          }
        />
      </article>
    );
  }

  return (
    <article className="p-[30px] bg-white rounded-[32px] shadow-sm border border-gray-100 w-full flex-1 flex flex-col transition-all hover:shadow-md">
      {/* 1. 상태 칩 */}
      <div className="flex items-center gap-[8px] mb-[12px]">
        <span
          className={`w-[10px] h-[10px] rounded-full ${config.dot} ${config.pulse}`}
        />
        <span className={`text-[14px] font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* 2. 메인 시간 표시 */}
      <div className="mb-[24px]">
        <div className="text-[44px] md:text-[48px] font-black  text-gray-950 leading-none">
          {displayTime}
        </div>
        <div className="flex items-center text-gray-400 text-[14px] gap-[6px] mt-1 font-medium">
          <Calendar size={14} strokeWidth={2.5} />
          {new Date().toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>
      </div>

      {/* 3. 근무 정책 (카드 형태) */}
      <div className="relative flex items-center p-[16px] rounded-[24px] bg-[#F5F8FF] border border-[#DDE7FF] mb-[32px]">
        <div className="w-[44px] h-[44px] rounded-[14px] bg-white flex items-center justify-center shadow-sm mr-[14px] border border-gray-100 flex-shrink-0">
          <Briefcase size={20} className="text-[#2357E5]" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-black text-[#2357E5] uppercase truncate">
            {attendance.policy?.workType ?? "-"}
          </span>
          <span className="text-[17px] md:text-[18px] font-black text-gray-950 truncate">
            {attendance.policy?.workStartTime ?? "--:--"} -{" "}
            {attendance.policy?.workEndTime ?? "--:--"}
          </span>
        </div>
      </div>

      {/* 4. 출퇴근 타임라인 (내용에 따라 늘어남) */}
      <div className="relative space-y-[28px] mb-[32px] pl-[26px] flex-1">
        <div className="absolute left-[9px] top-[10px] bottom-[10px] w-[2px] bg-gray-50" />

        {/* 출근 정보 */}
        <div className="relative flex items-center justify-between">
          <div
            className={`absolute left-[-26px] w-[20px] h-[20px] rounded-full bg-white border-[5px] ${attendance.clockIn ? "border-[#2357E5]" : "border-gray-100"} z-10`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-gray-300 uppercase">
              Check-In
            </span>
            <span
              className={`text-[19px] font-black ${attendance.clockIn ? "text-gray-900" : "text-gray-200"}`}
            >
              {attendance.clockIn
                ? attendance.clockIn.split("-")[3].slice(0, 5)
                : "-- : --"}
            </span>
          </div>
          {checkInBadge && (
            <span
              className={`text-[12px] font-bold ${checkInBadge.color} bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-50`}
            >
              {checkInBadge.label}
            </span>
          )}
        </div>

        {/* 퇴근 정보 */}
        <div
          className={`relative flex items-center justify-between ${!attendance.clockOut ? "opacity-40" : ""}`}
        >
          <div
            className={`absolute left-[-26px] w-[20px] h-[20px] rounded-full bg-white border-[5px] ${attendance.clockOut ? "border-red-500" : "border-gray-100"} z-10`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-gray-300 uppercase">
              Check-Out
            </span>
            <span className="text-[19px] font-black text-gray-900">
              {attendance.clockOut
                ? attendance.clockOut.split("-")[3].slice(0, 5)
                : "-- : --"}
            </span>
          </div>
          {checkOutBadge && (
            <span
              className={`text-[12px] font-bold ${checkOutBadge.color} bg-white px-2.5 py-1 rounded-full shadow-sm border border-gray-50`}
            >
              {checkOutBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* 5. 버튼 영역 (하단 고정) */}
      <div className="mt-auto">
        <Button
          text={
            !attendance.clockIn
              ? "출근하기"
              : attendance.isClockedIn
                ? "퇴근하기"
                : "업무 종료"
          }
          disabled={
            (!attendance.isClockedIn && !!attendance.clockIn) ||
            mutation.isPending
          }
          onClick={() =>
            mutation.mutate(!attendance.clockIn ? "CLOCK_IN" : "CLOCK_OUT")
          }
        />
      </div>
    </article>
  );
}
