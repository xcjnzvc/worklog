"use client";

import React from "react";
import LeaveHistoryItem from "@/components/LeaveHistoryItem";
import Button from "@/components/Button";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem } from "@/types/vacation";

export default function LeaveStatusCard() {
  // 1. useVacation()에서 필요한 훅(useVacationList)을 먼저 꺼냅니다.
  const { useVacationList } = useVacation();

  // 2. 꺼내온 훅을 호출하여 실제 데이터와 상태를 가져옵니다.
  const { data, isLoading, isError } = useVacationList();

  if (isLoading)
    return <div className="p-8 bg-white rounded-[32px]">로딩 중...</div>;
  if (isError || !data)
    return (
      <div className="p-8 bg-white rounded-[32px]">
        데이터를 불러올 수 없습니다.
      </div>
    );

  const { list, summary } = data;

  // 0으로 나누는 오류 방지 (total이 0일 경우 대비)
  const usedPercentage =
    summary.total > 0 ? (summary.used / summary.total) * 100 : 0;

  return (
    <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm max-w-[450px] w-full flex flex-col">
      {/* 상단: 남은 연차 정보 */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col">
          <h2 className="text-[20px] font-bold text-gray-950 mb-4">
            연차 현황
          </h2>
          <div className="flex items-baseline gap-1">
            <span className="text-[40px] font-black text-black leading-none">
              {summary.remaining}
            </span>
            <span className="text-[18px] font-bold text-gray-400">일 남음</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl grayscale opacity-50">
          🌴
        </div>
      </div>

      {/* 중간: 프로그레스 바 영역 */}
      <div className="mb-8">
        {" "}
        {/* mb-18이 너무 커서 mb-8로 조정했습니다 */}
        <p className="text-[15px] font-medium text-gray-500 mb-[12px]">
          전체 {summary.total}일 중 {summary.used}일을 사용했습니다.
        </p>
        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${usedPercentage}%` }}
            className="absolute h-full bg-[#0029C0] rounded-full transition-all duration-1000"
          />
        </div>
        <div className="flex justify-between mt-2 text-[13px] font-bold">
          <span className="text-[#0029C0]">사용 {summary.used}</span>
          <span className="text-gray-400">남음 {summary.remaining}</span>
        </div>
      </div>

      {/* 하단: 최근 신청 내역 리스트 */}
      <div className="flex flex-col gap-2 mb-[20px]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[18px] font-bold text-gray-900">
            최근 신청 내역
          </span>
          <button className="text-[14px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
            더보기 &gt;
          </button>
        </div>

        <div className="flex flex-col">
          {list.map(
            (
              item: VacationItem, // 여기서 item에 타입을 지정합니다.
            ) => (
              <LeaveHistoryItem
                key={item.id}
                startDate={item.startDate}
                type={item.type}
                timeRange={item.timeRange}
                status={item.status}
              />
            ),
          )}
          {list.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              신청 내역이 없습니다.
            </p>
          )}
        </div>
      </div>

      <Button text="신청하기" />
    </div>
  );
}
