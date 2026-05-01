// "use client";

// import { getWeeklyAttendanceAPI } from "@/api/attendance";
// import { useQuery } from "@tanstack/react-query";
// import React, { useMemo } from "react";

// const ATTENDANCE_MOCK_DATA = {
//   // 1. 상단 주차 요약
//   // weeklySummary: {
//   //   period: "2026.03.23 - 2026.03.27",
//   //   totalHours: 238,
//   //   totalMinutes: 18,
//   // },

//   // 2. 일별 그래프 데이터 (이미지에서 추출한 그라데이션 컬러 적용)
//   dailyGraph: [
//     { day: "월", value: 85, from: "#AFAFAF", to: "#696972" },
//     { day: "화", value: 35, from: "#FF827E", to: "#F84040" },
//     { day: "수", value: 60, from: "#AFAFAF", to: "#696972" },
//     { day: "목", value: 75, from: "#FF9942", to: "#FF6921" },
//     { day: "금", value: 50, from: "#ADBAE8", to: "#0029C0" },
//   ],

//   // 3. 하단 상태 카드 (디자인 가이드 컬러)
//   // attendanceStats: [
//   //   {
//   //     label: "정상 출근",
//   //     value: "17",
//   //     unit: "일",
//   //     bgColor: "#F0FDF4",
//   //     textColor: "#166534",
//   //   },
//   //   {
//   //     label: "누적 지각",
//   //     value: "01",
//   //     unit: "회",
//   //     bgColor: "#FFF7ED",
//   //     textColor: "#9A3412",
//   //   },
//   //   {
//   //     label: "결근",
//   //     value: "00",
//   //     unit: "일",
//   //     bgColor: "#F5F3FF",
//   //     textColor: "#5B21B6",
//   //   },
//   //   {
//   //     label: "조퇴",
//   //     value: "03",
//   //     unit: "회",
//   //     bgColor: "#FEF2F2",
//   //     textColor: "#991B1B",
//   //   },
//   //   {
//   //     label: "출근율",
//   //     value: "80",
//   //     unit: "%",
//   //     bgColor: "#F8FAFC",
//   //     textColor: "#1E293B",
//   //   },
//   // ],
// };

// interface AttendanceStat {
//   label: string;
//   value: string;
//   unit: string;
//   bgColor?: string; // 옵셔널로 설정 (나중에 합칠 거니까)
//   textColor?: string;
// }

// // 2. 색상 정보만 따로 상수로 관리 (가독성 업!)
// const STAT_COLORS: Record<string, { bg: string; text: string }> = {
//   "정상 출근": { bg: "#F0FDF4", text: "#166534" },
//   "누적 지각": { bg: "#FFF7ED", text: "#9A3412" },
//   결근: { bg: "#F5F3FF", text: "#5B21B6" },
//   조퇴: { bg: "#FEF2F2", text: "#991B1B" },
//   출근율: { bg: "#F8FAFC", text: "#1E293B" },
// };
// const gridLines = [1, 2, 3, 4];

// export default function AttendanceSummaryCard() {
//   const { data, isLoading } = useQuery({
//     queryKey: ["summaryAttendance"],
//     queryFn: getWeeklyAttendanceAPI,
//   });

//   console.log("summaryData", data);

//   const enrichedStats = useMemo(() => {
//     if (!data?.stats) return [];

//     return data.stats.map((item: AttendanceStat) => {
//       const colors = STAT_COLORS[item.label] || {
//         bg: "#F8FAFC",
//         text: "#1E293B",
//       };
//       return {
//         ...item,
//         bgColor: colors.bg,
//         textColor: colors.text,
//       };
//     });
//   }, [data]); // data?.stats 대신 data 전체 혹은 data.stats를 넣으세요.

//   if (isLoading) return <div className="...">로딩 중...</div>;
//   if (!data) return null;

