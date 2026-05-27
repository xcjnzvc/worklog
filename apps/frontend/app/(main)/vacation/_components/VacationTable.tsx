"use client";

import { VacationData, VacationTableRow } from "@/types/vacation";
import { VacationMobileCard } from "./Vacationmobilecard";

interface VacationTableProps {
  data: VacationTableRow[];
  onItemClick: (item: VacationData) => void;
}

export const VacationTable = ({ data, onItemClick }: VacationTableProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-[#EFFFF6] text-[#05CD99]";
      case "PENDING":
        return "bg-[#FFF8E7] text-[#FFA800]";
      case "REJECTED":
        return "bg-[#FFEEF2] text-[#EE5D50]";
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  return (
    <>
      {/* ── 1. 모바일: 앱 카드 UI (md 미만 / ~767px) ── */}
      <div className="md:hidden">
        <VacationMobileCard
          data={data.map((item) => ({
            ...item,
            displayId: `NO. ${item.displayId}`,
          }))}
          onItemClick={onItemClick}
        />
      </div>

      {/* ── 2. 태블릿/데스크탑: 테이블 (md 이상 / 768px~) ── */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* 1. table에 table-fixed 추가 (열 너비 강제 고정) */}
        <table className="w-full min-w-[700px] lg:min-w-[800px] border-collapse table-fixed">
          <thead>
            <tr className="border-b border-gray-100">
              {/* 2. 각 th에 너비(w-[...])를 명확히 지정하여 열 간격을 고정 */}
              <th className="w-[8%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                번호
              </th>
              <th className="w-[10%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                유형
              </th>
              <th className="hidden lg:table-cell w-[10%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                시간
              </th>
              <th className="w-[20%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                내용
              </th>
              <th className="w-[20%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                휴가 기간
              </th>
              <th className="w-[10%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                일수
              </th>
              <th className="w-[12%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                상태
              </th>
              <th className="hidden lg:table-cell w-[10%] px-2 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                승인자
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="group cursor-pointer border-b border-gray-50 bg-white hover:bg-[#F7F9FF]"
              >
                {/* 모든 td에 text-center를 주되, 텍스트가 아닌 경우 아래처럼 수정 */}
                <td className="px-2 py-5 text-sm font-bold text-[#707EAE] text-center">
                  {item.displayId}
                </td>
                <td className="px-2 py-5 text-center">
                  <span
                    className={`font-extrabold ${item.type === "ANNUAL" ? "text-[#4318FF]" : "text-[#FFB547]"}`}
                  >
                    {item.type === "ANNUAL" ? "연차" : "반차"}
                  </span>
                </td>
                <td className="hidden lg:table-cell px-2 py-5 text-sm font-bold text-[#1B254B] text-center">
                  {item.timeDetail || "종일"}
                </td>
                <td className="px-2 py-5 text-sm font-bold text-[#1B254B] text-center truncate">
                  {item.reason}
                </td>
                <td className="px-2 py-5 text-sm font-medium text-[#707EAE] text-center">
                  {item.formattedPeriod}
                </td>
                <td className="px-2 py-5 text-sm font-bold text-[#1B254B] text-center">
                  {item.durationText}
                </td>

                {/* 3. 상태(Status) 열: flex를 제거하고 text-center만 적용 */}
                <td className="px-2 py-5 text-center">
                  <span
                    className={`px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
                  >
                    {item.status === "APPROVED"
                      ? "승인 완료"
                      : item.status === "PENDING"
                        ? "승인 대기"
                        : "반려됨"}
                  </span>
                </td>

                {/* 4. 승인자 열: flex를 썼다면 items-center justify-center를 잊지 마세요 */}
                <td className="hidden lg:table-cell px-2 py-5 text-center">
                  <span className="text-sm font-bold text-[#1B254B]">
                    {item.approver || "미정"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
