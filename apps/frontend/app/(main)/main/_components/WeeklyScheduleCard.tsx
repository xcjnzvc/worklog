// "use client";

// import UserProfileItem from "@/components/UserProfileItem";

// export const WEEKLY_MOCK_DATA = [
//   { date: 22, day: "일", color: "text-red-500", events: [] },
//   { date: 23, day: "월", events: [] },
//   { date: 24, day: "화", events: [] },
//   {
//     date: 25,
//     day: "수",
//     events: [
//       { label: "연차 3", bgColor: "bg-[#D6E4FF]", textColor: "text-[#0029C0]" },
//       { label: "회의 1", bgColor: "bg-[#FFF2E8]", textColor: "text-[#FA541C]" },
//       { label: "반차 2", bgColor: "bg-[#FFFBE6]", textColor: "text-[#FAAD14]" },
//     ],
//   },
//   { date: 26, day: "목", isToday: true, events: [] },
//   { date: 27, day: "금", events: [] },
//   { date: 28, day: "토", color: "text-blue-600", events: [] },
// ];

// export const VACATION_USERS = [
//   { name: "강수정", role: "프론트엔드" },
//   { name: "강수정", role: "디자이너" },
//   { name: "강수정", role: "디자이너" },
// ];

// export default function WeeklyScheduleCard() {
//   return (
//     <div className="bg-white rounded-[32px] border border-gray-100 p-[30px] flex gap-[30px] w-full shadow-sm">
//       {/* 1. 주간 스케줄 영역 */}
//       <div className="flex-grow">
//         <h2 className="text-[18px] font-bold text-gray-900 mb-6">
//           주간 스케줄
//         </h2>

//         {/* 날짜 컨트롤러 */}
//         <div className="flex items-center gap-4 mb-6">
//           <div className="flex gap-2">
//             <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
//               &lt;
//             </button>
//             <span className="text-[18px] font-bold">2026년 3월 4주</span>
//             <button className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400">
//               &gt;
//             </button>
//           </div>
//         </div>

//         {/* 7일 달력 영역 */}
//         <div className="flex gap-3 h-[280px]">
//           {WEEKLY_MOCK_DATA.map((item) => (
//             <div
//               key={item.date}
//               className={`relative flex-1 border rounded-[20px] flex flex-col items-center pt-6 pb-4 gap-3 transition-all
//                 ${
//                   item.isToday
//                     ? "border-[#0029C0] bg-[#F5F8FF]"
//                     : "border-gray-100 bg-white"
//                 }`}
//             >
//               {/* 오늘 표시 배지 */}
//               {item.isToday && (
//                 <div className="absolute -top-3 px-3 py-1 bg-[#0029C0] text-white text-[11px] font-bold rounded-full shadow-sm">
//                   오늘
//                 </div>
//               )}

//               {/* 요일 & 날짜 */}
//               <div className="flex flex-col items-center gap-1">
//                 <span
//                   className={`text-[14px] font-bold ${item.color || "text-gray-400"}`}
//                 >
//                   {item.day}
//                 </span>
//                 <span className="text-[22px] font-black text-gray-900">
//                   {item.date}
//                 </span>
//               </div>

//               {/* 이벤트 태그 리스트 */}
//               <div className="flex flex-col gap-1.5 w-full px-2">
//                 {item.events.map((event, idx) => (
//                   <div
//                     key={idx}
//                     className={`${event.bgColor} ${event.textColor} text-[12px] font-bold py-1.5 rounded-[8px] text-center`}
//                   >
//                     {event.label}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* 2. 오늘의 휴가자 영역 */}
//       <div className="w-[240px] bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col">
//         <h3 className="text-[16px] font-bold text-gray-900 mb-6">
//           오늘의 휴가자
//         </h3>

//         <div className="flex flex-col gap-5 flex-grow">
//           {VACATION_USERS.map((user, idx) => (
//             <UserProfileItem
//               key={idx}
//               name={user.name}
//               description={user.role}
//             />
//           ))}
//         </div>

//         {/* 추가 정보 버튼 */}
//         <button className="mt-4 w-full bg-white border border-gray-200 py-3 rounded-[16px] text-[14px] font-bold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
//           <span className="text-[18px]">+</span> 추가 정보 확인
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import UserProfileItem from "@/components/UserProfileItem";
import { Clock, Video, Users, MapPin } from "lucide-react";

// 1. 타입 정의
interface EventItem {
  label: string;
  bgColor: string;
  textColor: string;
}

interface WeeklyData {
  date: number;
  day: string;
  color?: string;
  isToday?: boolean;
  events: EventItem[];
}

interface VacationUser {
  name: string;
  role: string;
}

interface MeetingItem {
  title: string;
  time: string;
  location: string;
  isOnline: boolean;
}

interface DayDetail {
  vacations: VacationUser[];
  meetings: MeetingItem[];
}

