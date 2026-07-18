"use client";

import React, { useState, useMemo } from "react";
import Button from "@/components/Button";

// 날짜 라벨 포맷팅 헬퍼
const getWeekLabel = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const firstDayOfMonth = new Date(year, date.getMonth(), 1);
  const week = Math.ceil(
    (date.getDate() - 1 + firstDayOfMonth.getDay() + 1) / 7,
  );
  return `${year}년 ${month}월 ${week}주`;
};

export default function WeeklyScheduleCard() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(
    currentDate.getDate(),
  );

  // 💡 데이터 생성 로직
  const days = useMemo(() => {
    const result = [];

    const day = currentDate.getDay();
    const diff = currentDate.getDate() - day;
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const dateObj = new Date(startOfWeek);
      dateObj.setDate(startOfWeek.getDate() + i);
      const dateNum = dateObj.getDate();

      result.push({
        dayName: ["일", "월", "화", "수", "목", "금", "토"][i],
        date: dateNum,
        isToday: dateObj.toDateString() === new Date().toDateString(),
        isSunday: i === 0,
        isWeekend: i === 0 || i === 6,
        vacations:
          dateNum % 3 === 0
            ? [
                { name: "강수정", dept: "프론트엔드" },
                { name: "강수정", dept: "디자이너" },
                { name: "강수정", dept: "디자이너" },
              ]
            : [],
        meetings:
          dateNum % 2 === 0
            ? [
                {
                  title: "프론트 기획 리뷰",
                  time: "13:00",
                  type: "비대면",
                  location: "Google Meet",
                },
                {
                  title: "디자인 싱크 세션",
                  time: "15:30",
                  type: "대면",
                  location: "회의실 B",
                },
              ]
            : [
                {
                  title: "주간 업무 보고",
                  time: "10:00",
                  type: "대면",
                  location: "대회의실",
                },
              ],
        tags:
          dateNum % 3 === 0
            ? [
                { text: "연차 3", bg: "bg-blue-50 text-blue-600" },
                { text: "회의 1", bg: "bg-orange-50 text-orange-600" },
                { text: "반차 2", bg: "bg-amber-50 text-amber-600" },
              ]
            : [],
      });
    }
    return result;
  }, [currentDate]);

  const handlePrevClick = () => {
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  };

  const handleNextClick = () => {
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  };

  const selectedData = days.find((d) => d.date === selectedDate) || days[0];

  return (
    <div className="w-full bg-white rounded-[32px] p-6 md:p-8 border border-gray-100 shadow-sm overflow-visible">
      {/* 헤더 */}
      <div>
        <h3 className="text-gray-900 font-bold text-lg mb-4">주간 스케줄</h3>
        <div className="flex items-center gap-4 text-gray-800">
          <Button
            size="sm"
            text="<"
            onClick={handlePrevClick}
            className="bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 px-3 min-w-[36px]"
          />
          <span className="font-bold text-[16px]">
            {getWeekLabel(currentDate)}
          </span>
          <Button
            size="sm"
            text=">"
            onClick={handleNextClick}
            className="bg-transparent hover:bg-gray-100 text-gray-400 hover:text-gray-600 px-3 min-w-[36px]"
          />
        </div>
      </div>

      {/* 요일 그리드 */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 pt-4 pb-2 overflow-visible">
        {days.map((item, index) => (
          <div
            key={`${item.date}-${index}`}
            onClick={() => setSelectedDate(item.date)}
            className={`relative flex flex-col items-center justify-start min-h-[160px] rounded-[20px] border p-3 cursor-pointer transition-all ${item.isToday ? "border-[#0029C0] bg-white shadow-sm" : selectedDate === item.date ? "border-gray-300 bg-gray-50" : "border-gray-100 bg-white hover:border-gray-200"}`}
          >
            {item.isToday && (
              <div className="absolute -top-[12px] left-1/2 -translate-x-1/2 bg-[#0029C0] px-3 py-0.5 rounded-full z-20 shadow-sm">
                <span className="text-white text-[11px] font-black">오늘</span>
              </div>
            )}
            <span
              className={`text-xs font-bold mb-3 ${item.isSunday ? "text-red-500" : item.isWeekend ? "text-blue-500" : "text-gray-400"}`}
            >
              {item.dayName}
            </span>
            <span
              className={`text-[20px] font-bold tracking-tight mb-3 ${item.isSunday ? "text-red-500" : item.isWeekend ? "text-blue-500" : "text-gray-900"}`}
            >
              {item.date}
            </span>
            {item.tags.length > 0 && (
              <div className="w-full flex flex-col gap-1 mt-auto">
                {item.tags.map((t, i) => (
                  <div
                    key={i}
                    className={`w-full py-1 px-1.5 rounded-md text-center text-[10px] font-bold ${t.bg}`}
                  >
                    {t.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 상세 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* 휴가자 */}
        <div className="bg-[#F8F9FA] rounded-[24px] p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[#0029C0]">👥</span>
              <h4 className="font-bold text-sm text-gray-800">휴가자</h4>
            </div>
            <span className="text-[#0029C0] text-xs font-bold">
              {selectedData.vacations.length}명
            </span>
          </div>
          <div className="flex flex-col gap-3 mb-5">
            {selectedData.vacations.map((v, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  강
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{v.name}</p>
                  <p className="text-gray-400 text-[11px] font-medium">
                    {v.dept}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <Button
            text="+ 추가 정보 확인"
            className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 mt-auto"
          />
        </div>

        {/* 회의 일정 */}
        <div className="bg-[#F8F9FA] rounded-[24px] p-5 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-orange-500">🕒</span>
              <h4 className="font-bold text-sm text-gray-800">회의 일정</h4>
            </div>
            <span className="text-orange-600 text-xs font-bold">
              {selectedData.meetings.length}건
            </span>
          </div>
          <div className="flex flex-col gap-3 mb-5">
            {selectedData.meetings.map((m, i) => (
              <div
                key={i}
                className="bg-white p-3.5 rounded-xl border border-gray-100"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="bg-orange-50 text-orange-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                    🕒 {m.time}
                  </span>
                  <span
                    className={
                      m.type === "비대면"
                        ? "text-blue-600 text-[10px] font-bold"
                        : "text-emerald-600 text-[10px] font-bold"
                    }
                  >
                    {m.type}
                  </span>
                </div>
                <h5 className="text-gray-900 font-bold text-xs">{m.title}</h5>
                <p className="text-gray-400 text-[10px] mt-0.5">
                  📍 {m.location}
                </p>
              </div>
            ))}
          </div>
          <Button
            text="+ 전체 회의실 예약"
            className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl text-xs font-bold hover:bg-gray-50 mt-auto"
          />
        </div>
      </div>
    </div>
  );
}
