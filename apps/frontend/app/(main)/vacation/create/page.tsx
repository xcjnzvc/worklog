"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  Check,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Paperclip,
  Info,
} from "lucide-react";

/**
 * 휴가 신청서 작성 페이지 (Next.js Page)
 */
export default function VacationCreatePage() {
  const router = useRouter();

  // --- 1. 상태 관리 ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 7));
  const [leaveType, setLeaveType] = useState("연차");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [selectingMode, setSelectingMode] = useState("start");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  // --- 2. 날짜 및 캘린더 로직 ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLastDate = new Date(year, month, 0).getDate();

    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        day: prevLastDate - i,
        current: false,
        date: `${year}.${month}.${prevLastDate - i}`,
      });
    }
    for (let i = 1; i <= lastDate; i++) {
      days.push({
        day: i,
        current: true,
        date: `${year}.${String(month + 1).padStart(2, "0")}.${String(i).padStart(2, "0")}`,
      });
    }
    return days;
  }, [year, month]);

  const workingDays = useMemo(() => {
    if (!rangeStart) return 0;
    if (leaveType.includes("반차")) return 0.5;
    if (!rangeEnd) return 1.0;

    const start = new Date(rangeStart.replace(/\./g, "-"));
    const end = new Date(rangeEnd.replace(/\./g, "-"));
    let count = 0;
    const temp = new Date(start);
    while (temp <= end) {
      if (temp.getDay() !== 0 && temp.getDay() !== 6) count++;
      temp.setDate(temp.getDate() + 1);
    }
    return count;
  }, [rangeStart, rangeEnd, leaveType]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] font-sans text-[#1B254B] p-6 md:p-10">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* 상단 헤더 영역 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-[30px]">
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-[#F4F7FE] transition-all group"
            >
              <ArrowLeft
                size={20}
                className="text-[#A3AED0] group-hover:text-[#1B254B]"
              />
            </button>
            <div>
              <h1 className="text-[30px] font-black text-[#1B254B] tracking-tight leading-tight">
                휴가 신청서 작성
              </h1>
              <p className="text-[#A3AED0] font-medium text-sm mt-0.5">
                상세 일정을 선택하고 결재를 요청하세요.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="px-7 py-3.5 text-sm font-bold text-[#707EAE] bg-white border border-gray-100 rounded-[18px] hover:bg-gray-50 transition-all shadow-sm">
              임시저장
            </button>
            <button className="px-9 py-3.5 text-sm font-bold text-white bg-[#0029C0] hover:bg-[#0023A1] rounded-[18px] shadow-[0_10px_20px_rgba(0,41,192,0.15)] active:scale-[0.98] transition-all">
              결재 요청하기
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 영역 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* 왼쪽 컬럼 */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-8 flex-1">
              {/* 휴가 종류 선택 */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                  휴가 종류
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full flex items-center justify-between px-8 py-5 bg-[#F4F7FE]/50 border border-[#E0E5F2] rounded-[24px] text-base font-bold outline-none hover:border-[#4318FF]/30 transition-all"
                  >
                    <span
                      className={
                        leaveType === "연차"
                          ? "text-[#0029C0]"
                          : "text-[#F69722]"
                      }
                    >
                      {leaveType}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#A3AED0] transition-transform ${showTypeDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showTypeDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowTypeDropdown(false)}
                      />
                      <div className="absolute top-full left-0 w-full mt-3 bg-white border border-[#F4F7FE] rounded-[24px] shadow-2xl z-20 py-3">
                        {[
                          "연차",
                          "오전 반차",
                          "오후 반차",
                          "병가",
                          "경조사",
                        ].map((type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setLeaveType(type);
                              setShowTypeDropdown(false);
                            }}
                            className="w-full px-8 py-4 text-left text-[15px] font-bold text-[#707EAE] hover:bg-[#F4F7FE] hover:text-[#0029C0] transition-colors flex items-center justify-between"
                          >
                            {type}
                            {leaveType === type && (
                              <Check size={18} className="text-[#0029C0]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* 사유 입력 */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                  상세 사유
                </label>
                <textarea
                  placeholder="휴가 신청 사유를 입력해 주세요."
                  className="w-full h-40 bg-[#F4F7FE]/50 border border-[#E0E5F2] rounded-[24px] px-8 py-6 text-base font-medium outline-none focus:border-[#0029C0] transition-all resize-none"
                />
              </div>

              {/* 파일 첨부 */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                  증빙 서류 첨부
                </label>
                <div className="w-full p-10 border-2 border-dashed border-[#E0E5F2] rounded-[28px] flex flex-col items-center justify-center gap-4 hover:bg-[#F4F7FE]/50 transition-all cursor-pointer group">
                  <Paperclip
                    size={22}
                    className="text-[#A3AED0] group-hover:text-[#0029C0]"
                  />
                  <p className="text-[15px] font-bold text-[#1B254B]">
                    파일을 선택하거나 드래그하세요
                  </p>
                </div>
              </div>
            </div>

            {/* 결재권자 요약 */}
            <div className="bg-white px-7 h-[100px] rounded-[30px] shadow-sm border border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[20px] bg-[#F4F7FE] flex items-center justify-center text-[#0029C0]">
                  <User size={26} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest mb-0.5">
                    Final Approver
                  </p>
                  <p className="text-[17px] font-black text-[#1B254B]">
                    김철수 팀장{" "}
                    <span className="text-[13px] font-bold text-[#707EAE] ml-1 font-medium">
                      인사팀 / 팀장
                    </span>
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 text-sm font-bold text-[#0029C0] bg-[#F4F7FE] rounded-xl hover:bg-[#E0E5F2] transition-all">
                변경
              </button>
            </div>
          </div>

          {/* 오른쪽 컬럼 */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden flex-1">
              <div className="px-8 py-7 border-b border-[#F4F7FE]">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[22px] font-black tracking-tight">
                    {year}년 {month + 1}월
                  </span>
                  <div className="flex bg-[#F4F7FE] rounded-xl p-1.5">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg text-[#A3AED0] transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2.5 hover:bg-white hover:shadow-sm rounded-lg text-[#A3AED0] transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F4F7FE]/40 border border-[#E0E5F2] p-4 rounded-[20px]">
                    <p className="text-[10px] font-bold text-[#A3AED0] mb-1.5 uppercase tracking-widest">
                      Start Date
                    </p>
                    <p className="text-[15px] font-black text-[#0029C0]">
                      {rangeStart || "선택 전"}
                    </p>
                  </div>
                  <div className="bg-[#F4F7FE]/40 border border-[#E0E5F2] p-4 rounded-[20px]">
                    <p className="text-[10px] font-bold text-[#A3AED0] mb-1.5 uppercase tracking-widest">
                      End Date
                    </p>
                    <p className="text-[15px] font-black text-[#0029C0]">
                      {rangeEnd || (rangeStart ? "당일" : "선택 전")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-9 py-8">
                <div className="grid grid-cols-7 mb-5 px-1 text-center">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d, i) => (
                    <div
                      key={i}
                      className={`text-[12px] font-black uppercase tracking-tighter ${i === 0 ? "text-[#FF4D4F]" : i === 6 ? "text-[#2357E5]" : "text-[#A3AED0]"}`}
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {calendarDays.map((item, i) => {
                    const isSelected =
                      item.date === rangeStart || item.date === rangeEnd;
                    const isInRange =
                      rangeStart &&
                      rangeEnd &&
                      item.date > rangeStart &&
                      item.date < rangeEnd;
                    return (
                      <button
                        key={i}
                        onClick={() =>
                          item.current &&
                          (selectingMode === "start"
                            ? (setRangeStart(item.date),
                              setSelectingMode("end"))
                            : (setRangeEnd(item.date),
                              setSelectingMode("start")))
                        }
                        className={`h-11 rounded-[14px] text-[14px] font-bold transition-all relative flex items-center justify-center
                          ${!item.current ? "text-[#E0E5F2]" : "text-[#1B254B]"}
                          ${isSelected ? "bg-[#0029C0] text-white shadow-md z-10" : ""}
                          ${isInRange ? "bg-[#F4F7FE] text-[#0029C0]" : "hover:bg-[#F4F7FE]"}
                        `}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 잔여 휴가 요약 (하단 높이 동기화) */}
            <div className="bg-white px-7 h-[100px] rounded-[30px] border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[20px] bg-[#F4F7FE] flex items-center justify-center text-[#0029C0]">
                  <PieChartIcon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-wider">
                    잔여 휴가
                  </p>
                  <p className="text-[20px] font-black text-[#1B254B]">
                    12.5 <span className="text-[14px] text-[#707EAE]">일</span>
                  </p>
                </div>
              </div>

              <div className="text-right pr-2">
                <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-wider">
                  이번 차감
                </p>
                <p className="text-[20px] font-black text-[#FF4D4F] leading-tight">
                  -{workingDays}일
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 안내바 */}
        <div className="bg-white px-8 py-5 border border-gray-100 rounded-[28px] flex items-center gap-5 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
            <Info size={24} />
          </div>
          <p className="text-[14px] font-medium text-[#707EAE] leading-relaxed">
            <span className="font-extrabold text-[#1B254B] mr-2">안내사항</span>
            휴가 신청은 팀장 승인 후 최종 확정되며, 마이페이지 대시보드에서
            실시간 진행 상태를 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}

// 아이콘 헬퍼
function PieChartIcon({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
