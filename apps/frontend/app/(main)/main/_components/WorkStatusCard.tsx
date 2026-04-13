"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Briefcase, Calendar } from "lucide-react";
import Button from "@/components/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodayAttendanceAPI, recordAttendanceAPI } from "@/api/attendance";
// WorkStatusCard.tsx 상단
import {
  AttendanceData,
  AttendanceStatus,
  WorkPolicy,
} from "@/types/attendance";

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

  const { data: attendance, isLoading } = useQuery<AttendanceData>({
    queryKey: ["todayAttendance"],
    queryFn: getTodayAttendanceAPI,
    refetchInterval: 60_000,
  });

  const status: AttendanceStatus = attendance?.status ?? "NOT_STARTED";
  const config = STATUS_STYLE[status] ?? STATUS_STYLE.NORMAL;

  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const workMinutes = attendance?.workMinutes ?? 0;
  const clockIn = attendance?.clockIn ?? null;

  useEffect(() => {
    if (status !== "WORKING" || !clockIn) return;

    const baseWorkSeconds = workMinutes * 60;
    const syncTime = Date.now();

    const updateTimer = () => {
      const passed = Math.floor((Date.now() - syncTime) / 1000);
      setElapsedSeconds(baseWorkSeconds + passed);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(timer);
      setElapsedSeconds(0);
    };
  }, [status, workMinutes, clockIn]);

  // ─────────────────────────────────────────────────────
  // 표시 시간 계산
  // ─────────────────────────────────────────────────────
  const displaySeconds = useMemo(() => {
    if (status === "WORKING") return elapsedSeconds;
    return workMinutes * 60;
  }, [status, elapsedSeconds, workMinutes]);

  const displayTime = useMemo(() => {
    const h = Math.floor(displaySeconds / 3600);
    const m = Math.floor((displaySeconds % 3600) / 60);
    const s = displaySeconds % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }, [displaySeconds]);

  // ─────────────────────────────────────────────────────
  // 출근 배지 (지각 여부)
  // ─────────────────────────────────────────────────────
  const checkInBadge = useMemo(() => {
    if (!attendance?.clockIn) return null;
    const isLate = status === "LATE" || status === "LATE_EARLY";
    return isLate
      ? { label: "지각", color: "text-red-500" }
      : { label: "정상 출근", color: "text-[#2357E5]" };
  }, [attendance?.clockIn, status]);

  // ─────────────────────────────────────────────────────
  // 퇴근 배지 (시간 미달 / 정상 여부)
  // ─────────────────────────────────────────────────────
  const checkOutBadge = useMemo(() => {
    if (!attendance?.clockOut) return null;

    const isInsufficient = (
      ["EARLY_LEAVE", "LATE_EARLY", "INSUFFICIENT"] as AttendanceStatus[]
    ).includes(status);

    if (isInsufficient) return { label: "시간 미달", color: "text-red-500" };
    if (status === "MISSING_OUT")
      return { label: "퇴근 누락", color: "text-gray-500" };
    if (status === "ABSENT") return { label: "결근", color: "text-red-700" };
    return { label: "정상 퇴근", color: "text-green-500" };
  }, [attendance?.clockOut, status]);

  // ─────────────────────────────────────────────────────
  // 출퇴근 액션 뮤테이션
  // ─────────────────────────────────────────────────────
  const mutation = useMutation({
    mutationFn: (action: "CLOCK_IN" | "CLOCK_OUT") =>
      recordAttendanceAPI(action),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todayAttendance"] }),
    onError: (error: unknown) => {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      alert(axiosError.response?.data?.message ?? "에러가 발생했습니다.");
    },
  });

  const isActionable = status === "NOT_STARTED" || status === "WORKING";

  const buttonText =
    status === "NOT_STARTED"
      ? "출근하기"
      : status === "WORKING"
        ? "퇴근하기"
        : "업무 종료";

  // ─────────────────────────────────────────────────────
  // 로딩 스켈레톤
  // ─────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-[30px] bg-white rounded-[32px] w-[380px] h-[524px] animate-pulse mx-auto" />
    );
  }

  // ─────────────────────────────────────────────────────
  // 렌더링
  // ─────────────────────────────────────────────────────
  return (
    <div className="p-[30px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[380px] h-fit font-sans mx-auto flex flex-col">
      {/* 상태 헤더 */}
      <div className="flex items-center gap-[8px] mb-[10px]">
        <span
          className={`w-[10px] h-[10px] rounded-full ${config.dot} ${config.pulse}`}
        />
        <span className={`text-[14px] font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* 메인 타이머 */}
      <div className="mb-[24px]">
        <div className="text-[36px] font-black tracking-tighter text-gray-950 leading-none mb-3">
          {displayTime}
        </div>
        <div className="flex items-center text-[#999] text-[14px] gap-[6px] font-medium">
          <Calendar size={14} strokeWidth={2.5} />
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>
      </div>

      {/* 근무 정책 */}
      <div className="relative flex items-center p-[12px] rounded-[24px] bg-[#F5F8FF] border border-[#DDE7FF] mb-[32px]">
        <div className="w-[44px] h-[44px] rounded-[14px] bg-white flex items-center justify-center shadow-sm mr-[14px] border border-gray-100">
          <Briefcase size={20} className="text-[#2357E5]" />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-[11px] font-black text-[#2357E5] uppercase">
            {attendance?.policy?.workType ?? "-"}
          </span>
          {/* [수정] workEndTime 하드코딩 제거 - 서버값 그대로 사용 */}
          <span className="text-[18px] font-black text-gray-950">
            {attendance?.policy?.workStartTime ?? "--:--"}
            {" - "}
            {attendance?.policy?.workEndTime ?? "--:--"}
          </span>
        </div>
      </div>

      {/* 타임라인 */}
      <div className="relative space-y-[24px] mb-[32px] pl-[26px]">
        <div className="absolute left-[9px] top-[10px] bottom-[10px] w-[2px] bg-gray-50" />

        {/* 출근 */}
        <div className="relative flex items-center justify-between">
          <div
            className={`absolute left-[-26px] w-[20px] h-[20px] rounded-full bg-white border-[5px] ${
              attendance?.clockIn ? "border-[#2357E5]" : "border-gray-100"
            } z-10`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#CCC] uppercase">
              Check-In
            </span>
            <span
              className={`text-[19px] font-black ${
                attendance?.clockIn ? "text-gray-900" : "text-gray-300"
              }`}
            >
              {attendance?.clockIn
                ? attendance.clockIn.split("-")[3]
                : "-- : -- : --"}
            </span>
          </div>
          {checkInBadge && (
            <span
              className={`text-[12px] font-bold ${checkInBadge.color} bg-white px-2 py-1 rounded-full shadow-sm border border-gray-50`}
            >
              {checkInBadge.label}
            </span>
          )}
        </div>

        {/* 퇴근 */}
        <div
          className={`relative flex items-center justify-between ${
            !attendance?.clockOut ? "opacity-40" : ""
          }`}
        >
          <div
            className={`absolute left-[-26px] w-[20px] h-[20px] rounded-full bg-white border-[5px] ${
              attendance?.clockOut ? "border-red-500" : "border-gray-100"
            } z-10`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#CCC] uppercase">
              Check-Out
            </span>
            <span className="text-[19px] font-black">
              {attendance?.clockOut
                ? attendance.clockOut.split("-")[3]
                : "-- : -- : --"}
            </span>
          </div>
          {checkOutBadge && (
            <span
              className={`text-[12px] font-bold ${checkOutBadge.color} bg-white px-2 py-1 rounded-full shadow-sm border border-gray-50`}
            >
              {checkOutBadge.label}
            </span>
          )}
        </div>
      </div>

      {/* 액션 버튼 */}
      <Button
        text={buttonText}
        disabled={!isActionable || mutation.isPending}
        onClick={() =>
          mutation.mutate(status === "NOT_STARTED" ? "CLOCK_IN" : "CLOCK_OUT")
        }
      />
    </div>
  );
}
