"use client";

import React from "react";

export type LeaveStatus = "승인 대기" | "승인 완료" | "반려";

interface LeaveHistoryItemProps {
  date: string;
  type: string;
  time: string;
  status: LeaveStatus;
}

export default function LeaveHistoryItem({
  date,
  type,
  time,
  status,
}: LeaveHistoryItemProps) {
  const isHalfLeave = type.includes("반차");

  // 아이콘 경로 및 색상 설정
  // 반차(⏰): #F69722 / 그 외(📅): #2357E5
  const iconPath = isHalfLeave ? "/clock.svg" : "/calendar.svg";
  const iconColor = isHalfLeave ? "#F69722" : "#2357E5";

  // 배경색 (기존 로직 유지 또는 아이콘 색에 맞춰 조정 가능)
  const typeBgColor = isHalfLeave ? "#FFF7ED" : "#DBEAFE";

  const statusConfig: Record<LeaveStatus, { color: string }> = {
    "승인 대기": { color: "#FF822E" },
    "승인 완료": { color: "#0CAF60" },
    반려: { color: "#F84040" },
  };

  const { color: dotColor } = statusConfig[status];

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
              backgroundColor: iconColor, // 여기서 SVG의 색상이 결정됩니다
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
          <span className="text-[15px] font-bold text-gray-900">{date}</span>
          <span className="text-[13px] text-gray-400 font-medium">
            {type} ({time})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: dotColor }}
          className="w-2 h-2 rounded-full"
        />
        <span style={{ color: dotColor }} className="text-[13px] font-bold">
          {status}
        </span>
      </div>
    </div>
  );
}
