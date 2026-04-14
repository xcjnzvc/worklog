"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Briefcase, Calendar } from "lucide-react";
import Button from "@/components/Button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodayAttendanceAPI, recordAttendanceAPI } from "@/api/attendance";
import { AttendanceData, AttendanceStatus } from "@/types/attendance";

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

  // 타이머 로직: 10초마다 업데이트하여 성능 최적화 (분 단위 표시이므로 충분함)
  useEffect(() => {
    if (status !== "WORKING" || !clockIn) return;

    const baseWorkSeconds = workMinutes * 60;
    const syncTime = Date.now();

    const updateTimer = () => {
      const passed = Math.floor((Date.now() - syncTime) / 1000);
      setElapsedSeconds(baseWorkSeconds + passed);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 10000);

    return () => {
      clearInterval(timer);
      setElapsedSeconds(0);
    };
  }, [status, workMinutes, clockIn]);

  // 메인 타이머 시간 계산 (HH:mm)
  const displayTime = useMemo(() => {
    const totalSec = status === "WORKING" ? elapsedSeconds : workMinutes * 60;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }, [status, elapsedSeconds, workMinutes]);

  const checkInBadge = useMemo(() => {
    if (!attendance?.clockIn) return null;
    const isLate = status === "LATE" || status === "LATE_EARLY";
    return isLate
      ? { label: "지각", color: "text-red-500" }
      : { label: "정상 출근", color: "text-[#2357E5]" };
  }, [attendance?.clockIn, status]);

  const checkOutBadge = useMemo(() => {
    if (!attendance?.clockOut) return null;
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
  }, [attendance?.clockOut, status]);

  const mutation = useMutation({
    mutationFn: recordAttendanceAPI,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["todayAttendance"] }),
    onError: (error) => {
      // 이제 타입을 안 적어도 'error.response.data.message'가 자동 완성됩니다!
      const serverMessage = error.response?.data?.message;
      alert(serverMessage ?? "에러가 발생했습니다.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-[30px] bg-white rounded-[32px] w-[380px] h-[524px] animate-pulse mx-auto" />
    );
  }

  return (
    <div className="p-[30px] bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[380px] h-fit font-sans mx-auto flex flex-col">
      <div className="flex items-center gap-[8px] mb-[10px]">
        <span
          className={`w-[10px] h-[10px] rounded-full ${config.dot} ${config.pulse}`}
        />
        <span className={`text-[14px] font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>

      <div className="mb-[24px]">
        <div className="text-[48px] font-black tracking-tighter text-gray-950 leading-none mb-3">
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

      <div className="relative flex items-center p-[12px] rounded-[24px] bg-[#F5F8FF] border border-[#DDE7FF] mb-[32px]">
        <div className="w-[44px] h-[44px] rounded-[14px] bg-white flex items-center justify-center shadow-sm mr-[14px] border border-gray-100">
          <Briefcase size={20} className="text-[#2357E5]" />
        </div>
        <div className="flex flex-col flex-1">
          <span className="text-[11px] font-black text-[#2357E5] uppercase">
            {attendance?.policy?.workType ?? "-"}
          </span>
          <span className="text-[18px] font-black text-gray-950">
            {attendance?.policy?.workStartTime ?? "--:--"} -{" "}
            {attendance?.policy?.workEndTime ?? "--:--"}
          </span>
        </div>
      </div>

      <div className="relative space-y-[24px] mb-[32px] pl-[26px]">
        <div className="absolute left-[9px] top-[10px] bottom-[10px] w-[2px] bg-gray-50" />

        {/* 출근 타임라인 */}
        <div className="relative flex items-center justify-between">
          <div
            className={`absolute left-[-26px] w-[20px] h-[20px] rounded-full bg-white border-[5px] ${attendance?.clockIn ? "border-[#2357E5]" : "border-gray-100"} z-10`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#CCC] uppercase">
              Check-In
            </span>
            <span
              className={`text-[19px] font-black ${attendance?.clockIn ? "text-gray-900" : "text-gray-300"}`}
            >
              {attendance?.clockIn
                ? attendance.clockIn.split("-")[3].slice(0, 5)
                : "-- : --"}
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

        {/* 퇴근 타임라인 */}
        <div
          className={`relative flex items-center justify-between ${!attendance?.clockOut ? "opacity-40" : ""}`}
        >
          <div
            className={`absolute left-[-26px] w-[20px] h-[20px] rounded-full bg-white border-[5px] ${attendance?.clockOut ? "border-red-500" : "border-gray-100"} z-10`}
          />
          <div className="flex flex-col">
            <span className="text-[11px] font-extrabold text-[#CCC] uppercase">
              Check-Out
            </span>
            <span className="text-[19px] font-black">
              {attendance?.clockOut
                ? attendance.clockOut.split("-")[3].slice(0, 5)
                : "-- : --"}
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

      <Button
        text={
          status === "NOT_STARTED"
            ? "출근하기"
            : status === "WORKING"
              ? "퇴근하기"
              : "업무 종료"
        }
        disabled={
          !(status === "NOT_STARTED" || status === "WORKING") ||
          mutation.isPending
        }
        onClick={() =>
          mutation.mutate(status === "NOT_STARTED" ? "CLOCK_IN" : "CLOCK_OUT")
        }
      />
    </div>
  );
}
