"use client";

import React from "react";

// 타입 정의
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

  // 기준: 반차는 주황색, 그 외(연차)는 파란색
  const typeColor = isHalfLeave ? "#FF9942" : "#3B82F6";
  const typeBgColor = isHalfLeave ? "#FFF7ED" : "#DBEAFE";

  // 상태별 색상 (대기:주황, 완료:초록, 반려:빨강)
  const statusConfig: Record<LeaveStatus, { color: string }> = {
    "승인 대기": { color: "#FF822E" },
    "승인 완료": { color: "#0CAF60" },
    반려: { color: "#F84040" },
  };

  const { color: dotColor } = statusConfig[status];

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-4">
        <div
          style={{ backgroundColor: typeBgColor, color: typeColor }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl"
        >
          {isHalfLeave ? "⏰" : "📅"}
        </div>
        <div className="flex flex-col">
          <span className="text-[18px] font-bold text-gray-900">{date}</span>
          <span className="text-[14px] text-gray-400 font-medium">
            {type} ({time})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div
          style={{ backgroundColor: dotColor }}
          className="w-2 h-2 rounded-full"
        />
        <span style={{ color: dotColor }} className="text-[15px] font-bold">
          {status}
        </span>
      </div>
    </div>
  );
}
