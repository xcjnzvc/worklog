"use client";

import React, { useState } from "react";

export default function WeeklyScheduleCard() {
  const [selectedDate, setSelectedDate] = useState<number>(26);

  // 2026년 3월 4주차 데이터 샘플
  const days = [
    { dayName: "일", date: 22, isWeekend: true, isSunday: true },
    { dayName: "월", date: 23 },
    { dayName: "화", date: 24 },
    {
      dayName: "수",
      date: 25,
      tags: [
        { text: "연차 3", bg: "bg-blue-50 text-blue-600" },
        { text: "회의 1", bg: "bg-orange-50 text-orange-600" },
        { text: "반차 2", bg: "bg-amber-50 text-amber-600" },
      ],
    },
    { dayName: "목", date: 26, isToday: true },
    { dayName: "금", date: 27 },
    { dayName: "토", date: 28, isWeekend: true },
  ];

  return (
    <div className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm overflow-visible">
      {/* 헤더 구역 */}
      <div className="mb-6">
        <h3 className="text-gray-900 font-bold text-lg mb-4">주간 스케줄</h3>
        <div className="flex items-center gap-4 text-gray-800">
          <button className="text-gray-400 hover:text-gray-600 font-bold">
            &lt;
          </button>
          <span className="font-bold text-[16px]">2026년 3월 4주</span>
          <button className="text-gray-400 hover:text-gray-600 font-bold">
            &gt;
          </button>
        </div>
      </div>

      {/* 📅 주간 요일 그리드 구역 */}
      {/* 💡 해결 포인트 1: '오늘' 배지가 마음껏 튀어나올 수 있도록 상단 마진/패딩 여백을 pt-8로 넓히고 overflow-visible 처리 */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 pt-8 pb-2 overflow-visible">
        {days.map((item) => {
          const isSelected = selectedDate === item.date;

          return (
            <div
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`relative flex flex-col items-center justify-start min-h-[160px] rounded-[20px] border p-3 cursor-pointer transition-all select-none
                ${item.isToday ? "border-[#0029C0] bg-white shadow-sm" : isSelected ? "border-gray-300 bg-gray-50" : "border-gray-100 bg-white hover:border-gray-200"}
                overflow-visible /* 💡 해결 포인트 2: 개별 요일 카드에도 overflow-visible을 명시하여 브라우저 클리핑 방지 */
              `}
            >
              {/*  '오늘' 배지 위치 및 레이어 보정 (음수 top 마진 조정) */}
              {item.isToday && (
                <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 bg-[#0029C0] px-3 py-0.5 rounded-full z-20 shadow-sm">
                  <span className="text-white text-[11px] font-black tracking-tight">
                    오늘
                  </span>
                </div>
              )}

              {/* 요일 이름 */}
              <span
                className={`text-xs font-bold mb-3 
                ${item.isSunday ? "text-red-500" : item.isWeekend ? "text-blue-500" : "text-gray-400"}
              `}
              >
                {item.dayName}
              </span>

              {/* 날짜 숫자 */}
              <span
                className={`text-[20px] font-bold tracking-tight mb-3
                ${item.isSunday ? "text-red-500" : item.isWeekend ? "text-blue-500" : "text-gray-900"}
              `}
              >
                {item.date}
              </span>

              {/* 일정 태그 목록 */}
              {item.tags && (
                <div className="w-full flex flex-col gap-1 mt-auto">
                  {item.tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className={`w-full py-1 px-1.5 rounded-md text-center text-[10px] font-bold ${tag.bg}`}
                    >
                      {tag.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 하단 상세 레이아웃 (휴가자 / 회의 일정) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* 휴가자 카드 */}
        <div className="bg-[#F8F9FA] rounded-[24px] p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#0029C0]">👥</span>
              <h4 className="font-bold text-sm text-gray-800">휴가자</h4>
            </div>
            <span className="text-[#0029C0] text-xs font-bold">3명</span>
          </div>

          <div className="flex flex-col gap-3 mb-5">
            {["프론트엔드", "디자이너", "디자이너"].map((dept, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  강
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-900 font-bold text-sm">
                    강수정
                  </span>
                  <span className="text-gray-400 text-[11px] font-medium">
                    {dept}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 mt-auto">
            + 추가 정보 확인
          </button>
        </div>

        {/* 회의 일정 카드 */}
        <div className="bg-[#F8F9FA] rounded-[24px] p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">🕒</span>
              <h4 className="font-bold text-sm text-gray-800">회의 일정</h4>
            </div>
            <span className="text-orange-600 text-xs font-bold">2건</span>
          </div>

          <div className="flex flex-col gap-3 mb-5">
            <div className="bg-white p-3.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  🕒 13:00
                </span>
                <span className="text-blue-600 text-[10px] font-bold">
                  비대면
                </span>
              </div>
              <h5 className="text-gray-900 font-bold text-xs">
                프론트 기획 리뷰
              </h5>
              <p className="text-gray-400 text-[10px] mt-0.5">📍 Google Meet</p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                  🕒 15:30
                </span>
                <span className="text-emerald-600 text-[10px] font-bold">
                  대면
                </span>
              </div>
              <h5 className="text-gray-900 font-bold text-xs">
                디자인 싱크 세션
              </h5>
              <p className="text-gray-400 text-[10px] mt-0.5">📍 회의실 B</p>
            </div>
          </div>

          <button className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 mt-auto">
            + 전체 회의실 예약
          </button>
        </div>
      </div>
    </div>
  );
}
