"use client";

import React, { useMemo } from "react";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { AttendanceStat } from "@/types/attendance";

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
  LATE_EARLY: {
    bg: "#FEF2F2",
    text: "#991B1B",
    from: "#FCA5A5",
    to: "#DC2626",
  },
  ABSENT: { bg: "#F5F3FF", text: "#5B21B6", from: "#DDD6FE", to: "#7C3AED" },
  DEFAULT: { bg: "#F8FAFC", text: "#1E293B", from: "#E2E8F0", to: "#94A3B8" },
};

const STAT_LABEL_MAP: Record<string, string> = {
  "정상 출근": "NORMAL",
  "누적 지각": "LATE",
  결근: "ABSENT",
  조퇴: "EARLY_LEAVE",
  출근율: "DEFAULT",
};

const gridLines = [1, 2, 3, 4];

interface Props {
  showStats?: boolean;
}

export default function AttendanceSummaryCard({ showStats = true }: Props) {
  const { data, isLoading, isError } = useAttendanceSummary();

  const daysOrder = ["월", "화", "수", "목", "금"];

  const todayLabel = useMemo(() => {
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    return dayNames[new Date().getDay()];
  }, []);

  const enrichedStats = useMemo(() => {
    if (!data?.stats) return [];
    return data.stats.map((item: AttendanceStat) => {
      const type = STAT_LABEL_MAP[item.label] || "DEFAULT";
      const colors = THEME_COLORS[type];
      return { ...item, bgColor: colors.bg, textColor: colors.text };
    });
  }, [data]);

  if (isLoading) {
    return (
      <div className="p-6 md:p-[30px] bg-white rounded-[32px] border border-gray-100 shadow-sm w-full flex flex-col gap-[30px] h-fit animate-pulse">
        <div className="flex flex-col @lg:flex-row justify-between items-stretch @lg:items-start gap-8 @lg:gap-[40px]">
          <div className="flex flex-col flex-shrink-0 gap-3">
            <div className="h-5 bg-gray-200 rounded-full w-24" />
            <div className="h-4 bg-gray-200 rounded-full w-32" />
            <div className="h-4 bg-gray-200 rounded-full w-20" />
            <div className="h-10 bg-gray-200 rounded-lg w-28 mt-2" />
          </div>
          <div className="flex-grow w-full h-[240px] bg-gray-100 rounded-[24px]" />
        </div>
        <div className="flex flex-wrap @lg:flex-nowrap gap-3 md:gap-4 justify-between w-full">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 min-w-[calc(50%-12px)] @lg:min-w-[80px] h-[80px] bg-gray-100 rounded-[20px]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) return null;

  return (
    <div className="@container p-6 md:p-[30px] bg-white rounded-[32px] border border-gray-100 shadow-sm w-full flex flex-col gap-[30px] h-fit ">
      {/* 상단 섹션: 컨테이너 너비에 따른 분기 (@lg 기준) */}
      <div className="flex flex-col @lg:flex-row justify-between items-stretch @lg:items-start gap-8 @lg:gap-[40px]">
        {/* 왼쪽 정보 영역 */}
        <div className="flex flex-col flex-shrink-0">
          <h2 className="font-bold text-[18px] text-gray-950 mb-4">
            근태 요약
          </h2>
          <p className="text-[14px] font-bold text-gray-700">
            이번주 총 근무시간
          </p>
          <p className="text-[16px] text-gray-400 mb-5">
            {data.weeklySummary.period}
          </p>

          <div className="flex flex-row @lg:flex-col gap-6 lg:gap-2">
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] md:text-[44px] font-black text-black leading-none">
                {data.weeklySummary.totalHours}
              </span>
              <span className="text-[20px] md:text-[24px] font-bold text-gray-400">
                h
              </span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-[36px] md:text-[44px] font-black text-black leading-none">
                {data.weeklySummary.totalMinutes}
              </span>
              <span className="text-[20px] md:text-[24px] font-bold text-gray-400">
                m
              </span>
            </div>
          </div>
        </div>

        {/* 오른쪽 그래프 영역 */}
        <div className="flex-grow w-full h-[240px] bg-[#F8FAFC] rounded-[24px] p-6 md:p-[30px] flex flex-col min-w-0">
          <div className="relative flex-grow w-full mb-4">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {gridLines.map((line) => (
                <div key={line} className="w-full h-[1px] bg-gray-200/50" />
              ))}
              <div className="w-full h-[1px] bg-gray-300" />
            </div>

            <div className="absolute inset-0 z-10 flex justify-around items-end px-2 md:px-4">
              {data.dailyGraph.map((item) => {
                const isToday = item.day === todayLabel;
                const isFuture =
                  daysOrder.indexOf(item.day) > daysOrder.indexOf(todayLabel);

                let statusKey: string = item.status;
                if (
                  isToday &&
                  (item.actualMinutes === 0 || item.status === "ABSENT")
                ) {
                  statusKey = "DEFAULT";
                } else if (isFuture) {
                  statusKey = "DEFAULT";
                } else if (
                  item.status === "LATE_EARLY" ||
                  item.status.includes("EARLY")
                ) {
                  statusKey = "EARLY_LEAVE";
                }

                const colors = THEME_COLORS[statusKey] || THEME_COLORS.DEFAULT;
                const barHeight = Math.max(item.percent, 2);

                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center h-full justify-end flex-1"
                  >
                    <div
                      style={{
                        height: `${barHeight}%`,
                        backgroundImage:
                          statusKey === "DEFAULT"
                            ? "none"
                            : `linear-gradient(to bottom, ${colors.from}, ${colors.to})`,
                        backgroundColor:
                          statusKey === "DEFAULT" ? "#E2E8F0" : undefined,
                      }}
                      className={`w-[24px] md:w-[46px] rounded-[6px] md:rounded-[12px] transition-all duration-700 shadow-sm ${
                        isFuture ? "opacity-20" : "opacity-100"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-around items-center w-full">
            {data.dailyGraph.map((item) => {
              const isToday = item.day === todayLabel;
              const isFuture =
                daysOrder.indexOf(item.day) > daysOrder.indexOf(todayLabel);
              const colors = THEME_COLORS[item.status] || THEME_COLORS.DEFAULT;

              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center gap-1 flex-1"
                >
                  <span
                    style={{ color: colors.to }}
                    className={`text-[12px] md:text-[14px] font-bold ${isFuture ? "opacity-30" : "opacity-100"}`}
                  >
                    {item.day}
                  </span>
                  <div className="h-1.5 flex items-center justify-center">
                    {isToday && (
                      <div
                        style={{ backgroundColor: colors.to }}
                        className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 하단 통계 카드 */}
      {showStats && (
        <div className="flex flex-wrap @lg:flex-nowrap gap-3 md:gap-4 justify-between w-full">
          {enrichedStats.map((item) => (
            <div
              key={item.label}
              style={{ backgroundColor: item.bgColor }}
              className="flex-1 min-w-[calc(50%-12px)] @lg:min-w-[80px] flex flex-col items-center justify-center py-4 md:py-5 rounded-[20px]"
            >
              <span
                style={{ color: item.textColor }}
                className="text-[11px] md:text-[13px] font-bold mb-2 md:mb-3 whitespace-nowrap"
              >
                {item.label}
              </span>
              <div className="flex items-baseline">
                <span className="text-[20px] md:text-[28px] font-black text-gray-900 leading-none">
                  {typeof item.value === "number"
                    ? String(item.value).padStart(2, "0")
                    : item.value}
                </span>
                <span className="text-[12px] md:text-[14px] font-bold text-gray-500 ml-[1px]">
                  {item.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
