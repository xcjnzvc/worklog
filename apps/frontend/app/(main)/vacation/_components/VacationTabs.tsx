"use client";

import React from "react";
import { Search } from "lucide-react";

export type VacationTabType = "LIST" | "STATISTICS";

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
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-100">
      <div className="flex items-center gap-8">
        {(["LIST", "STATISTICS"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`relative py-2 font-bold transition-all ${
              activeTab === tab
                ? "text-[20px] text-[#1B254B]"
                : "text-[18px] text-[#A3AED0]"
            }`}
          >
            {tab === "LIST" ? "휴가 내역 목록" : "상세 통계"}
            {activeTab === tab && (
              <div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#4318FF] rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="relative group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors"
        />
        <input
          type="text"
          placeholder="내용 또는 승인자 검색..."
          className="w-full md:w-[320px] pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-[#4318FF]/5 transition-all"
          value={searchKeyword}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
