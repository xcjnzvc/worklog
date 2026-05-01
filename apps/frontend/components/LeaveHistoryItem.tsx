"use client";

import React from "react";

export type DbStatus = "PENDING" | "APPROVED" | "REJECTED";

interface LeaveHistoryItemProps {
  startDate: string; // DB 필드명 그대로 사용
  type: "ANNUAL" | "HALF_AM" | "HALF_PM"; // DB 값
  timeRange: string; // DB 필드명 그대로 사용
  status: DbStatus; // DB 값
}

export default function LeaveHistoryItem({
  startDate,
  type,
  timeRange,
  status,
}: LeaveHistoryItemProps) {
  // DB 값을 UI용 텍스트로 변환하는 함수
  const getStatusLabel = (s: DbStatus) => {
    const map = {
      PENDING: "승인 대기",
      APPROVED: "승인 완료",
      REJECTED: "반려",
    };
    return map[s];
  };

  const getTypeLabel = (t: string) => {
    return t === "ANNUAL" ? "하루 종일" : "반차";
  };

  // [수정 포인트 1: 아이콘 로직]
  // ANNUAL(하루 종일)이 아니면(즉, 반차라면) 시계 아이콘, 아니면 달력 아이콘
  const isHalfLeave = type !== "ANNUAL";
  const iconPath = isHalfLeave ? "/clock.svg" : "/calendar.svg";

  // 시안 색상 적용 (반차: 주황색계열, 연차: 파란색계열)
  const iconColor = isHalfLeave ? "#F69722" : "#2357E5";
  const typeBgColor = isHalfLeave ? "#FFF7ED" : "#DBEAFE";

  const statusConfig: Record<DbStatus, { color: string }> = {
    PENDING: { color: "#FF822E" },
    APPROVED: { color: "#0CAF60" },
    REJECTED: { color: "#F84040" },
  };

  const { color: dotColor } = statusConfig[status];

  // [수정 포인트 2: 날짜 포맷팅]
  // DB의 ISO 날짜를 "2026년 02월 03일" 형식으로 변환합니다.
  const dateObj = new Date(startDate);
  const formattedDate = `${dateObj.getFullYear()}년 ${String(
    dateObj.getMonth() + 1,
  ).padStart(2, "0")}월 ${String(dateObj.getDate()).padStart(2, "0")}일`;

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-4">
        {/* 아이콘 컨테이너 */}
        <div
          style={{ backgroundColor: typeBgColor }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
        >
          {/* mask-image를 이용한 SVG 색상 제어 */}
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: iconColor,
              maskImage: `url(${iconPath})`,
              WebkitMaskImage: `url(${iconPath})`,
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
              maskSize: "contain",
              WebkitMaskSize: "contain",
            }}
          />
        </div>

        <div className="flex flex-col">
          <span className="text-[15px] font-bold text-gray-900">
            {formattedDate} {/* 수정된 날짜 형식 */}
          </span>
          <span className="text-[13px] text-gray-400 font-medium">
            {getTypeLabel(type)} ({timeRange})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: dotColor }}
          className="w-2 h-2 rounded-full"
        />
        <span style={{ color: dotColor }} className="text-[13px] font-bold">
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  );
}
