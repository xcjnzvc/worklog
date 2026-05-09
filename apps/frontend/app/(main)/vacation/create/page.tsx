"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  Check,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Paperclip,
} from "lucide-react";
import ApproverModal from "../_components/ApproverModal";
import { useVacation } from "@/hooks/useVacation";
import { Approver, CreateVacationPayload } from "@/types/user";

export default function VacationCreatePage() {
  const router = useRouter();

  // 1. 커스텀 훅에서 필요한 기능 가져오기
  const { useApprovers, useCreateVacation } = useVacation();

  // 2. API 데이터 및 변수
  const { data: approvers = [] } = useApprovers();
  const { mutate: createVacation, isPending: isSubmitting } =
    useCreateVacation();

  // --- States ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 7));
  const [leaveType, setLeaveType] = useState("연차");
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [reason, setReason] = useState("");
  const [selectingMode, setSelectingMode] = useState<"start" | "end">("start");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(
    null,
  );

  // 결재권자 데이터 로드 시 기본값 설정 (OWNER 우선)
  useEffect(() => {
    if (approvers.length > 0 && !selectedApprover) {
      const defaultApprover =
        approvers.find((a) => a.role === "OWNER") || approvers[0];
      setSelectedApprover(defaultApprover);
    }
  }, [approvers, selectedApprover]);

  // --- 캘린더 로직 ---
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const changeMonth = (offset: number) =>
    setCurrentDate(new Date(year, month + offset, 1));

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

  // --- 신청 제출 함수 ---
  const handleSubmit = () => {
    if (!rangeStart) return alert("날짜를 선택해주세요.");
    if (!reason) return alert("사유를 입력해주세요.");
    if (!selectedApprover) return alert("결재권자를 선택해주세요.");

    console.log("눌리니?");

    const payload: CreateVacationPayload = {
      type:
        leaveType === "연차"
          ? "ANNUAL"
          : leaveType.includes("반차")
            ? "HALF"
            : "OTHER",
      startDate: rangeStart.replace(/\./g, "-"),
      endDate: (rangeEnd || rangeStart).replace(/\./g, "-"),
      reason,
      approverId: selectedApprover.id,
      timeDetail:
        leaveType === "오전 반차"
          ? "AM"
          : leaveType === "오후 반차"
            ? "PM"
            : null,
    };

    createVacation(payload, {
      onSuccess: () => {
        alert("휴가 신청이 완료되었습니다.");
        router.push("/vacation");
      },
      onError: (error) => {
        alert(error.message || "신청 중 오류가 발생했습니다.");
      },
    });
  };

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
              <h1 className="text-[30px] font-black text-[#1B254B]">
                휴가 신청서 작성
              </h1>
              <p className="text-[#A3AED0] font-medium text-sm mt-0.5">
                상세 일정을 선택하고 결재를 요청하세요.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="px-7 py-3.5 text-sm font-bold text-[#707EAE] bg-white border border-gray-100 rounded-[18px]">
              임시저장
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-9 py-3.5 text-sm font-bold text-white bg-[#0029C0] hover:bg-[#0023A1] rounded-[18px] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "요청 중..." : "결재 요청하기"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 좌측: 신청 정보 입력 */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-8">
              {/* 휴가 종류 */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                  휴가 종류
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                    className="w-full flex items-center justify-between px-8 py-5 bg-[#F4F7FE]/50 border border-[#E0E5F2] rounded-[24px] text-base font-bold"
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
                    <div className="absolute top-full left-0 w-full mt-3 bg-white border border-[#F4F7FE] rounded-[24px] shadow-2xl z-20 py-3">
                      {["연차", "오전 반차", "오후 반차", "병가", "경조사"].map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => {
                              setLeaveType(type);
                              setShowTypeDropdown(false);
                            }}
                            className="w-full px-8 py-4 text-left text-[15px] font-bold text-[#707EAE] hover:bg-[#F4F7FE] hover:text-[#0029C0] flex justify-between"
                          >
                            {type}{" "}
                            {leaveType === type && (
                              <Check size={18} className="text-[#0029C0]" />
                            )}
                          </button>
                        ),
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* 상세 사유 */}
              <div className="space-y-3">
                <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                  상세 사유
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="휴가 신청 사유를 입력해 주세요."
                  className="w-full h-40 bg-[#F4F7FE]/50 border border-[#E0E5F2] rounded-[24px] px-8 py-6 text-base font-medium outline-none focus:border-[#0029C0] transition-all resize-none"
                />
              </div>

              {/* 증빙 서류 */}
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

            {/* 결재권자 표시 및 변경 */}
            <div className="bg-white px-7 h-[100px] rounded-[30px] shadow-sm border border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-[20px] bg-[#F4F7FE] flex items-center justify-center text-[#0029C0]">
                  <User size={26} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-widest">
                    Final Approver
                  </p>
                  <p className="text-[17px] font-black text-[#1B254B]">
                    {selectedApprover?.name || "로딩 중..."}
                    <span className="text-[13px] font-bold text-[#707EAE] ml-1 font-medium">
                      / {selectedApprover?.role === "OWNER" ? "팀장" : "대표"}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 text-sm font-bold text-[#0029C0] bg-[#F4F7FE] rounded-xl hover:bg-[#E0E5F2] transition-all"
              >
                변경
              </button>
            </div>
          </div>

          {/* 우측: 달력 및 요약 */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-[32px] shadow-sm border border-gray-50 overflow-hidden">
              <div className="px-8 py-7 border-b border-[#F4F7FE]">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[22px] font-black">
                    {year}년 {month + 1}월
                  </span>
                  <div className="flex bg-[#F4F7FE] rounded-xl p-1.5">
                    <button
                      onClick={() => changeMonth(-1)}
                      className="p-2.5 hover:bg-white rounded-lg text-[#A3AED0]"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => changeMonth(1)}
                      className="p-2.5 hover:bg-white rounded-lg text-[#A3AED0]"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#F4F7FE]/40 border border-[#E0E5F2] p-4 rounded-[20px]">
                    <p className="text-[10px] font-bold text-[#A3AED0] mb-1.5 uppercase">
                      Start Date
                    </p>
                    <p className="text-[15px] font-black text-[#0029C0]">
                      {rangeStart || "선택 전"}
                    </p>
                  </div>
                  <div className="bg-[#F4F7FE]/40 border border-[#E0E5F2] p-4 rounded-[20px]">
                    <p className="text-[10px] font-bold text-[#A3AED0] mb-1.5 uppercase">
                      End Date
                    </p>
                    <p className="text-[15px] font-black text-[#0029C0]">
                      {rangeEnd || (rangeStart ? "당일" : "선택 전")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-9 py-8">
                <div className="grid grid-cols-7 mb-5 text-center text-[12px] font-black text-[#A3AED0]">
                  <div className="text-[#FF4D4F]">일</div>
                  <div>월</div>
                  <div>화</div>
                  <div>수</div>
                  <div>목</div>
                  <div>금</div>
                  <div className="text-[#2357E5]">토</div>
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
                        type="button"
                        onClick={() => {
                          if (!item.current) return;
                          if (selectingMode === "start") {
                            setRangeStart(item.date);
                            setRangeEnd("");
                            setSelectingMode("end");
                          } else {
                            if (item.date < rangeStart) {
                              setRangeStart(item.date);
                              setRangeEnd(rangeStart);
                            } else {
                              setRangeEnd(item.date);
                            }
                            setSelectingMode("start");
                          }
                        }}
                        className={`h-11 rounded-[14px] text-[14px] font-bold transition-all relative flex items-center justify-center
                          ${!item.current ? "text-[#E0E5F2]" : "text-[#1B254B]"}
                          ${isSelected ? "bg-[#0029C0] text-white shadow-md z-10" : ""}
                          ${isInRange ? "bg-[#F4F7FE] text-[#0029C0]" : "hover:bg-[#F4F7FE]"}`}
                      >
                        {item.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            {/* 하단 요약 정보 */}
            <div className="bg-white px-7 h-[100px] rounded-[30px] border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-[20px] bg-[#F4F7FE] flex items-center justify-center text-[#0029C0]">
                  <PieChartIcon size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[#A3AED0] uppercase">
                    잔여 휴가
                  </p>
                  <p className="text-[20px] font-black">
                    12.5 <span className="text-[14px] text-[#707EAE]">일</span>
                  </p>
                </div>
              </div>
              <div className="text-right pr-2">
                <p className="text-[10px] font-bold text-[#A3AED0] uppercase">
                  이번 차감
                </p>
                <p className="text-[20px] font-black text-[#FF4D4F]">
                  -{workingDays}일
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 결재권자 모달 - onSelect에 핸들러 함수 적용하여 타입 에러 해결 */}
      <ApproverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        approvers={approvers}
        onSelect={(approver: Approver) => setSelectedApprover(approver)}
        selectedId={selectedApprover?.id}
      />
    </div>
  );
}

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