//   return (
//     <div className="p-[30px] bg-white rounded-[32px] border border-gray-100 shadow-sm w-full  flex flex-col gap-[30px] h-fit">
//       {/* [상단 영역] 요약 정보와 그래프 */}
//       <div className="flex justify-between items-start gap-[40px]">
//         {/* 왼쪽: 근무시간 요약 */}
//         <div className="flex flex-col flex-shrink-0">
//           <h2 className="font-bold text-[18px] text-gray-950 mb-4">
//             근태 요약
//           </h2>
//           <p className="text-[14px] font-bold text-gray-700">
//             이번주 총 근무시간
//           </p>
//           <p className="text-[16px] text-gray-400 mb-[20px]">
//             {data.weeklySummary.period}
//           </p>

//           <div className="flex flex-col gap-2">
//             {/* 시간 (h) */}
//             <div className="flex items-baseline gap-1">
//               <span className="text-[44px] font-black text-black leading-none">
//                 {data.weeklySummary.totalHours}
//               </span>
//               <span className="text-[24px] font-bold text-gray-400">h</span>
//             </div>
//             {/* 분 (m) */}
//             <div className="flex items-baseline gap-1">
//               <span className="text-[44px] font-black text-black leading-none">
//                 {data.weeklySummary.totalMinutes}
//               </span>
//               <span className="text-[24px] font-bold text-gray-400">m</span>
//             </div>
//           </div>
//         </div>

//         {/* 오른쪽: 그라데이션 그래프 박스 */}
//         <div className="flex-grow max-w-[500px] h-[240px] bg-[#F8FAFC] rounded-[24px] p-8 flex flex-col">
//           {/* 가이드라인 + 막대 영역 */}
//           <div className="relative flex-grow w-full flex justify-between items-end px-4 mb-4">
//             {/* 배경 가이드라인 */}
//             <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
//               {gridLines.map((line) => (
//                 <div key={line} className="w-full h-[1px] bg-gray-200/50" />
//               ))}
//               <div className="w-full h-[1px] bg-gray-300" />
//             </div>

//             {/* 실제 그라데이션 막대 */}
//             {ATTENDANCE_MOCK_DATA.dailyGraph.map((item) => (
//               <div
//                 key={item.day}
//                 style={{
//                   height: `${item.value}%`,
//                   backgroundImage: `linear-gradient(to bottom, ${item.from}, ${item.to})`,
//                 }}
//                 className="w-[38px] rounded-full transition-all duration-700 shadow-sm z-10"
//               />
//             ))}
//           </div>

//           {/* 요일 라벨 */}
//           <div className="flex justify-between w-full px-4">
//             {ATTENDANCE_MOCK_DATA.dailyGraph.map((item) => (
//               <div key={item.day} className="w-[38px] flex justify-center">
//                 <span
//                   style={{ color: item.to }}
//                   className="text-[14px] font-bold"
//                 >
//                   {item.day}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* [하단 영역] 상태 카드 5개 (Flex Grid) */}
//       <div className="flex gap-4 justify-between w-full">
//         {enrichedStats.map((item: AttendanceStat, index: number) => (
//           <div
//             key={item.label} // index보다 고유한 label을 추천해요
//             style={{ backgroundColor: item.bgColor }}
//             className="flex-1 flex flex-col items-center justify-center py-5 rounded-[20px] ..."
//           >
//             <span
//               style={{ color: item.textColor }}
//               className="text-[13px] font-bold mb-3"
//             >
//               {item.label}
//             </span>
//             <div className="flex items-baseline">
//               <span className="text-[28px] font-black text-gray-900 leading-none">
//                 {item.value}
//               </span>
//               <span className="text-[14px] font-bold text-gray-500 ml-[2px]">
//                 {item.unit}
//               </span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { getWeeklyAttendanceAPI } from "@/api/attendance";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { AttendanceStatus } from "@/types/attendance";

interface AttendanceStat {
  label: string;
  value: string;
  unit: string;
  bgColor?: string;
  textColor?: string;
}

