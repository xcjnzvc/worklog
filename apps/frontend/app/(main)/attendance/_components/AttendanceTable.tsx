"use client";

import React from "react";
import { AttendanceRow, CombinedStatus } from "@/types/attendance";

interface AttendanceTableProps {
  data: AttendanceRow[];
  type: "view" | "correction";
  onItemClick: (item: AttendanceRow) => void;
}

export const AttendanceTable = ({
  data,
  type,
  onItemClick,
}: AttendanceTableProps) => {
  // 탭 타입에 따른 헤더 설정
  const headers =
    type === "view"
      ? ["날짜", "출근", "퇴근", "근무시간", "상태"]
      : [
          "신청일",
          "대상날짜",
          // "기존 기록",
          // "정정 요청",
          "정정 사유",
          "상태",
          "승인자",
        ];

  // ✅ CombinedStatus를 활용한 스타일 분기 (타입 에러 해결)
  const getStatusStyle = (status: CombinedStatus) => {
    switch (status) {
      case "NORMAL":
      case "APPROVED":
        return "bg-[#EFFFF6] text-[#05CD99]"; // 초록 (정상/완료)
      case "PENDING":
      case "WORKING":
        return "bg-[#FFF8E7] text-[#FFA800]"; // 노랑 (대기/근무중)
      case "REJECTED":
      case "LATE":
      case "ABSENT":
      case "MISSING_OUT":
        return "bg-[#FFEEF2] text-[#EE5D50]"; // 빨강 (반려/지각/결근 등)
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  // ✅CombinedStatus를 활용한 텍스트 매핑
  const getStatusText = (status: CombinedStatus) => {
    const statusMap: Record<string, string> = {
      NORMAL: "정상",
      WORKING: "근무 중",
      LATE: "지각",
      ABSENT: "결근",
      APPROVED: "완료",
      PENDING: "대기",
      REJECTED: "반려",
      MISSING_OUT: "퇴근 누락",
    };
    return statusMap[status] || "기타";
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] border-separate border-spacing-y-3">
        <thead>
          <tr className="bg-transparent">
            {headers.map((head, idx) => (
              <th
                key={idx}
                className="px-6 py-2 text-[13px] font-bold text-[#A3AED0] text-left first:pl-10 last:pr-10"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onItemClick(item)}
              className="group bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {type === "view" ? (
                /* 1. 주간 근무 내역 뷰 */
                <>
                  <td className="px-6 py-6 first:rounded-l-[24px] text-sm font-bold text-[#707EAE] first:pl-10 border-y border-l border-transparent group-hover:border-[#F4F7FE]">
                    {item.date}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent">
                    {item.checkIn || "--:--"}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent">
                    {item.checkOut || "--:--"}
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-[#707EAE] border-y border-transparent">
                    {item.duration || "-"}
                  </td>
                </>
              ) : (
                /* 2. 정정 신청 내역 뷰 */
                <>
                  <td className="px-6 py-6 first:rounded-l-[24px] text-sm font-bold text-[#707EAE] first:pl-10 border-y border-l border-transparent group-hover:border-[#F4F7FE]">
                    {item.requestDate}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent">
                    {item.targetDate}
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-[#EE5D50] border-y border-transparent">
                    {item.oldTime}
                  </td>
                  <td className="px-6 py-6 text-sm font-bold text-[#4318FF] border-y border-transparent">
                    {item.newTime}
                  </td>
                  <td className="px-6 py-6 text-sm text-[#707EAE] border-y border-transparent truncate max-w-[200px]">
                    {item.reason}
                  </td>
                </>
              )}

              {/* 공통 상태 열 */}
              <td className="px-6 py-6 border-y border-transparent">
                <span
                  className={`px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
                >
                  {getStatusText(item.status)}
                </span>
              </td>

              {/* 정정 내역일 때만 승인자 표시 */}
              {type === "correction" && (
                <td className="px-6 py-6 last:rounded-r-[24px] text-sm font-bold text-[#1B254B] border-y border-r border-transparent last:pr-10">
                  {item.approver || "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
