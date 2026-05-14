"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, User, AlertCircle, ChevronDown } from "lucide-react";
import { useCreateFixRequest } from "@/hooks/useAttendance";
import { Approver } from "@/types/user";
import ApproverModal from "@/app/(main)/vacation/_components/ApproverModal";
import { useVacation } from "@/hooks/useVacation";
import Input from "@/components/Input";
import { toast } from "react-hot-toast"; // 또는 'sonner'

export default function AttendanceCorrectionCreatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetId = searchParams.get("id");

  const { useApprovers } = useVacation();
  const { data: approvers = [] } = useApprovers();
  const { mutate: createFixRequest, isPending: isSubmitting } =
    useCreateFixRequest();

  const [fixType, setFixType] = useState("LATE");
  const [fixClockIn, setFixClockIn] = useState("09:00");
  const [fixClockOut, setFixClockOut] = useState("18:00");
  const [reason, setReason] = useState("");
  const [selectedApprover, setSelectedApprover] = useState<Approver | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const FIX_TYPES = [
    { value: "LATE", label: "지각 정정" },
    { value: "ABSENT", label: "결근/미인식 정정" },
    { value: "EARLY", label: "조퇴 정정" },
    { value: "OTHER", label: "기타 (직접 입력)" },
  ];

  useEffect(() => {
    if (approvers.length > 0 && !selectedApprover) {
      const defaultApprover =
        approvers.find((a) => a.role === "OWNER") || approvers[0];
      setSelectedApprover(defaultApprover);
    }
  }, [approvers, selectedApprover]);

  const handleSubmit = () => {
    if (!targetId) return toast.error("대상을 찾을 수 없습니다.");
    if (fixType === "OTHER" && !reason)
      return toast.error("기타 사유를 구체적으로 입력해주세요.");
    if (!selectedApprover) return toast.error("결재권자를 선택해주세요.");

    const today = new Date().toISOString().split("T")[0];

    // 1. reason 값을 확정적 string으로 변환 (|| 연산자 사용)
    const fallbackReason =
      FIX_TYPES.find((t) => t.value === fixType)?.label || "근태 정정 신청";

    const requestData = {
      type: fixType,
      reason: reason || fallbackReason, // undefined가 절대 발생하지 않음
      fixClockIn: new Date(`${today}T${fixClockIn}:00`).toISOString(),
      fixClockOut: new Date(`${today}T${fixClockOut}:00`).toISOString(),
      approverId: selectedApprover.id,
    };

    createFixRequest(
      { id: targetId, data: requestData },
      {
        onSuccess: () => {
          toast.success("정정 신청이 완료되었습니다.");
          router.push("/attendance?tab=STATISTICS");
        },
        // 2. err: any 대신 err: Error 또는 unknown 사용 (ESLint 에러 해결)
        onError: (err: Error) =>
          toast.error(err.message || "신청 중 오류가 발생했습니다."),
      },
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1B254B]">
      <div className="max-w-[1000px] mx-auto space-y-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all"
            >
              <ArrowLeft size={20} className="text-[#A3AED0]" />
            </button>
            <div>
              <h1 className="text-[28px] font-black tracking-tight">
                근태 정정 신청
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <AlertCircle size={14} className="text-[#4318FF]" />
                <p className="text-[#A3AED0] font-medium text-xs">
                  대상 기록 ID: {targetId?.slice(0, 8)}...
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-9 py-3.5 text-sm font-bold text-white bg-[#4318FF] hover:bg-[#3311CC] rounded-[18px] shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? "요청 중..." : "정정 요청하기"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {/* 1. 정정 정보 입력 */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
              <div className="lg:col-span-4 space-y-3">
                <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                  정정 분류
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="w-full h-[60px] bg-[#F4F7FE] border-2 border-transparent focus:border-[#4318FF] rounded-[22px] px-6 text-[16px] font-bold text-[#4318FF] outline-none cursor-pointer transition-all flex items-center justify-between"
                  >
                    <span>
                      {FIX_TYPES.find((t) => t.value === fixType)?.label}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`text-[#4318FF] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                      />
                      <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white rounded-[18px] shadow-xl border border-gray-100 overflow-hidden z-20">
                        {FIX_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => {
                              setFixType(type.value);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full px-6 py-4 text-left text-[15px] font-bold transition-colors
                              ${
                                fixType === type.value
                                  ? "bg-[#F4F7FE] text-[#4318FF]"
                                  : "text-[#1B254B] hover:bg-[#F4F7FE] hover:text-[#4318FF]"
                              }`}
                          >
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4">
                <Input
                  variant="form"
                  label="출근 시간 변경"
                  type="time"
                  value={fixClockIn}
                  onChange={(e) => setFixClockIn(e.target.value)}
                  icon={<Clock size={20} />}
                />
              </div>

              <div className="lg:col-span-4">
                <Input
                  variant="form"
                  label="퇴근 시간 변경"
                  type="time"
                  value={fixClockOut}
                  onChange={(e) => setFixClockOut(e.target.value)}
                  icon={<Clock size={20} />}
                />
              </div>
            </div>
          </div>

          {/* 2. 정정 사유 */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <label className="text-[13px] font-bold text-[#A3AED0] ml-1 uppercase tracking-wider">
                정정 사유{" "}
                {fixType === "OTHER" && <span className="text-red-500">*</span>}
              </label>
              <span className="text-[11px] text-[#A3AED0] font-medium opacity-70">
                {fixType === "OTHER"
                  ? "필수 입력 항목입니다"
                  : "사유 미입력 시 분류명으로 전송됩니다"}
              </span>
            </div>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                fixType === "OTHER"
                  ? "구체적인 사유를 작성해주세요 (예: 단말기 고장으로 인한 기록 누락)"
                  : "추가 전달 사항이 있다면 입력하세요."
              }
              className="w-full h-32 bg-[#F4F7FE] border-2 border-transparent focus:border-[#4318FF] rounded-[24px] px-8 py-6 text-base font-medium outline-none transition-all resize-none placeholder:text-[#A3AED0]/60"
            />
          </div>

          {/* 3. 결재권자 */}
          <div className="bg-white px-8 py-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#F4F7FE] flex items-center justify-center text-[#4318FF] border border-indigo-50">
                <User size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-[#A3AED0] uppercase tracking-[0.2em] mb-0.5">
                  Final Approver
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-black text-[#1B254B]">
                    {selectedApprover?.name || "결재권자 로딩 중..."}
                  </p>
                  <span className="px-2.5 py-0.5 bg-[#E0E5F2] text-[#4318FF] text-[11px] font-bold rounded-full">
                    {selectedApprover?.role === "OWNER" ? "대표" : "팀장"}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full md:w-auto px-10 py-3 text-sm font-bold text-[#4318FF] bg-[#F4F7FE] border border-indigo-50 rounded-xl hover:bg-[#E0E5F2] transition-all active:scale-95"
            >
              승인자 변경
            </button>
          </div>
        </div>
      </div>

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
