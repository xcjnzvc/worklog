"use client";

import React from "react";
import { CombinedStatus, AttendanceWorkLog } from "@/types/attendance";
import { useRouter } from "next/navigation";
import { AttendanceMobileCard } from "./AttendanceMobileCard";

interface AttendanceTableProps {
  data: AttendanceWorkLog[];
  type: "view" | "correction";
  onItemClick: (item: AttendanceWorkLog) => void;
}

export const AttendanceTable = ({
  data,
  type,
  onItemClick,
}: AttendanceTableProps) => {
  const router = useRouter();

  // ─── 스타일 헬퍼 ───────────────────────────────────────────
  const getStatusStyle = (status: CombinedStatus) => {
    const styles: Record<string, string> = {
      NORMAL: "bg-[#E6F4EA] text-[#137333]",
      WORKING: "bg-[#FFF8E7] text-[#FFA800]",
      LATE: "bg-[#FCE8E6] text-[#C5221F]",
      ABSENT: "bg-[#FCE8E6] text-[#C5221F]",
      MISSING_OUT: "bg-[#FCE8E6] text-[#C5221F]",
      LATE_EARLY: "bg-[#FCE8E6] text-[#C5221F]",
      EARLY_LEAVE: "bg-[#FCE8E6] text-[#C5221F]",
    };
    return styles[status] || "bg-gray-50 text-gray-400";
  };

  const getApprStatusStyle = (apprStatus: string | null) => {
    switch (apprStatus) {
      case "APPROVED":
        return "bg-[#EFFFF6] text-[#05CD99]";
      case "PENDING":
        return "bg-[#FFF8E7] text-[#FFA800]";
      case "REJECTED":
        return "bg-[#FFEEF2] text-[#EE5D50]";
      default:
        return "bg-gray-50 text-gray-400";
    }
  };

  const attendanceTypeMap: Record<string, string> = {
    NORMAL: "정상",
    WORKING: "근무 중",
    LATE: "지각",
    ABSENT: "결근",
    MISSING_OUT: "퇴근 누락",
    LATE_EARLY: "지각/조퇴",
    EARLY_LEAVE: "조퇴",
  };

  const approvalStatusMap: Record<string, string> = {
    PENDING: "승인 대기",
    APPROVED: "승인 완료",
    REJECTED: "승인 반려",
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
  };

  // 💡 테이블 공간 확보를 위해 년도를 제외하고 'MM.DD'만 반환하는 함수
  const formatTableDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return `${String(d.getUTCMonth() + 1).padStart(2, "0")}.${String(d.getUTCDate()).padStart(2, "0")}`;
  };

  const formatTime = (dateStr: string | null, status: CombinedStatus) => {
    if (!dateStr || status === "ABSENT") return "--:--";
    const d = new Date(dateStr);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };

  // ─── 빈 데이터 ─────────────────────────────────────────────
  if (data.length === 0) {
    return (
      <div className="py-20 text-center text-[#A3AED0]">기록이 없습니다.</div>
    );
  }

  // ─── 모바일 카드 JSX: correction 타입 ──────────────────────
  const mobileCorrectionCards = (
    <div className="sm:hidden flex flex-col gap-4">
      {data.map((item, index) => {
        const displayId = `NO. ${String(index + 1).padStart(3, "0")}`;

        return (
          <div
            key={item.id}
            className="bg-white border border-gray-50 rounded-[28px] p-6 shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-xs text-[#4318FF]">
                {displayId}
              </span>
              <span className="font-bold text-xs text-[#707EAE]">
                {formatDate(item.createdAt)}
              </span>
              <span
                className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-black ${getApprStatusStyle(
                  item.apprStatus,
                )}`}
              >
                {approvalStatusMap[item.apprStatus as string] || "처리 중"}
              </span>
            </div>

            <div className="flex flex-col gap-1.5 text-sm text-[#A3AED0]">
              <span>
                대상 날짜{" "}
                <b className="text-[#1B254B]">{formatDate(item.date)}</b>
              </span>
              <span className="truncate">
                사유{" "}
                <b className="text-[#707EAE]">
                  {item.fixReason || "사유 미입력"}
                </b>
              </span>
              {item.approverName && (
                <span>
                  승인자{" "}
                  <b className="text-[#1B254B]">
                    {item.approverName}{" "}
                    <span className="font-normal text-[#A3AED0]">
                      ({item.approverPosition || "팀장"})
                    </span>
                  </b>
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <>
      {/* ── 모바일 카드 출력부 ── */}
      {type === "view" ? (
        <div className="sm:hidden flex flex-col gap-4">
          {data.map((item, index) => {
            const enhancedItem = {
              ...item,
              displayId: `NO. ${String(index + 1).padStart(3, "0")}`,
            };
            return (
              <AttendanceMobileCard
                key={item.id}
                item={enhancedItem}
                getStatusStyle={getStatusStyle}
                attendanceTypeMap={attendanceTypeMap}
                formatDate={formatDate}
                formatTime={formatTime}
              />
            );
          })}
        </div>
      ) : (
        mobileCorrectionCards
      )}

      {/* ── 데스크탑/태블릿 테이블 뷰 (sm 이상) ── */}
      <div className="hidden sm:block overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[550px] md:min-w-[800px] lg:min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                번호
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                {type === "view" ? "날짜" : "신청일"}
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                {type === "view" ? "출근" : "대상날짜"}
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                {type === "view" ? "퇴근" : "정정 사유"}
              </th>
              {/* 💡 근무시간 헤더: md(768px) 이상일 때만 노출 (view 타입 전용) */}
              {type === "view" && (
                <th className="hidden md:table-cell px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                  근무시간
                </th>
              )}
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                {type === "view" ? "출결" : "결재 상태"}
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                {type === "view" ? "정정 신청" : "승인자"}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const isDisabled =
                item.isFix ||
                item.apprStatus === "PENDING" ||
                item.status === "NORMAL";

              const rawDisplayId = String(index + 1).padStart(3, "0");

              return (
                <tr
                  key={item.id}
                  onClick={() => !isDisabled && onItemClick(item)}
                  className={`transition-colors duration-200 text-center border-b border-gray-50 last:border-none
                    ${
                      isDisabled
                        ? "bg-white cursor-default"
                        : "bg-white hover:bg-[#F7F9FF] cursor-pointer"
                    }`}
                >
                  {type === "view" ? (
                    <>
                      <td className="px-4 py-5 text-sm font-bold text-[#707EAE]">
                        {rawDisplayId}
                      </td>
                      {/* 💡 년도를 제거한 좁은 화면 최적화 날짜 포맷 적용 */}
                      <td className="px-4 py-5 text-sm font-bold text-[#707EAE]">
                        {formatTableDate(item.date)}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-[#1B254B]">
                        {formatTime(item.clockIn, item.status)}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-[#1B254B]">
                        {formatTime(item.clockOut, item.status)}
                      </td>
                      {/* 💡 근무시간 데이터 셀: md 이상일 때만 노출 */}
                      <td className="hidden md:table-cell px-4 py-5 text-sm font-medium text-[#707EAE]">
                        {item.workMinutes !== null
                          ? `${item.workMinutes}분`
                          : "0분"}
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(
                            item.status,
                          )}`}
                        >
                          {attendanceTypeMap[item.status] || "기타"}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        {item.status === "NORMAL" ? (
                          <span className="text-[#A3AED0] text-[13px] font-medium">
                            정상 기록
                          </span>
                        ) : (
                          <button
                            disabled={isDisabled}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isDisabled)
                                router.push(
                                  `/attendance/correction/create?id=${item.id}`,
                                );
                            }}
                            className={`inline-block px-4 py-2 rounded-xl text-[13px] font-bold transition-all
                              ${
                                isDisabled
                                  ? "bg-[#E0E5F2] text-[#A3AED0] cursor-not-allowed"
                                  : "bg-[#4318FF] text-white hover:bg-[#3311CC] active:scale-95"
                              }`}
                          >
                            {item.isFix
                              ? "정정 완료"
                              : item.apprStatus === "PENDING"
                                ? "승인 대기"
                                : "정정 요청"}
                          </button>
                        )}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-5 text-sm font-bold text-[#707EAE]">
                        {rawDisplayId}
                      </td>
                      {/* 💡 정정 신청 내역 탭에서도 년도 제외 적용 */}
                      <td className="px-4 py-5 text-sm font-bold text-[#707EAE]">
                        {formatTableDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-5 text-sm font-bold text-[#1B254B]">
                        {formatTableDate(item.date)}
                      </td>
                      <td className="px-4 py-5 text-sm text-[#707EAE] truncate max-w-[120px] md:max-w-[200px]">
                        {item.fixReason || "사유 미입력"}
                      </td>
                      <td className="px-4 py-5">
                        <span
                          className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getApprStatusStyle(
                            item.apprStatus,
                          )}`}
                        >
                          {approvalStatusMap[item.apprStatus as string] ||
                            "처리 중"}
                        </span>
                      </td>
                      <td className="px-4 py-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm font-bold text-[#1B254B]">
                            {item.approverName || "미정"}
                          </span>
                          {item.approverName && (
                            <span className="text-[12px] font-medium text-[#A3AED0]">
                              ({item.approverPosition || "팀장"})
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
