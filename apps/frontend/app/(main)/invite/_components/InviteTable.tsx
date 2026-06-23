"use client";

import Button from "@/components/Button";
import { InviteMobileCard } from "./InviteMobileCard";
import { InviteHistoryItem } from "@/types/invite";

interface InviteTableProps {
  data: InviteHistoryItem[];
  onResend?: (email: string, role: "ADMIN" | "USER") => void;
}

export const InviteTable = ({ data, onResend }: InviteTableProps) => {
  console.log("InviteTable에서 받은 데이터:", data);
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-[#EFFFF6] text-[#05CD99]";
      case "PENDING":
        return "bg-[#FFF8E7] text-[#FFA800]";
      case "EXPIRED":
        return "bg-[#FFEEF2] text-[#EE5D50]";
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  return (
    <>
      <div className="md:hidden">
        {data.length === 0 ? (
          <div className="bg-white rounded-[24px] py-16 text-center text-[#A3AED0] text-sm font-medium border border-gray-100">
            초대 내역이 존재하지 않습니다.
          </div>
        ) : (
          <InviteMobileCard
            data={data.map((item) => ({
              ...item,
              displayId: `NO. ${item.displayId}`,
            }))}
            getStatusStyle={getStatusStyle}
            onResend={onResend}
          />
        )}
      </div>

      <div className="hidden md:block overflow-x-auto scrollbar-hide bg-white rounded-[30px]">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                번호
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                초대 대상 이메일
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                부여 유형
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                초대 일자
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                초대 상태
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                만료 일자
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-20 text-center text-[#A3AED0] font-medium text-sm"
                >
                  초대 내역이 존재하지 않습니다.
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  className="group transition-colors duration-200 border-b border-gray-50 bg-white hover:bg-[#F7F9FF]"
                >
                  <td className="px-6 py-5 text-sm font-bold text-[#707EAE] text-center">
                    {item.displayId}
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-[#1B254B] group-hover:text-[#0029C0] text-center">
                    {item.email}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        item.role === "ADMIN"
                          ? "text-[#0029C0]"
                          : "text-[#707EAE]"
                      }`}
                    >
                      {item.role === "ADMIN" ? "관리자" : "일반 직원"}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-[#707EAE] text-center">
                    {item.createdAt}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
                    >
                      {item.status === "ACCEPTED"
                        ? "가입 완료"
                        : item.status === "PENDING"
                          ? "대기 중"
                          : item.status === "EXPIRED"
                            ? "기간 만료"
                            : item.status}{" "}
                      {/* 상태값이 정해진 게 아닐 경우 실제 값을 보여주어 디버깅 가능하게 함 */}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-[#707EAE] text-center">
                    {item.expiresAt}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {item.status === "EXPIRED" ? (
                      <Button
                        size="sm"
                        text="재발송"
                        onClick={() => onResend?.(item.email, item.role)}
                        className="bg-[#F4F7FE] text-[#4318FF] border border-[#4318FF]/20 hover:bg-[#E8EDFF]"
                      />
                    ) : (
                      <span className="text-[#A3AED0] text-[12px]">-</span>
                    )}
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
