"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { recordAttendanceAPI, getTodayAttendanceAPI } from "@/api/attendance";
import { AttendanceAction, AttendanceData } from "@/types/attendance";

const STATUS_CONFIG = {
  BEFORE: { label: "출근 전", color: "text-[#22C55E]", dot: "bg-[#22C55E]" },
  WORKING: { label: "근무 중", color: "text-[#2357E5]", dot: "bg-[#2357E5]" },
  AFTER: { label: "퇴근 완료", color: "text-[#EF4444]", dot: "bg-[#EF4444]" },
};

export default function WorkStatusCard() {
  const queryClient = useQueryClient();
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString("ko-KR", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const {
    data: attendance,
    isFetching,
    isError,
    refetch,
    isLoading, // 실제 첫 로딩 상태를 위해 추가
  } = useQuery<AttendanceData>({
    queryKey: ["todayAttendance"],
    queryFn: getTodayAttendanceAPI,
    // 재시도 횟수를 줄여 에러 피드백을 빠르게 함
    retry: 1,
    retryDelay: 500,
    staleTime: 1000 * 60 * 5,
    // initialData를 제거하거나, status를 null로 두어 데이터 확인 전엔 버튼을 막아야 합니다.
  });

  const mutation = useMutation({
    mutationFn: (action: AttendanceAction) => recordAttendanceAPI(action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todayAttendance"] });
    },
    onError: () => {
      alert("근태 기록 처리에 실패했습니다. 다시 시도해주세요.");
    },
  });

  const handleStatusChange = () => {
    console.log("a");
    if (!attendance) return; // 데이터 없으면 실행 방지
    if (attendance.status === "BEFORE") mutation.mutate("CLOCK_IN");
    if (attendance.status === "WORKING") mutation.mutate("CLOCK_OUT");
  };

  // 데이터가 없을 때를 대비한 기본값 설정
  const currentStatus = attendance?.status || "BEFORE";
  const config = STATUS_CONFIG[currentStatus];

  // 버튼 텍스트 결정 로직
  const getButtonText = () => {
    if (isFetching || isLoading) return "확인 중...";
    if (mutation.isPending) return "처리 중...";
    if (isError) return "데이터 오류";

    if (currentStatus === "BEFORE") return "출근하기";
    if (currentStatus === "WORKING") return "퇴근하기";
    return "오늘 업무 종료";
  };

  // 버튼 비활성화 조건 (이 부분이 핵심입니다)
  const isButtonDisabled =
    !attendance || // 데이터 로드 전
    isFetching || // 새로고침 중 (상태 확인 중)
    isLoading || // 초기 로딩 중
    isError || // 에러 발생 시
    mutation.isPending || // 버튼 클릭 후 통신 중
    currentStatus === "AFTER"; // 퇴근 완료 시

  const items = [
    {
      id: "work",
      icon: "/clock.svg",
      title: "출근 시간",
      time: attendance?.startTime ?? "--:--:--",
      isActive: currentStatus === "BEFORE",
    },
    {
      id: "leave",
      icon: "/logout.svg",
      title: "퇴근 시간",
      time: attendance?.endTime ?? "--:--:--",
      isActive: currentStatus === "WORKING",
    },
  ];

  return (
    <div className="p-[30px] bg-white rounded-[32px] shadow-sm border border-gray-100 w-full max-w-[380px] h-fit relative">
      {/* 에러 알림창 */}
      {isError && (
        <div className="mb-4 p-3 bg-red-50 rounded-2xl flex items-center justify-between text-[13px] text-red-500 animate-fadeIn border border-red-100">
          <span>⚠️ 데이터를 가져오지 못했습니다.</span>
          <button
            onClick={() => refetch()}
            className="font-bold underline hover:text-red-700"
          >
            재시도
          </button>
        </div>
      )}

      {/* 상태 표시 (데이터 로딩 중엔 투명도 조절로 시각적 차단) */}
      <div
        className={`transition-opacity duration-300 ${isFetching ? "opacity-50" : "opacity-100"}`}
      >
        <div className="flex items-center gap-[8px] font-bold mb-[10px]">
          <span className={`w-[12px] h-[12px] rounded-full ${config.dot}`} />
          <span className={`text-[14px] font-bold ${config.color}`}>
            {config.label}
          </span>
        </div>

        <div className="text-[40px] font-black tracking-tight text-gray-950">
          {currentTime || "00:00:00"}
        </div>

        <div className="flex items-center text-[#666] text-[14px] gap-[4px] mt-[6px]">
          <Image src="/calendar.svg" alt="calendar" width={16} height={16} />
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </div>

        <div className="flex gap-[12px] mt-[30px] mb-[30px]">
          {items.map((item) => (
            <div
              key={item.id}
              className={`flex-1 px-[20px] py-[15px] rounded-[24px] border transition-all duration-300 ${
                item.isActive
                  ? "bg-[#F5F8FF] border-[#DDE7FF] ring-2 ring-[#2357E5]/5"
                  : "bg-gray-50 border-transparent"
              }`}
            >
              <div className="flex flex-col items-start gap-[6px] mb-[8px]">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={16}
                  height={16}
                />
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
      </div>

      <div className="flex flex-col gap-[20px] text-[14px]">
        <Button
          text={getButtonText()}
          disabled={isButtonDisabled}
          onClick={handleStatusChange}
        />
        <div className="flex justify-between items-center mt-[4px]">
          <div className="text-[#999] flex items-center gap-[6px]">
            <Image
              src="/exclamationmark-circle.svg"
              alt="info"
              width={16}
              height={16}
            />
            <span className="text-[13px]">기록에 오류가 있나요?</span>
          </div>
          <span className="text-[#0029C0] text-[13px] font-bold cursor-pointer hover:underline">
            근태 수정 요청
          </span>
        </div>
      </div>
    </div>
  );
}
