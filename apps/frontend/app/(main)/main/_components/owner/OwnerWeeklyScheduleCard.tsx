"use client";

import React from "react";

interface OwnerEvent {
  label: string;
  color: string;
}

export interface OwnerDailySchedule {
  day: string;
  date: string;
  isToday: boolean;
  events: OwnerEvent[];
}

interface OwnerWeeklyScheduleCardProps {
  weekLabel?: string;
  scheduleData?: OwnerDailySchedule[];
}

// [하위 컴포넌트] OWNER 전용 일정의 가로 한 줄 (텍스트 스케일 업 및 간격 최적화)
function OwnerScheduleRow({ item }: { item: OwnerDailySchedule }) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${
        item.isToday
          ? "bg-blue-50/40 border border-blue-100/60"
          : "hover:bg-gray-50/50 border border-transparent"
      }`}
    >
      {/* 날짜 및 오늘 표시 뱃지 공간 확대 */}
      <div className="w-12 shrink-0 text-center flex flex-col items-center justify-center">
        {/* 요일: text-[10px] -> text-xs */}
        <p
          className={`text-xs font-bold ${item.isToday ? "text-blue-600" : "text-gray-400"}`}
        >
          {item.day}
        </p>
        {/* 날짜: text-sm -> text-base */}
        <p
          className={`text-base font-black mt-0.5 ${item.isToday ? "text-blue-800" : "text-gray-700"}`}
        >
          {item.date}
        </p>
        {/* 오늘 뱃지: text-[8px] -> text-[10px] */}
        {item.isToday && (
          <span className="inline-block text-[10px] bg-blue-600 text-white font-black px-1.5 py-0.5 rounded-md mt-1 shadow-sm">
            오늘
          </span>
        )}
      </div>

      {/* 이벤트 리스트 또는 일정 없음 */}
      <div className="flex flex-wrap gap-1.5 flex-1 items-center">
        {item.events.length > 0 ? (
          item.events.map((ev, i) => (
            /* 이벤트 태그: text-[10px] -> text-xs / 패딩 살짝 확대 */
            <span
              key={i}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border shadow-sm ${ev.color}`}
            >
              {ev.label}
            </span>
          ))
        ) : (
          /* 일정 없음: text-[10px] -> text-xs */
          <span className="text-xs font-semibold text-gray-300 italic pl-1">
            일정 없음
          </span>
        )}
      </div>
    </div>
  );
}

// [메인 컴포넌트] OWNER 전용 이번 주 일정 카드
export default function OwnerWeeklyScheduleCard({
  weekLabel = "5월 3주차",
  scheduleData = [
    {
      day: "월",
      date: "5/19",
      isToday: false,
      events: [
        {
          label: "홍길동 연차",
          color: "bg-blue-50 text-blue-700 border-blue-100",
        },
        {
          label: "전사 회의 10:00",
          color: "bg-purple-50 text-purple-700 border-purple-100",
        },
      ],
    },
    {
      day: "화",
      date: "5/20",
      isToday: true,
      events: [
        {
          label: "김철수 반차",
          color: "bg-amber-50 text-amber-700 border-amber-100",
        },
      ],
    },
    {
      day: "수",
      date: "5/21",
      isToday: false,
      events: [
        {
          label: "개발팀 스프린트",
          color: "bg-emerald-50 text-emerald-700 border-emerald-100",
        },
      ],
    },
    { day: "목", date: "5/22", isToday: false, events: [] },
    {
      day: "금",
      date: "5/23",
      isToday: false,
      events: [
        {
          label: "이영희 연차",
          color: "bg-blue-50 text-blue-700 border-blue-100",
        },
        {
          label: "월간 보고 15:00",
          color: "bg-rose-50 text-rose-700 border-rose-100",
        },
      ],
    },
  ],
}: OwnerWeeklyScheduleCardProps) {
  return (
    <section className="col-span-1 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        {/* 타이틀: text-base -> text-lg */}
        <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
          이번 주 일정
        </h3>
        {/* 주차 표시 뱃지: text-[10px] -> text-xs / 패딩 보정 */}
        <span className="text-xs font-bold text-[#0029C0] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100/30">
          {weekLabel}
        </span>
      </div>

      <div className="space-y-2.5">
        {scheduleData.map((item) => (
          <OwnerScheduleRow key={item.day} item={item} />
        ))}
      </div>
    </section>
  );
}
