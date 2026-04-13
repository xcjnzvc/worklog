"use client";

import { CalendarClock, FileEdit, Home, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActionCard() {
  const router = useRouter();

  const actions = [
    {
      label: "근태 수정 요청",
      desc: "출퇴근 기록 누락 수정",
      icon: CalendarClock,
      color: "text-orange-500 bg-orange-50",
      path: "/attendance/edit",
    },
    {
      label: "연차/휴가 신청",
      desc: "연차, 반차, 경조사 등 신청",
      icon: FileEdit,
      color: "text-blue-600 bg-blue-50",
      path: "/leave/apply",
    },
    {
      label: "재택 근무 신청",
      desc: "원격 업무 승인 요청",
      icon: Home,
      color: "text-purple-500 bg-purple-50",
      path: "/remote-work",
    },
    // {
    //   label: "재택 근무 신청",
    //   desc: "원격 업무 승인 요청",
    //   icon: Home,
    //   color: "text-purple-500 bg-purple-50",
    //   path: "/remote-work",
    // },
  ];

  return (
    <article className="bg-white rounded-[32px] border border-gray-100 p-[30px] shadow-sm">
      <h3 className="font-bold text-[18px] text-gray-950 mb-6 font-sans">
        빠른 액션
      </h3>
      <div className="flex flex-col gap-3 text-center">
        {actions.map((action, i) => (
          <button
            key={i}
            onClick={() => router.push(action.path)}
            className="flex items-center w-full p-4 rounded-[20px] bg-white border border-gray-50 hover:border-blue-100 hover:shadow-md transition-all group"
          >
            <div
              className={`p-3 rounded-[12px] mr-4 ${action.color} group-hover:scale-110 transition-transform`}
            >
              <action.icon size={20} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-[14px] font-bold text-gray-800">
                {action.label}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{action.desc}</p>
            </div>
            <ChevronRight
              size={16}
              className="text-gray-300 group-hover:text-blue-600 transition-colors"
            />
          </button>
        ))}
        <span className="text-[13px] text-[#666] mt-[30px]">
          메뉴 설정에서 빠른 액션 항목을 변경할 수있습니다.
        </span>
      </div>
    </article>
  );
}
