"use client";

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
      <table className="w-full min-w-[700px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left pl-10">
              번호
            </th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
              신청자
            </th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
              직급
            </th>
            <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
              유형
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
            <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-left">
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
                <td className="px-6 py-5 text-sm font-bold text-[#707EAE] pl-10">
                  {String(index + 1).padStart(3, "0")}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-[#1B254B]">
                  {item.applicant.name}
                </td>
                <td className="px-6 py-5 text-sm text-[#707EAE]">
                  {item.applicant.position || "-"}
                </td>
                <td className="px-6 py-5 text-[15px] font-extrabold">
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
                <td className="px-6 py-5 text-sm text-[#707EAE]">
                  {item.startDate === item.endDate
                    ? item.startDate
                    : `${item.startDate} - ${item.endDate}`}
                </td>
                <td className="px-6 py-5 text-sm font-bold text-[#1B254B]">
                  {item.durationText}
                </td>
                <td className="px-6 py-5">
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
                <td className="px-6 py-5">
                  {item.status === "PENDING" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onApprove(item.id)}
                        className="px-4 py-1.5 bg-[#0029C0] text-white rounded-lg text-sm font-bold hover:bg-[#002094] transition-colors"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => onReject(item.id)}
                        className="px-4 py-1.5 bg-white text-[#EE5D50] border border-[#EE5D50] rounded-lg text-sm font-bold hover:bg-[#FFEEF2] transition-colors"
                      >
                        반려
                      </button>
                    </div>
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
