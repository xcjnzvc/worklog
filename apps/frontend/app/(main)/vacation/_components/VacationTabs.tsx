"use client";

import React from "react";
import { Search } from "lucide-react";
import { VacationTabType } from "../page";

interface VacationTabsProps {
  activeTab: VacationTabType;
  onTabChange: (tab: VacationTabType) => void;
  searchKeyword: string;
  onSearchChange: (value: string) => void;
}

export const VacationTabs = ({
  activeTab,
  onTabChange,
  searchKeyword,
  onSearchChange,
}: VacationTabsProps) => {
  const tabs: { id: VacationTabType; label: string }[] = [
    { id: "LIST", label: "휴가 목록" },
    { id: "APPLY", label: "휴가 신청" },
    { id: "STATISTICS", label: "휴가 통계" },
  ];

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#E0E5F2]">
      {/* ✅ 해결 포인트 1: h-[60px] 고정 높이 부여 
        글자 크기가 20px에서 28px로 커져도 이 박스의 높이는 60px로 고정되어 
        아래에 있는 '휴가 신청' 카드가 아래로 밀리지 않습니다.
      */}
      <div className="flex items-end gap-10 h-[60px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            /* ✅ 해결 포인트 2: items-end와 pb-4
               글자가 커질 때 '아래쪽'이 아닌 '위쪽'으로 확장되도록 바닥에 붙입니다.
               whitespace-nowrap은 글자가 줄바꿈되어 높이가 튀는 것을 방지합니다.
            */
            className={`relative pb-4 font-bold transition-all duration-300 whitespace-nowrap flex items-center ${
              activeTab === tab.id
                ? "text-[28px] text-[#1B254B] leading-none"
                : "text-[20px] text-[#A3AED0] hover:text-[#707EAE] leading-none"
            }`}
          >
            <span className="relative z-10">{tab.label}</span>

            {/* 활성화 표시 바 (인디케이터) */}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#4318FF] rounded-t-full shadow-[0_-2px_10px_rgba(67,24,255,0.3)]" />
            )}
          </button>
        ))}
      </div>

      {/* 우측 검색창 영역 */}
      <div className="pb-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search
              size={18}
              className="text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors"
            />
          </div>
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            className="w-full md:w-[300px] pl-12 pr-4 py-3 bg-white border border-transparent rounded-2xl text-sm font-medium text-[#1B254B] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20 focus:border-[#4318FF] transition-all"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
