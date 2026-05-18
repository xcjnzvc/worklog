"use client";

import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { VacationTableRow } from "./VacationTable";
import { VacationData } from "@/types/vacation";

interface VacationMobileCardProps {
  data: VacationTableRow[];
  onItemClick: (item: VacationData) => void;
}

export const VacationMobileCard = ({
  data,
  onItemClick,
}: VacationMobileCardProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          bg: "bg-[#E6F8F1]",
          text: "text-[#10B981]",
          icon: CheckCircle2,
          iconColor: "#10B981",
        };
      case "REJECTED":
        return {
          bg: "bg-[#FFF1F2]",
          text: "text-[#F43F5E]",
          icon: XCircle,
          iconColor: "#F43F5E",
        };
      case "PENDING":
        return {
          bg: "bg-[#FFF4E5]",
          text: "text-[#EA580C]",
          icon: AlertCircle,
          iconColor: "#EA580C",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-500",
          icon: AlertCircle,
          iconColor: "#9CA3AF",
        };
    }
  };

  const getTypeStyle = (type: string) => {
    return type === "ANNUAL"
      ? {
          iconBg: "#E0EDFF",
          iconColor: "#2357E5",
          icon: Calendar,
          label: "연차",
        }
      : { iconBg: "#FFF9E5", iconColor: "#F59E0B", icon: Clock, label: "반차" };
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "승인 완료";
      case "REJECTED":
        return "승인 반려";
      case "PENDING":
        return "승인 대기";
      default:
        return "처리 중";
    }
  };

  if (data.length === 0) {
    return (
      <div className="py-20 text-center text-[#A3AED0]">
        휴가 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => {
        const statusStyle = getStatusStyle(item.status);
        const typeStyle = getTypeStyle(item.type);
        const StatusIcon = statusStyle.icon;
        const TypeIcon = typeStyle.icon;

        return (
          <div
            key={item.id}
            onClick={() => onItemClick(item)}
            className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 cursor-pointer active:scale-[0.99] transition-transform"
          >
            {/* 번호 */}
            <p className="text-gray-400 font-bold text-[13px] mb-4">
              {item.displayId}
            </p>

            {/* 중단: 아이콘 + 유형/날짜 + 일수 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* 타입 아이콘 */}
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: typeStyle.iconBg }}
                >
                  <TypeIcon size={26} color={typeStyle.iconColor} />
                </div>

                {/* 유형 + 날짜 */}
                <div>
                  <p className="text-gray-400 font-bold text-[14px] mb-1">
                    {typeStyle.label}
                  </p>
                  <p className="text-gray-900 font-black text-[17px]">
                    {item.formattedPeriod}
                  </p>
                </div>
              </div>

              {/* 일수 */}
              <div className="text-right">
                <p className="text-gray-900 font-black text-[22px] leading-none">
                  {item.durationText}
                </p>
                <p className="text-gray-300 font-black text-[10px] tracking-widest mt-1">
                  DAYS
                </p>
              </div>
            </div>

            {/* 하단: 상태 배지 */}
            <div
              className={`flex items-center justify-center py-3 rounded-2xl gap-2 ${statusStyle.bg}`}
            >
              <StatusIcon size={18} color={statusStyle.iconColor} />
              <span className={`font-bold text-[15px] ${statusStyle.text}`}>
                {getStatusLabel(item.status)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
