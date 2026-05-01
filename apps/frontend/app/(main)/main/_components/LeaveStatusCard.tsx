"use client";

import React from "react";
import LeaveHistoryItem from "@/components/LeaveHistoryItem";
import Button from "@/components/Button";
import { useQuery } from "@tanstack/react-query";
import { getVacationAPI } from "@/api/vacation";
import { VacationResponse, VacationItem } from "@/types/vacation";

export default function LeaveStatusCard() {
  const { data, isLoading, isError } = useQuery<VacationResponse>({
    queryKey: ["vacations"],
    queryFn: getVacationAPI,
  });

  if (isLoading) return <div>로딩 중...</div>;
  if (isError || !data) return <div>데이터를 불러올 수 없습니다.</div>;

  const usedPercentage = (data.summary.used / data.summary.total) * 100;

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
              {data.summary.remaining}
            </span>
            <span className="text-[18px] font-bold text-gray-400">일 남음</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl grayscale opacity-50">
          🌴
        </div>
      </div>

      {/* 중간: 프로그레스 바 영역 */}
      <div className="mb-18">
        <p className="text-[15px] font-medium text-gray-500 mb-[12px]">
          전체 {data.summary.total}일 중 {data.summary.used}일을 사용했습니다.
        </p>
        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${usedPercentage}%` }}
            className="absolute h-full bg-[#0029C0] rounded-full transition-all duration-1000"
          />
        </div>
        <div className="flex justify-between mt-2 text-[13px] font-bold">
          <span className="text-[#0029C0]">사용 {data.summary.used}</span>
          <span className="text-gray-400">남음 {data.summary.remaining}</span>
        </div>
      </div>

      {/* 하단: 최근 신청 내역 리스트 (LeaveHistoryItem 재사용) */}
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
          {data.data.map((item) => (
            <LeaveHistoryItem
              key={item.id}
              startDate={item.startDate}
              type={item.type}
              timeRange={item.timeRange}
              status={item.status}
            />
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <Button text="신청하기" />
    </div>
  );
}
