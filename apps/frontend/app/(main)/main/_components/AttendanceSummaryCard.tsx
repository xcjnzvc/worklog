"use client";

import React from "react";

export default function AttendanceSummaryCard() {
  const ATTENDANCE_MOCK_DATA = {
    // 1. 상단 주차 요약
    weeklySummary: {
      period: "2026.03.23 - 2026.03.27",
      totalHours: 238,
      totalMinutes: 18,
    },

    // 2. 일별 그래프 데이터 (이미지에서 추출한 그라데이션 컬러 적용)
    dailyGraph: [
      { day: "월", value: 85, from: "#AFAFAF", to: "#696972" },
      { day: "화", value: 35, from: "#FF827E", to: "#F84040" },
      { day: "수", value: 60, from: "#AFAFAF", to: "#696972" },
      { day: "목", value: 75, from: "#FF9942", to: "#FF6921" },
      { day: "금", value: 50, from: "#ADBAE8", to: "#0029C0" },
    ],

    // 3. 하단 상태 카드 (디자인 가이드 컬러)
    attendanceStats: [
      {
        label: "정상 출근",
        value: "17",
        unit: "일",
        bgColor: "#F0FDF4",
        textColor: "#166534",
      },
      {
        label: "누적 지각",
        value: "01",
        unit: "회",
        bgColor: "#FFF7ED",
        textColor: "#9A3412",
      },
      {
        label: "결근",
        value: "00",
        unit: "일",
        bgColor: "#F5F3FF",
        textColor: "#5B21B6",
      },
      {
        label: "조퇴",
        value: "03",
        unit: "회",
        bgColor: "#FEF2F2",
        textColor: "#991B1B",
      },
      {
        label: "출근율",
        value: "80",
        unit: "%",
        bgColor: "#F8FAFC",
        textColor: "#1E293B",
      },
    ],
  };

  const gridLines = [1, 2, 3, 4];

  return (
    <div className="p-[30px] bg-white rounded-[32px] border border-gray-100 shadow-sm w-full  flex flex-col gap-[30px] h-fit">
      {/* [상단 영역] 요약 정보와 그래프 */}
      <div className="flex justify-between items-start gap-[40px]">
        {/* 왼쪽: 근무시간 요약 */}
        <div className="flex flex-col flex-shrink-0">
          <h2 className="text-[22px] font-bold text-gray-950 mb-4">
            근태 요약
          </h2>
          <p className="text-[14px] font-semibold text-gray-700">
            이번주 총 근무시간
          </p>
          <p className="text-[14px] text-gray-400 mb-8">
            {ATTENDANCE_MOCK_DATA.weeklySummary.period}
          </p>

          <div className="flex flex-col gap-2">
            {/* 시간 (h) */}
            <div className="flex items-baseline gap-1">
              <span className="text-[48px] font-black text-black leading-none">
                {ATTENDANCE_MOCK_DATA.weeklySummary.totalHours}
              </span>
              <span className="text-[24px] font-bold text-gray-400">h</span>
            </div>
            {/* 분 (m) */}
            <div className="flex items-baseline gap-1">
              <span className="text-[48px] font-black text-black leading-none">
                {ATTENDANCE_MOCK_DATA.weeklySummary.totalMinutes}
              </span>
              <span className="text-[24px] font-bold text-gray-400">m</span>
            </div>
          </div>
        </div>

        {/* 오른쪽: 그라데이션 그래프 박스 */}
        <div className="flex-grow max-w-[500px] h-[240px] bg-[#F8FAFC] rounded-[24px] p-8 flex flex-col">
          {/* 가이드라인 + 막대 영역 */}
          <div className="relative flex-grow w-full flex justify-between items-end px-4 mb-4">
            {/* 배경 가이드라인 */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {gridLines.map((line) => (
                <div key={line} className="w-full h-[1px] bg-gray-200/50" />
              ))}
              <div className="w-full h-[1px] bg-gray-300" />
            </div>

            {/* 실제 그라데이션 막대 */}
            {ATTENDANCE_MOCK_DATA.dailyGraph.map((item) => (
              <div
                key={item.day}
                style={{
                  height: `${item.value}%`,
                  backgroundImage: `linear-gradient(to bottom, ${item.from}, ${item.to})`,
                }}
                className="w-[38px] rounded-full transition-all duration-700 shadow-sm z-10"
              />
            ))}
          </div>

          {/* 요일 라벨 */}
          <div className="flex justify-between w-full px-4">
            {ATTENDANCE_MOCK_DATA.dailyGraph.map((item) => (
              <div key={item.day} className="w-[38px] flex justify-center">
                <span
                  style={{ color: item.to }}
                  className="text-[14px] font-bold"
                >
                  {item.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* [하단 영역] 상태 카드 5개 (Flex Grid) */}
      <div className="flex gap-4 justify-between w-full">
        {ATTENDANCE_MOCK_DATA.attendanceStats.map((stat) => (
          <div
            key={stat.label}
            style={{ backgroundColor: stat.bgColor }}
            className="flex-1 flex flex-col items-center justify-center py-5 rounded-[20px] transition-transform hover:scale-[1.02] min-w-[80px]"
          >
            <span
              style={{ color: stat.textColor }}
              className="text-[13px] font-bold mb-3"
            >
              {stat.label}
            </span>
            <div className="flex items-baseline">
              <span className="text-[28px] font-black text-gray-900 leading-none">
                {stat.value}
              </span>
              <span className="text-[14px] font-bold text-gray-500 ml-[2px]">
                {stat.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
