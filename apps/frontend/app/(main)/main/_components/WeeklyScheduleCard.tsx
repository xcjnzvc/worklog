"use client";

import UserProfileItem from "@/components/UserProfileItem";

export const WEEKLY_MOCK_DATA = [
  { date: 22, day: "일", color: "text-red-500", events: [] },
  { date: 23, day: "월", events: [] },
  { date: 24, day: "화", events: [] },
  {
    date: 25,
    day: "수",
    events: [
      { label: "연차 3", bgColor: "bg-[#D6E4FF]", textColor: "text-[#0029C0]" },
      { label: "회의 1", bgColor: "bg-[#FFF2E8]", textColor: "text-[#FA541C]" },
      { label: "반차 2", bgColor: "bg-[#FFFBE6]", textColor: "text-[#FAAD14]" },
    ],
  },
  { date: 26, day: "목", isToday: true, events: [] },
  { date: 27, day: "금", events: [] },
  { date: 28, day: "토", color: "text-blue-600", events: [] },
];

export const VACATION_USERS = [
  { name: "강수정", role: "프론트엔드" },
  { name: "강수정", role: "디자이너" },
  { name: "강수정", role: "디자이너" },
];

export default function WeeklyScheduleCard() {
  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-[30px] flex gap-[30px] w-full shadow-sm">
      {/* 1. 주간 스케줄 영역 */}
      <div className="flex-grow">
        <h2 className="text-[18px] font-bold text-gray-900 mb-6">
          주간 스케줄
        </h2>

        {/* 날짜 컨트롤러 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
              &lt;
            </button>
            <span className="text-[18px] font-bold">2026년 3월 4주</span>
            <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
              &gt;
            </button>
          </div>
        </div>

        {/* 7일 달력 영역 */}
        <div className="flex gap-3 h-[280px]">
          {WEEKLY_MOCK_DATA.map((item) => (
            <div
              key={item.date}
              className={`relative flex-1 border rounded-[20px] flex flex-col items-center pt-6 pb-4 gap-3 transition-all
                ${
                  item.isToday
                    ? "border-[#0029C0] bg-[#F5F8FF]"
                    : "border-gray-100 bg-white"
                }`}
            >
              {/* 오늘 표시 배지 */}
              {item.isToday && (
                <div className="absolute -top-3 px-3 py-1 bg-[#0029C0] text-white text-[11px] font-bold rounded-full shadow-sm">
                  오늘
                </div>
              )}

              {/* 요일 & 날짜 */}
              <div className="flex flex-col items-center gap-1">
                <span
                  className={`text-[14px] font-bold ${item.color || "text-gray-400"}`}
                >
                  {item.day}
                </span>
                <span className="text-[22px] font-black text-gray-900">
                  {item.date}
                </span>
              </div>

              {/* 이벤트 태그 리스트 */}
              <div className="flex flex-col gap-1.5 w-full px-2">
                {item.events.map((event, idx) => (
                  <div
                    key={idx}
                    className={`${event.bgColor} ${event.textColor} text-[12px] font-bold py-1.5 rounded-[8px] text-center`}
                  >
                    {event.label}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. 오늘의 휴가자 영역 */}
      <div className="w-[240px] bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col">
        <h3 className="text-[16px] font-bold text-gray-900 mb-6">
          오늘의 휴가자
        </h3>

        <div className="flex flex-col gap-5 flex-grow">
          {VACATION_USERS.map((user, idx) => (
            <UserProfileItem
              key={idx}
              name={user.name}
              description={user.role}
            />
          ))}
        </div>

        {/* 추가 정보 버튼 */}
        <button className="mt-4 w-full bg-white border border-gray-200 py-3 rounded-[16px] text-[14px] font-bold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
          <span className="text-[18px]">+</span> 추가 정보 확인
        </button>
      </div>
    </div>
  );
}
