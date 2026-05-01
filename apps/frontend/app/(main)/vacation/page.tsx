"use client";
import { useState } from "react";
import { VacationItem, VacationTableRow } from "@/types/vacation";
import VacationTable from "./_components/VacationTable";

export default function VacationDashboard() {
  const [activeTab, setActiveTab] = useState<"LIST" | "APPLY" | "DETAIL">(
    "LIST",
  );
  const [selectedItem, setSelectedItem] = useState<VacationTableRow | null>(
    null,
  );

  // API에서 가져온 원본 데이터를 표용 데이터로 변환하는 함수
  const transformData = (items: VacationItem[]): VacationTableRow[] => {
    return items.map((item) => ({
      ...item,
      formattedPeriod: `${item.startDate} ~ ${item.endDate}`,
      durationText: item.type === "ANNUAL" ? "1일" : item.timeRange,
    }));
  };

  // 임시 데이터 (실제로는 API 연동 시 fetch 후 transformData 실행)
  const rawData: VacationItem[] = [
    /* API 데이터 */
  ];
  const tableData = transformData(rawData);

  return (
    <div className="bg-white rounded-[32px] shadow-sm ">
      {/* 탭 네비게이션 생략 */}
      {activeTab === "LIST" && (
        <VacationTable
          data={tableData}
          onItemClick={(item) => {
            setSelectedItem(item);
            setActiveTab("DETAIL");
          }}
        />
      )}
      {/* ... 이하 생략 */}
    </div>
  );
}
