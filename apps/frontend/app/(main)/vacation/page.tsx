"use client";
import React, { useState } from "react";
import { VacationItem, VacationTableRow } from "@/types/vacation";

/**
 * 1. VacationTable 컴포넌트를 메인 함수 외부에서 정의합니다.
 */
interface VacationTableProps {
  data: VacationTableRow[];
  onItemClick: (item: VacationTableRow) => void;
}

const VacationTable = ({ data, onItemClick }: VacationTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead className="bg-[#F8F9FD]">
          <tr>
            <th className="px-6 py-4">유형</th>
            <th className="px-6 py-4">사유</th>
            <th className="px-6 py-4">기간</th>
            <th className="px-8 py-4 text-center">승인자</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onItemClick(item)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4">
                {item.type === "ANNUAL" ? "연차" : "반차"}
              </td>
              <td className="px-6 py-4 font-bold">{item.reason}</td>
              <td className="px-6 py-4">{item.formattedPeriod}</td>
              <td className="px-8 py-4 text-center font-bold">
                {item.approver || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 2. 메인 대시보드 컴포넌트
 */
export default function VacationDashboard() {
  const [activeTab, setActiveTab] = useState<"LIST" | "APPLY" | "DETAIL">(
    "LIST",
  );
  const [selectedItem, setSelectedItem] = useState<VacationTableRow | null>(
    null,
  );

  // 데이터 변환 함수
  const transformData = (items: VacationItem[]): VacationTableRow[] => {
    return items.map((item) => ({
      ...item,
      formattedPeriod: `${item.startDate} ~ ${item.endDate}`,
      durationText: item.type === "ANNUAL" ? "1일" : item.timeRange,
    }));
  };

  // 임시 데이터 (approver가 포함된 VacationItem 형식)
  const rawData: VacationItem[] = [
    {
      id: "1",
      type: "ANNUAL",
      startDate: "2026.01.01",
      endDate: "2026.01.02",
      status: "APPROVED",
      reason: "개인 사유 연차",
      createdAt: "2025-12-20",
      timeRange: "Full-day",
      approver: "김팀장",
    },
  ];

  const tableData = transformData(rawData);

  return (
    <div className="bg-white rounded-[32px] shadow-sm p-6">
      {/* 리스트 탭일 때만 테이블 렌더링 */}
      {activeTab === "LIST" && (
        <VacationTable
          data={tableData}
          onItemClick={(item: VacationTableRow) => {
            setSelectedItem(item);
            setActiveTab("DETAIL");
          }}
        />
      )}

      {/* 상세 화면 예시 */}
      {activeTab === "DETAIL" && selectedItem && (
        <div className="p-10 text-center">
          <h2 className="text-xl font-bold mb-4">상세 정보</h2>
          <p>사유: {selectedItem.reason}</p>
          <p>승인자: {selectedItem.approver}</p>
          <button
            onClick={() => setActiveTab("LIST")}
            className="mt-6 text-blue-600 underline"
          >
            목록으로 돌아가기
          </button>
        </div>
      )}
    </div>
  );
}
