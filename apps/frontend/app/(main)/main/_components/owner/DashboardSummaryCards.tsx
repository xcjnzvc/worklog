"use client";

import { CheckSquare, AlarmClock, ClipboardList } from "lucide-react";

interface DashboardSummaryCardsProps {
  onAttendanceClick: () => void;
  onLateAbsentClick: () => void;
  onPendingApprovalClick: () => void;
}

export default function DashboardSummaryCards({
  onAttendanceClick,
  onLateAbsentClick,
  onPendingApprovalClick,
}: DashboardSummaryCardsProps) {
  const cardData = [
    {
      title: "오늘 출근률",
      val: "75%",
      sub: "18명 출근 / 전체 24명",
      icon: <CheckSquare className="text-green-500" size={18} />,
      hover: "hover:border-emerald-200",
      onClick: onAttendanceClick,
      hint: null,
    },
    {
      title: "이번 달 지각·결근률",
      val: "5.8%",
      sub: "지각 4.2% · 결근 1.6%",
      icon: <AlarmClock className="text-red-500" size={18} />,
      hover: "hover:border-rose-200",
      onClick: onLateAbsentClick,
      hint: null,
    },
    {
      title: "미처리 승인",
      val: "17건",
      sub: "휴가 12건 · 근태정정 5건",
      icon: <ClipboardList className="text-orange-500" size={18} />,
      hover: "hover:border-amber-200",
      onClick: onPendingApprovalClick,
      hint: "↓ 운영 액션 센터에서 처리하기",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {cardData.map((card, i) => (
        <div
          key={i}
          onClick={card.onClick}
          className={`bg-white px-6 py-2 min-h-[160px] rounded-3xl border border-gray-100 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md flex flex-col justify-center ${card.hover}`}
        >
          {/* 타이틀과 아이콘 행 */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-[16px] font-bold text-gray-400 uppercase tracking-wide">
              {card.title}
            </span>
            <div className="p-1.5 bg-gray-50 rounded-xl flex items-center justify-center">
              {card.icon}
            </div>
          </div>

          {/* 메인 수치 */}
          <div className="text-4xl font-black text-[#0029C0] leading-none">
            {card.val}
          </div>

          {/* 서브 설명 */}
          <div className="text-[13px] font-medium text-gray-400 mt-2.5">
            {card.sub}
          </div>

          {/* 하단 힌트 */}
          {card.hint && (
            <p className="text-[12px] font-bold text-orange-400 mt-2">
              {card.hint}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
