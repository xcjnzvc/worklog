"use client";

import { VacationData } from "@/types/vacation";

export interface VacationTableRow extends VacationData {
  formattedPeriod: string;
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
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left min-w-[1000px] border-separate border-spacing-y-4">
        <thead>
          <tr className="bg-transparent">
            {[
              "번호",
              "유형",
              "시간",
              "내용",
              "휴가 기간",
              "일수",
              "상태",
              "승인자",
            ].map((head, idx) => (
              <th
                key={idx}
                className="px-8 py-2 text-[13px] font-bold text-[#A3AED0] uppercase tracking-wider first:pl-10"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onItemClick(item)}
              className="group bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <td className="px-8 py-6 first:rounded-l-[24px] text-sm font-bold text-[#707EAE] first:pl-10 border-y border-l border-transparent group-hover:border-[#F4F7FE]">
                {item.displayId}
              </td>
              <td className="px-6 py-6 text-[15px] font-extrabold border-y border-transparent group-hover:border-[#F4F7FE]">
                <span
                  className={
                    item.type === "ANNUAL" ? "text-[#4318FF]" : "text-[#FFB547]"
                  }
                >
                  {item.type === "ANNUAL" ? "연차" : "반차"}
                </span>
              </td>
              <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent group-hover:border-[#F4F7FE]">
                {item.timeDetail || "종일"}
              </td>
              <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent group-hover:border-[#F4F7FE] group-hover:text-[#4318FF]">
                {item.reason}
              </td>
              <td className="px-6 py-6 text-sm font-medium text-[#707EAE] border-y border-transparent group-hover:border-[#F4F7FE]">
                {item.formattedPeriod}
              </td>
              <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent group-hover:border-[#F4F7FE]">
                {item.durationText}
              </td>
              <td className="px-6 py-6 border-y border-transparent group-hover:border-[#F4F7FE] text-center">
                <span
                  className={`px-4 py-1.5 rounded-full text-[12px] font-black ${getStatusStyle(item.status)}`}
                >
                  {item.status === "APPROVED"
                    ? "승인 완료"
                    : item.status === "PENDING"
                      ? "승인 대기"
                      : "반려됨"}
                </span>
              </td>
              <td className="px-6 py-6 last:rounded-r-[24px] text-sm font-bold text-[#1B254B] border-y border-r border-transparent group-hover:border-[#F4F7FE] text-center last:pr-10">
                {item.approver || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
