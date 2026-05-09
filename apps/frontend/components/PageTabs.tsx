"use client";

import React from "react";
import { Search } from "lucide-react";

// 제네릭 T를 사용하여 어떤 문자열 타입의 탭이든 받을 수 있게 합니다.
interface TabOption<T extends string> {
  value: T;
  label: string;
}

interface PageTabsProps<T extends string> {
  tabs: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  // 검색바 관련 (선택적 Props)
  searchKeyword?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export const PageTabs = <T extends string>({
  tabs,
  activeTab,
  onTabChange,
  searchKeyword,
  onSearchChange,
  searchPlaceholder = "검색어를 입력하세요...",
}: PageTabsProps<T>) => {
  // 검색바 노출 여부 판단 (Props가 넘어왔을 때만)
  const showSearch = onSearchChange !== undefined;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4 border-t border-gray-100">
      {/* 탭 영역 */}
      <div className="flex items-center gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`relative py-2 font-bold transition-all ${
              activeTab === tab.value
                ? "text-[20px] text-[#1B254B]"
                : "text-[18px] text-[#A3AED0]"
            }`}
          >
            {tab.label}
            {activeTab === tab.value && (
              <div className="absolute -bottom-1 left-0 w-full h-[4px] bg-[#4318FF] rounded-full" />
            )}
          </button>
        ))}
      </div>

      {/* 검색바 영역 (조건부 렌더링) */}
      {showSearch && (
        <div className="relative group">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0] group-focus-within:text-[#4318FF] transition-colors"
          />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full md:w-[320px] pl-12 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-[14px] font-medium shadow-sm focus:outline-none focus:ring-4 focus:ring-[#4318FF]/5 transition-all"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};
