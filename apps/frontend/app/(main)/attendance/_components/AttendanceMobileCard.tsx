"use client";

import React from "react";
import { Clock, CheckCircle2, AlertCircle, Edit3 } from "lucide-react";
import { AttendanceWorkLog, CombinedStatus } from "@/types/attendance";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { twMerge } from "tailwind-merge";

interface AttendanceMobileCardProps {
  item: AttendanceWorkLog;
  getStatusStyle: (status: CombinedStatus) => string;
  attendanceTypeMap: Record<string, string>;
  formatDate: (dateStr: string) => string;
  formatTime: (dateStr: string | null, status: CombinedStatus) => string;
  navigatingId: string | null;
  onNavigate: (id: string) => void;
}

export const AttendanceMobileCard = ({
  item,
  getStatusStyle,
  attendanceTypeMap,
  formatDate,
  formatTime,
  navigatingId, // ← 추가
  onNavigate, // ← 추가
}: AttendanceMobileCardProps) => {
  const router = useRouter();

  const isDisabled =
    item.isFix || item.apprStatus === "PENDING" || item.status === "NORMAL";
  const isNavigating = navigatingId === item.id; // ← 추가

  // 시안 레이아웃 기준 요일 포맷 헬퍼 (예: 2026.05.14 (목))
  const getDayOfWeek = (dateStr: string) => {
    if (!dateStr) return "";
    const week = ["일", "월", "화", "수", "목", "금", "토"];
    const d = new Date(dateStr);
    return `(${week[d.getUTCDay()]})`;
  };

  return (
    <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-gray-50 flex flex-col gap-5">
      {/* 1. 상단 정보 영역 (ID/NO, 근무 시간, 상태 뱃지) */}
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-bold text-[#A3AED0] tracking-wider uppercase">
          NO. {item.id.toString().slice(-6)}{" "}
          {/* ID가 길 경우를 대비해 슬라이스 */}
        </span>

        <div className="flex items-center gap-2">
          {/* 총 근무 시간 뱃지 */}
          {item.workMinutes !== null && (
            <div className="flex items-center gap-1 bg-[#F4F7FE] px-2.5 py-1.5 rounded-full text-[11px] font-bold text-[#707EAE]">
              <Clock size={12} className="text-[#A3AED0]" />
              <span>{item.workMinutes}m</span>
            </div>
          )}

          {/* 출결 상태 뱃지 */}
          <div
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] font-black ${getStatusStyle(
              item.status,
            )}`}
          >
            {item.status === "NORMAL" ? (
              <CheckCircle2 size={12} />
            ) : (
              <AlertCircle size={12} />
            )}
            <span>{attendanceTypeMap[item.status] || "기타"}</span>
          </div>
        </div>
      </div>

      {/* 2. 메인 날짜 타이틀 */}
      <h2 className="text-[22px] font-black text-[#1B254B] tracking-tight">
        {formatDate(item.date)} {getDayOfWeek(item.date)}
      </h2>

      {/* 3. 출근 / 퇴근 시간 타임라인 영역 */}
      <div className="flex items-center justify-between relative py-1">
        {/* CLOCK IN */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-[#4318FF] uppercase tracking-wider">
            CLOCK IN
          </span>
          <span className="text-[24px] font-black text-[#1B254B]">
            {formatTime(item.clockIn, item.status)}
          </span>
        </div>

        {/* 중앙 흐린 연결선 및 화살표 */}
        <div className="flex-1 flex items-center justify-center px-4 gap-1.5">
          <div className="h-[1px] flex-1 bg-[#E0E5F2]" />
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#E0E5F2]"
          >
            <path
              d="M5 12h14M12 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="h-[1px] flex-1 bg-[#E0E5F2]" />
        </div>

        {/* CLOCK OUT */}
        <div className="flex flex-col gap-1 text-right">
          <span className="text-[10px] font-bold text-[#4318FF] uppercase tracking-wider">
            CLOCK OUT
          </span>
          <span className="text-[24px] font-black text-[#1B254B]">
            {formatTime(item.clockOut, item.status)}
          </span>
        </div>
      </div>

      {/* 4. 하단 액션 버튼 또는 정상 처리 상태 박스 */}
      {item.status === "NORMAL" ? (
        <div className="w-full py-3.5 border border-dashed border-[#E0E5F2] rounded-[20px] flex items-center justify-center gap-1.5 bg-[#F4F7FE]/20">
          <CheckCircle2 size={14} className="text-[#A3AED0]" />
          <span className="text-[13px] font-bold text-[#707EAE]">
            정상 기록
          </span>
        </div>
      ) : (
        <Button
          size="sm"
          disabled={isDisabled}
          onClick={() => {
            if (!isDisabled)
              router.push(`/attendance/correction/create?id=${item.id}`);
          }}
          // 정정 완료/대기 중일 때는 색상 변경을 위해 className 활용
          className={twMerge(
            "py-3.5",
            isDisabled && "bg-[#E0E5F2] text-[#A3AED0] hover:bg-[#E0E5F2]",
            !isDisabled &&
              "bg-[#4318FF] hover:bg-[#3311CC] shadow-md shadow-[#4318FF]/10",
          )}
          // 아이콘이 필요한 경우에만 전달
          icon={
            !item.isFix && item.apprStatus !== "PENDING" ? (
              <Edit3 size={14} />
            ) : undefined
          }
          // 텍스트 로직
          text={
            item.isFix
              ? "정정 완료"
              : item.apprStatus === "PENDING"
                ? "승인 대기"
                : "정정 요청"
          }
        />
      )}
    </div>
  );
};
