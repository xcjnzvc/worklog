"use client";

import { VacationData } from "@/types/vacation";
import { VacationMobileCard } from "./Vacationmobilecard";

export interface VacationTableRow extends VacationData {
  formattedPeriod: string;
  approverPosition?: string;
}

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
        {/* 💡 모바일 전용 카드 카드 컴포넌트 내부에서 NO. 가 붙을 수 있도록 데이터를 그대로 전달하거나, 
            만약 VacationMobileCard가 내부에서 item.displayId를 그대로 쓰고 있다면 아래처럼 데이터를 가공해서 넘겨주는 방법이 가장 확실합니다. */}
        <VacationMobileCard
          data={data.map((item) => ({
            ...item,
            displayId: `NO. ${item.displayId}`, // 모바일일 때만 앞에 NO. 를 붙여서 주입
          }))}
          onItemClick={onItemClick}
        />
      </div>

      {/* ── 2. 태블릿/데스크탑: 테이블 (md 이상 / 768px~) ── */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <table className="w-full min-w-[700px] lg:min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              {/* 태블릿/PC 전용 '번호' 타이틀 헤더 */}
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left first:pl-10">
                번호
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                유형
              </th>
              <th className="hidden lg:table-cell px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                시간
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                내용
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                휴가 기간
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                일수
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                상태
              </th>
              <th className="hidden lg:table-cell px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
                승인자
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-20 text-center text-[#A3AED0]">
                  휴가 내역이 없습니다.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onItemClick(item)}
                  className="group transition-colors duration-200 cursor-pointer border-b border-gray-50 last:border-none bg-white hover:bg-[#F7F9FF]"
                >
                  {/* 💡 PC/태블릿 뷰에서는 NO.를 빼고 순수 숫자(예: 001)만 깔끔하게 노출 */}
                  <td className="px-6 py-5 text-sm font-bold text-[#707EAE] first:pl-10 text-left">
                    {item.displayId}
                  </td>

                  {/* 유형 */}
                  <td className="px-6 py-5 text-[15px] font-extrabold text-left">
                    <span
                      className={
                        item.type === "ANNUAL"
                          ? "text-[#4318FF]"
                          : "text-[#FFB547]"
                      }
                    >
                      {item.type === "ANNUAL" ? "연차" : "반차"}
                    </span>
                  </td>

                  {/* 시간 */}
                  <td className="hidden lg:table-cell px-6 py-5 text-sm font-bold text-[#1B254B] text-left">
                    {item.timeDetail || "종일"}
                  </td>

                  {/* 내용 */}
                  <td className="px-6 py-5 text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF] text-left">
                    {item.reason}
                  </td>

                  {/* 휴가 기간 */}
                  <td className="px-6 py-5 text-sm font-medium text-[#707EAE] text-left">
                    {item.formattedPeriod}
                  </td>

                  {/* 일수 */}
                  <td className="px-6 py-5 text-sm font-bold text-[#1B254B] text-left">
                    {item.durationText}
                  </td>

                  {/* 상태 */}
                  <td className="px-6 py-5 text-left">
                    <span
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
                    >
                      {item.status === "APPROVED"
                        ? "승인 완료"
                        : item.status === "PENDING"
                          ? "승인 대기"
                          : "반려됨"}
                    </span>
                  </td>

                  {/* 승인자 */}
                  <td className="hidden lg:table-cell px-6 py-5 text-left last:pr-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-[#1B254B]">
                        {item.approver || "미정"}
                      </span>
                      {item.approver && (
                        <span className="text-[12px] font-medium text-[#A3AED0]">
                          ({item.approverPosition || "팀장"})
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
