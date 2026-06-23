// "use client";

// import React from "react";
// import LeaveHistoryItem from "@/components/LeaveHistoryItem";
// import Button from "@/components/Button";
// import { useVacation } from "@/hooks/useVacation";
// import { VacationItem } from "@/types/vacation";

// export default function LeaveStatusCard() {
//   const { useVacationList } = useVacation();
//   const { data, isLoading, isError } = useVacationList();

//   if (isLoading)
//     return (
//       <div className="p-8 bg-white rounded-[32px] w-full flex-1 min-h-[500px] flex items-center justify-center">
//         로딩 중...
//       </div>
//     );

//   if (isError || !data)
//     return (
//       <div className="p-8 bg-white rounded-[32px] w-full flex-1 min-h-[500px] flex items-center justify-center">
//         데이터를 불러올 수 없습니다.
//       </div>
//     );

//   const { list, summary } = data;

//   const usedPercentage =
//     summary.total > 0 ? (summary.used / summary.total) * 100 : 0;

//   return (
//     <article className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full flex flex-col flex-1 transition-all hover:shadow-md">
//       {/* 상단: 남은 연차 정보 */}
//       <div className="flex justify-between items-start mb-6">
//         <div className="flex flex-col">
//           <h2 className="text-[20px] font-bold text-gray-950 mb-4">
//             연차 현황
//           </h2>
//           <div className="flex items-baseline gap-1">
//             <span className="text-[40px] font-black text-black leading-none">
//               {summary.remaining}
//             </span>
//             <span className="text-[18px] font-bold text-gray-400">일 남음</span>
//           </div>
//         </div>
//         <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl grayscale opacity-50">
//           🌴
//         </div>
//       </div>

//       {/* 중간: 프로그레스 바 영역 */}
//       <div className="mb-8">
//         <p className="text-[15px] font-medium text-gray-500 mb-[12px]">
//           전체 {summary.total}일 중 {summary.used}일을 사용했습니다.
//         </p>
//         <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
//           <div
//             style={{ width: `${usedPercentage}%` }}
//             className="absolute h-full bg-[#0029C0] rounded-full transition-all duration-1000"
//           />
//         </div>
//         <div className="flex justify-between mt-2 text-[13px] font-bold">
//           <span className="text-[#0029C0]">사용 {summary.used}</span>
//           <span className="text-gray-400">남음 {summary.remaining}</span>
//         </div>
//       </div>

//       {/* 하단: 최근 신청 내역 리스트 - flex-1을 주어 남은 공간을 차지하게 함 */}
//       <div className="flex flex-col gap-2 mb-[20px] flex-1">
//         <div className="flex justify-between items-center mb-2">
//           <span className="text-[18px] font-bold text-gray-900">
//             최근 신청 내역
//           </span>
//           <Button
//             size="sm"
//             text="더보기 >"
//             onClick={onMoreClick}
//             className="bg-transparent hover:bg-transparent text-gray-400 hover:text-gray-600 px-0 w-auto"
//           />
//         </div>

//         <div className="flex flex-col overflow-y-auto custom-scrollbar">
//           {list.map((item: VacationItem) => (
//             <LeaveHistoryItem
//               key={item.id}
//               startDate={item.startDate}
//               type={item.type}
//               timeRange={item.timeRange}
//               status={item.status}
//             />
//           ))}
//           {list.length === 0 && (
//             <p className="text-sm text-gray-400 text-center py-4">
//               신청 내역이 없습니다.
//             </p>
//           )}
//         </div>
//       </div>

//       {/* 버튼 영역: mt-auto로 항상 최하단 고정 */}
//       <div className="mt-auto">
//         <Button text="신청하기" />
//       </div>
//     </article>
//   );
// }

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import LeaveHistoryItem from "@/components/LeaveHistoryItem";
import Button from "@/components/Button";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem } from "@/types/vacation";

export default function LeaveStatusCard() {
  const router = useRouter();
  const { useVacationList } = useVacation();
  const { data, isLoading, isError } = useVacationList();

  // 더보기 및 신청하기 공통 핸들러
  const handleMoreClick = () => {
    router.push("/vacation");
  };

  if (isLoading)
    return (
      <div className="p-8 bg-white rounded-[32px] w-full flex-1 min-h-[500px] flex items-center justify-center">
        로딩 중...
      </div>
    );

  if (isError || !data)
    return (
      <div className="p-8 bg-white rounded-[32px] w-full flex-1 min-h-[500px] flex items-center justify-center">
        데이터를 불러올 수 없습니다.
      </div>
    );

  const { list, summary } = data;
  const usedPercentage =
    summary.total > 0 ? (summary.used / summary.total) * 100 : 0;

  return (
    <article className="p-8 bg-white rounded-[32px] border border-gray-100 shadow-sm w-full flex flex-col flex-1 transition-all hover:shadow-md">
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
      <div className="flex flex-col gap-2 mb-[20px] flex-1">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[18px] font-bold text-gray-900">
            최근 신청 내역
          </span>
          <Button
            size="sm"
            text="더보기 >"
            onClick={handleMoreClick}
            className="bg-transparent hover:bg-transparent text-gray-400 hover:text-gray-600 px-0 w-auto"
          />
        </div>

        <div className="flex flex-col overflow-y-auto custom-scrollbar">
          {/* 최신 3개만 표시 */}
          {list.slice(0, 3).map((item: VacationItem) => (
            <LeaveHistoryItem
              key={item.id}
              startDate={item.startDate}
              type={item.type}
              timeRange={item.timeRange}
              status={item.status}
            />
          ))}
          {list.length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">
              신청 내역이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* 버튼 영역: mt-auto로 항상 최하단 고정 */}
      <div className="mt-auto">
        <Button text="신청하기" onClick={handleMoreClick} />
      </div>
    </article>
  );
}
