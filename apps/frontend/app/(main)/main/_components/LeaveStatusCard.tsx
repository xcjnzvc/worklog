"use client";

import React from "react";
import LeaveHistoryItem from "@/components/LeaveHistoryItem";

export default function LeaveStatusCard() {
  // 목데이터
  const LEAVE_MOCK_DATA = {
    remainingDays: 7,
    totalDays: 15,
    usedDays: 8,
    history: [
      {
        id: 1,
        date: "2026년 02월 03일",
        type: "하루 종일",
        time: "Full-day",
        status: "승인 대기" as const,
      },
      {
        id: 2,
        date: "2026년 02월 03일",
        type: "반차",
        time: "14:00 - 18:00",
        status: "승인 완료" as const,
      },
    ],
  };

  const usedPercentage =
    (LEAVE_MOCK_DATA.usedDays / LEAVE_MOCK_DATA.totalDays) * 100;

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
              {LEAVE_MOCK_DATA.remainingDays}
            </span>
            <span className="text-[18px] font-bold text-gray-400">일 남음</span>
          </div>
        </div>
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl grayscale opacity-50">
          🌴
        </div>
      </div>

      {/* 중간: 프로그레스 바 영역 */}
      <div className="mb-10">
        <p className="text-[15px] font-medium text-gray-500 mb-4">
          전체 {LEAVE_MOCK_DATA.totalDays}일 중 {LEAVE_MOCK_DATA.usedDays}일을
          사용했습니다.
        </p>
        <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            style={{ width: `${usedPercentage}%` }}
            className="absolute h-full bg-[#0029C0] rounded-full transition-all duration-1000"
          />
        </div>
        <div className="flex justify-between mt-2 text-[13px] font-bold">
          <span className="text-[#0029C0]">
            사용 {LEAVE_MOCK_DATA.usedDays}
          </span>
          <span className="text-gray-400">
            남음 {LEAVE_MOCK_DATA.remainingDays}
          </span>
        </div>
      </div>

      {/* 하단: 최근 신청 내역 리스트 (LeaveHistoryItem 재사용) */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[18px] font-bold text-gray-900">
            최근 신청 내역
          </span>
          <button className="text-[14px] font-bold text-gray-400 hover:text-gray-600 transition-colors">
            더보기 &gt;
          </button>
        </div>

        <div className="flex flex-col">
          {LEAVE_MOCK_DATA.history.map((item) => (
            <LeaveHistoryItem key={item.id} {...item} />
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <button className="mt-8 w-full py-5 bg-[#0029C0] text-white rounded-[20px] text-[18px] font-bold hover:bg-[#0023A1] transition-all active:scale-[0.98]">
        신청하기
      </button>
    </div>
  );
}
