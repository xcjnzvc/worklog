"use client";

import { useMemo } from "react";
import { AttendanceStatus } from "@/types/attendance";

interface WeeklyAttendanceResponse {
  weeklySummary: {
    period: string;
    totalHours: number;
    totalMinutes: number;
  };
  dailyGraph: Array<{
    day: string;
    actualMinutes: number;
    targetMinutes: number;
    percent: number;
    status: AttendanceStatus;
  }>;
}

const THEME_COLORS: Record<
  string,
  { bg: string; text: string; from: string; to: string }
> = {
  NORMAL: { bg: "#F5F8FF", text: "#2357E5", from: "#A7C0FF", to: "#2357E5" },
  LATE: { bg: "#FFF7ED", text: "#9A3412", from: "#FED7AA", to: "#EA580C" },
  EARLY_LEAVE: {
    bg: "#FEF2F2",
    text: "#991B1B",
    from: "#FCA5A5",
    to: "#DC2626",
  },
  ABSENT: { bg: "#F5F3FF", text: "#5B21B6", from: "#DDD6FE", to: "#7C3AED" },
  DEFAULT: { bg: "#F8FAFC", text: "#1E293B", from: "#E2E8F0", to: "#94A3B8" },
};

// data: any 를 WeeklyAttendanceResponse 로 변경
export default function AttendanceSummaryCard({
  data,
}: {
  data: WeeklyAttendanceResponse;
}) {
  const daysOrder = ["월", "화", "수", "목", "금"];
  const todayLabel = useMemo(
    () => ["일", "월", "화", "수", "목", "금", "토"][new Date().getDay()],
    [],
  );

  return (
    <div className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full flex flex-col gap-8">
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h2 className="font-bold text-[18px] text-gray-950 mb-4">
            근태 요약
          </h2>
          <p className="text-[14px] font-bold text-gray-700">
            이번주 총 근무시간
          </p>
          <p className="text-[16px] text-gray-400 mb-6">
            {data.weeklySummary.period}
          </p>
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-1">
              <span className="text-[44px] font-black text-black leading-none">
                {data.weeklySummary.totalHours}
              </span>
              <span className="text-[24px] font-bold text-gray-400">h</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[44px] font-black text-black leading-none">
                {data.weeklySummary.totalMinutes}
              </span>
              <span className="text-[24px] font-bold text-gray-400">m</span>
            </div>
          </div>
        </div>

        <div className="flex-grow max-w-[500px] h-[240px] bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col relative">
          <div className="flex-grow flex justify-center items-end gap-8 mb-4">
            {/* item: any 를 실제 타입으로 변경 */}
            {data.dailyGraph.map((item) => {
              const isFuture =
                daysOrder.indexOf(item.day) > daysOrder.indexOf(todayLabel);
              const colors =
                THEME_COLORS[item.status as string] || THEME_COLORS.DEFAULT;
              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center h-full justify-end"
                >
                  <div
                    style={{
                      height: `${Math.max(item.percent, 5)}%`,
                      backgroundImage: `linear-gradient(to bottom, ${colors.from}, ${colors.to})`,
                    }}
                    className={`w-[40px] rounded-[10px] transition-all duration-700 ${isFuture ? "opacity-20" : ""}`}
                  />
                  <span className="mt-3 text-[13px] font-bold text-gray-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
