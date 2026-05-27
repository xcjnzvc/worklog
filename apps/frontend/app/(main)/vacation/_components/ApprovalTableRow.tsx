"use client";

import { ApprovalActionButtons } from "@/components/ApprovalActionButtons";
import { ApprovalItem } from "@/types/vacation";

interface ApprovalTableProps {
  data: ApprovalItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

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

export const ApprovalTable = ({
  data,
  onApprove,
  onReject,
}: ApprovalTableProps) => {
  return (
    <div className="overflow-x-auto">
      {/* table-fixed를 사용하여 컬럼 너비를 고정하고 정렬을 유지합니다 */}
      <table className="w-full min-w-[700px] border-collapse table-fixed">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="w-[8%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              번호
            </th>
            <th className="w-[12%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              신청자
            </th>
            <th className="w-[10%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              직급
            </th>
            <th className="w-[10%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              유형
            </th>
            <th className="w-[20%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              휴가 기간
            </th>
            <th className="w-[10%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              일수
            </th>
            <th className="w-[12%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              상태
            </th>
            <th className="w-[18%] py-4 text-[13px] font-bold text-[#A3AED0] text-center">
              처리
            </th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-20 text-center text-[#A3AED0]">
                승인 대기 중인 휴가가 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-50 last:border-none bg-white hover:bg-[#F7F9FF] transition-colors"
              >
                {/* 각 셀에 text-center를 적용하여 가운데 정렬 */}
                <td className="py-5 text-sm font-bold text-[#707EAE] text-center">
                  {String(index + 1).padStart(3, "0")}
                </td>
                <td className="py-5 text-sm font-bold text-[#1B254B] text-center">
                  {item.applicant.name}
                </td>
                <td className="py-5 text-sm text-[#707EAE] text-center">
                  {item.applicant.position || "-"}
                </td>
                <td className="py-5 text-[15px] font-extrabold text-center">
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
                <td className="py-5 text-sm text-[#707EAE] text-center">
                  {item.startDate === item.endDate
                    ? item.startDate
                    : `${item.startDate} - ${item.endDate}`}
                </td>
                <td className="py-5 text-sm font-bold text-[#1B254B] text-center">
                  {item.durationText}
                </td>
                <td className="py-5 text-center">
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
                <td className="py-5 text-center">
                  {item.status === "PENDING" && (
                    <ApprovalActionButtons
                      onApprove={() => onApprove(item.id)}
                      onReject={() => onReject(item.id)}
                    />
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