interface WeeklyAttendanceResponse {
  weeklySummary: {
    period: string;
    totalHours: number;
    totalMinutes: number;
  };
  stats: AttendanceStat[];
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

export default function AttendanceSummaryCard() {
  const { data, isLoading, isError } = useQuery<WeeklyAttendanceResponse>({
    queryKey: ["summaryAttendance"],
    queryFn: getWeeklyAttendanceAPI,
  });

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

  if (isLoading || isError || !data) return null;

  return (
    <div className="p-[30px] bg-white rounded-[32px] border border-gray-100 shadow-sm w-full flex flex-col gap-[30px] h-fit font-sans">
      <div className="flex justify-between items-start gap-[40px]">
        {/* 왼쪽 정보 영역 */}
        <div className="flex flex-col flex-shrink-0">
          <h2 className="font-bold text-[18px] text-gray-950 mb-4">
            근태 요약
          </h2>
          <p className="text-[14px] font-bold text-gray-700">
            이번주 총 근무시간
          </p>
          <p className="text-[16px] text-gray-400 mb-[20px]">
            {data.weeklySummary.period}
          </p>
          <div className="flex flex-col gap-2">
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

        {/* 오른쪽 그래프 영역 */}
        <div className="flex-grow max-w-[500px] h-[240px] bg-[#F8FAFC] rounded-[24px] p-[30px] flex flex-col">
          <div className="relative flex-grow w-full mb-4">
            {/* 1. 그리드 선 (배경) */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {gridLines.map((line) => (
                <div key={line} className="w-full h-[1px] bg-gray-200/50" />
              ))}
              <div className="w-full h-[1px] bg-gray-300" />
            </div>

            {/* 2. 실제 막대 (전경) */}
            <div className="absolute inset-0 z-10 flex justify-center items-end gap-[36px]">
              {data.dailyGraph.map((item) => {
                const isToday = item.day === todayLabel;
                const isFuture =
                  daysOrder.indexOf(item.day) > daysOrder.indexOf(todayLabel);

                let statusKey: string = item.status;
                if (
                  isToday &&
                  (item.actualMinutes === 0 || item.status === "ABSENT")
                )
                  statusKey = "DEFAULT";
                else if (isFuture) statusKey = "DEFAULT";
                else if (
                  item.status === "LATE_EARLY" ||
                  item.status.includes("EARLY")
                )
                  statusKey = "EARLY_LEAVE";

                const colors = THEME_COLORS[statusKey] || THEME_COLORS.DEFAULT;
                // 퍼센트가 0이어도 최소 2% 높이는 보여줌
                const barHeight = Math.max(item.percent, 2);

                return (
                  <div
                    key={item.day}
                    className="flex flex-col items-center h-full justify-end"
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
                      className={`w-[46px] rounded-[12px] transition-all duration-700 shadow-sm ${
                        isFuture ? "opacity-20" : "opacity-100"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. 요일 라벨 영역 */}
          <div className="flex justify-center items-center gap-[40px] w-full">
            {data.dailyGraph.map((item) => {
              const isToday = item.day === todayLabel;
              const isFuture =
                daysOrder.indexOf(item.day) > daysOrder.indexOf(todayLabel);
              const colors = THEME_COLORS[item.status] || THEME_COLORS.DEFAULT;

              return (
                <div
                  key={item.day}
                  className="w-[42px] flex flex-col items-center gap-1"
                >
                  <span
                    style={{ color: colors.to }}
                    className={`text-[14px] font-bold ${isFuture ? "opacity-30" : "opacity-100"}`}
                  >
                    {item.day}
                  </span>
                  <div className="h-1.5 flex items-center justify-center">
                    {isToday && (
                      <div
                        style={{ backgroundColor: colors.to }}
                        className="w-1.5 h-1.5 rounded-full"
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
      <div className="flex gap-4 justify-between w-full">
        {enrichedStats.map((item) => (
          <div
            key={item.label}
            style={{ backgroundColor: item.bgColor }}
            className="flex-1 flex flex-col items-center justify-center py-5 rounded-[20px] min-w-[80px]"
          >
            <span
              style={{ color: item.textColor }}
              className="text-[13px] font-bold mb-3"
            >
              {item.label}
            </span>
            <div className="flex items-baseline">
              <span className="text-[28px] font-black text-gray-900 leading-none">
                {item.value}
              </span>
              <span className="text-[14px] font-bold text-gray-500 ml-[2px]">
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