// 2. Mock Data에 타입 적용
export const WEEKLY_MOCK_DATA: WeeklyData[] = [
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

const DAILY_DETAILS: Record<number, DayDetail> = {
  25: {
    vacations: [{ name: "김철수", role: "기획팀" }],
    meetings: [
      {
        title: "주간 정기 회의",
        time: "10:00 - 11:00",
        location: "회의실 A",
        isOnline: false,
      },
    ],
  },
  26: {
    vacations: [
      { name: "강수정", role: "프론트엔드" },
      { name: "강수정", role: "디자이너" },
      { name: "강수정", role: "디자이너" },
    ],
    meetings: [
      {
        title: "프론트 기획 리뷰",
        time: "13:00 - 14:00",
        location: "Google Meet",
        isOnline: true,
      },
      {
        title: "디자인 싱크 세션",
        time: "15:30 - 16:30",
        location: "회의실 B",
        isOnline: false,
      },
    ],
  },
};

export default function WeeklyScheduleCard() {
  const [selectedDate, setSelectedDate] = useState<number>(26);

  // 데이터가 없을 경우를 대비한 기본값 설정
  const currentDetail: DayDetail = DAILY_DETAILS[selectedDate] || {
    vacations: [],
    meetings: [],
  };

  return (
    <div className="bg-white rounded-[32px] border border-gray-100 p-[30px] w-full shadow-sm">
      <h2 className="text-[18px] font-bold text-gray-900 mb-6 px-1 font-sans">
        주간 스케줄
      </h2>

      {/* 날짜 컨트롤러 */}
      <div className="flex items-center gap-4 mb-6 px-1">
        <div className="flex items-center gap-3">
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 text-lg">
            &lt;
          </button>
          <span className="text-[18px] font-bold">2026년 3월 4주</span>
          <button className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400 text-lg">
            &gt;
          </button>
        </div>
      </div>

      {/* 7일 달력 영역 */}
      <div className="flex gap-3 mb-[30px]">
        {WEEKLY_MOCK_DATA.map((item) => (
          <button
            key={item.date}
            onClick={() => setSelectedDate(item.date)}
            className={`relative flex-1 border rounded-[20px] flex flex-col items-center pt-6 pb-4 gap-3 transition-all
              ${selectedDate === item.date ? "border-[#0029C0] bg-[#F5F8FF] ring-1 ring-[#0029C0]" : "border-gray-100 bg-white hover:border-gray-300"}`}
          >
            {item.isToday && (
              <div className="absolute -top-3 px-3 py-1 bg-[#0029C0] text-white text-[11px] font-bold rounded-full shadow-sm">
                오늘
              </div>
            )}
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
            <div className="flex flex-col gap-1 w-full px-2 mt-auto">
              {item.events.map((event, idx) => (
                <div
                  key={idx}
                  className={`${event.bgColor} ${event.textColor} text-[10px] font-bold py-1 rounded-[6px] text-center`}
                >
                  {event.label}
                </div>
              ))}
            </div>
          </button>
        ))}
      </div>

      {/* 하단 상세 섹션 */}
      <div className="grid grid-cols-2 gap-[30px]">
        {/* 오늘의 휴가자 영역 */}
        <div className="bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
              <Users size={18} className="text-blue-600" /> 휴가자
            </h3>
            <span className="text-blue-600 font-bold text-xs">
              {currentDetail.vacations.length}명
            </span>
          </div>
          <div className="flex flex-col gap-5 flex-grow min-h-[160px]">
            {currentDetail.vacations.length > 0 ? (
              currentDetail.vacations.map((user, idx) => (
                <UserProfileItem
                  key={idx}
                  name={user.name}
                  description={user.role}
                />
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-10 italic font-sans">
                휴가자가 없습니다.
              </p>
            )}
          </div>
          <button className="mt-4 w-full bg-white border border-gray-200 py-3 rounded-[16px] text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 shadow-sm font-sans">
            <span className="text-[18px]">+</span> 추가 정보 확인
          </button>
        </div>

        {/* 회의 일정 영역 */}
        <div className="bg-[#F8FAFC] rounded-[24px] p-6 flex flex-col border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-bold text-gray-900 flex items-center gap-2">
              <Clock size={18} className="text-orange-500" /> 회의 일정
            </h3>
            <span className="text-orange-500 font-bold text-xs">
              {currentDetail.meetings.length}건
            </span>
          </div>
          <div className="flex flex-col gap-3 flex-grow min-h-[160px]">
            {currentDetail.meetings.length > 0 ? (
              currentDetail.meetings.map((meeting, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-[16px] border border-gray-100 shadow-sm group cursor-pointer hover:border-orange-200 transition-all font-sans"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-orange-50 text-orange-600 text-[11px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <Clock size={12} /> {meeting.time.split(" - ")[0]}
                    </span>
                    <h4 className="text-[14px] font-bold text-gray-800 flex-1 truncate">
                      {meeting.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-gray-400 ml-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {meeting.location}
                    </span>
                    <span
                      className={
                        meeting.isOnline
                          ? "text-blue-500 font-bold"
                          : "text-emerald-500 font-bold"
                      }
                    >
                      {meeting.isOnline ? "비대면" : "대면"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-10 italic font-sans">
                예정된 일정이 없습니다.
              </p>
            )}
          </div>
          <button className="mt-4 w-full bg-white border border-gray-200 py-3 rounded-[16px] text-[13px] font-bold text-gray-500 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1 shadow-sm font-sans">
            <span className="text-[18px]">+</span> 전체 회의실 예약
          </button>
        </div>
      </div>
    </div>
  );
}
