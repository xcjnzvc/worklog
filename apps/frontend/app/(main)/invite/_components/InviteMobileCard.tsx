"use client";

import { InviteMobileItem } from "@/types/invite";

interface InviteMobileCardProps {
  data: InviteMobileItem[];
  getStatusStyle: (status: string) => string;
  onResend?: (email: string, role: "ADMIN" | "USER") => void;
}

export const InviteMobileCard = ({
  data,
  getStatusStyle,
  onResend,
}: InviteMobileCardProps) => {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => (
        <div
          key={item.id}
          className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#707EAE]">
              {item.displayId}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-black ${getStatusStyle(item.status)}`}
            >
              {item.status === "ACCEPTED"
                ? "가입 완료"
                : item.status === "PENDING"
                  ? "대기 중"
                  : "기간 만료"}
            </span>
          </div>
          <div>
            <p className="text-xs text-[#A3AED0] mb-0.5">초대 대상 이메일</p>
            <p className="text-sm font-bold text-[#1B254B] break-all">
              {item.email}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-50 text-xs">
            <div>
              <span className="text-[#A3AED0] block mb-0.5">부여 유형</span>
              <span
                className={`font-extrabold ${item.role === "ADMIN" ? "text-[#0029C0]" : "text-[#FFB547]"}`}
              >
                {item.role === "ADMIN" ? "관리자" : "일반 직원"}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[#A3AED0] block mb-0.5">초대 일자</span>
              <span className="font-medium text-[#707EAE]">
                {item.createdAt}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[#A3AED0] block mb-0.5">만료 일자</span>
              <span className="font-medium text-[#707EAE]">
                {item.expiresAt}
              </span>
            </div>
          </div>
          {item.status === "EXPIRED" && (
            <button
              onClick={() => onResend?.(item.email, item.role)}
              className="w-full py-3 bg-[#4318FF] text-white text-xs font-black rounded-xl hover:bg-[#3311CC] transition-all shadow-md"
            >
              초대 재발송하기
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
