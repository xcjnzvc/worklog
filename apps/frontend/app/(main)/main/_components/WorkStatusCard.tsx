"use client";

import Button from "@/components/Button";
import Image from "next/image";

type StatusType = "BEFORE" | "WORKING" | "AFTER";

const STATUS_CONFIG = {
  BEFORE: {
    label: "출근 전",
    color: "text-[#22C55E]",
    dot: "bg-[#22C55E]",
  },
  WORKING: {
    label: "근무 중",
    color: "text-[#2357E5]",
    dot: "bg-[#2357E5]",
  },
  AFTER: {
    label: "퇴근 완료",
    color: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
};

export default function WorkStatusCard() {
  const status = "WORKING" as StatusType;
  const config = STATUS_CONFIG[status];

  const items = [
    {
      id: "work",
      icon: "/clock.svg",
      title: "출근 시간",
      time: "08:55:12",
      isActive: status === "BEFORE",
    },
    {
      id: "leave",
      icon: "/logout.svg",
      title: "퇴근 시간",
      time: "--:--:--",
      isActive: status === "WORKING",
    },
  ];

  const buttonText =
    status === "WORKING"
      ? "퇴근하기"
      : status === "BEFORE"
        ? "출근하기"
        : "업무 종료";

  const isButtonDisabled = status === "AFTER";

  return (
    /* h-fit을 추가하여 부모 Flex 컨테이너 내에서 높이가 강제로 늘어나는 것을 방지합니다. */
    <div className="p-[30px] bg-white rounded-[32px] shadow-sm border border-gray-100 w-full max-w-[380px] h-fit">
      {/* 상태 표시 헤더 */}
      <div className="flex items-center gap-[8px] font-bold mb-[10px]">
        <span className={`w-[12px] h-[12px] rounded-full ${config.dot}`} />
        <span className={`text-[14px] font-bold ${config.color}`}>
          {config.label}
        </span>
      </div>

      {/* 시간 표시 */}
      <div className="text-[40px] font-black tracking-tight text-gray-950">
        11:55:27
      </div>
      <div className="flex items-center text-[#666] text-[14px] gap-[4px] mt-[6px]">
        <Image src="/calendar.svg" alt="calendar" width={16} height={16} />
        2026년 12월 26일 목요일
      </div>

      {/* 출퇴근 시간 정보 영역 */}
      <div className="flex gap-[12px] mt-[30px] mb-[30px]">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex-1 px-[20px] py-[15px] rounded-[20px] border transition-all ${
              item.isActive
                ? "bg-[#F5F8FF] border-[#DDE7FF]"
                : "bg-gray-50 border-transparent"
            }`}
          >
            <div className="flex flex-col items-start gap-[6px] mb-[8px]">
              <Image src={item.icon} alt={item.title} width={16} height={16} />
              <span
                className={`text-[13px] font-bold ${item.isActive ? "text-[#2357E5]" : "text-[#666]"}`}
              >
                {item.title}
              </span>
            </div>
            <div className="text-[20px] font-black text-gray-900">
              {item.time}
            </div>
          </div>
        ))}
      </div>

      {/* 버튼 및 하단 가이드 */}
      <div className="flex flex-col gap-[20px] text-[14px]">
        <Button text={buttonText} disabled={isButtonDisabled} />
        <div className="flex justify-between items-center mt-[4px]">
          <div className="text-[#999] flex items-center gap-[6px]">
            <Image
              src="/exclamationmark-circle.svg"
              alt="info"
              width={16}
              height={16}
            />
            <span className="text-[13px]">출퇴근 기록에 오류가 있나요?</span>
          </div>
          <span className="text-[#0029C0] text-[13px] font-bold cursor-pointer hover:underline">
            근태 수정 요청
          </span>
        </div>
      </div>
    </div>
  );
}
