// "use client";

// import React from "react";
// import { CombinedStatus, AttendanceWorkLog } from "@/types/attendance";
// import { useRouter } from "next/navigation";

// interface AttendanceTableProps {
//   data: AttendanceWorkLog[];
//   type: "view" | "correction";
//   onItemClick: (item: AttendanceWorkLog) => void;
// }

// export const AttendanceTable = ({
//   data,
//   type,
//   onItemClick,
// }: AttendanceTableProps) => {
//   const router = useRouter();

//   // "사유" 헤더 추가 및 중앙 정렬 반영
//   const headers =
//     type === "view"
//       ? ["날짜", "출근", "퇴근", "근무시간", "상태", "사유", "신청"]
//       : ["신청일", "대상날짜", "정정 사유", "상태", "승인자"];

//   const getStatusStyle = (status: CombinedStatus) => {
//     const styles: Record<string, string> = {
//       NORMAL: "bg-[#EFFFF6] text-[#05CD99]",
//       APPROVED: "bg-[#EFFFF6] text-[#05CD99]",
//       PENDING: "bg-[#FFF8E7] text-[#FFA800]",
//       WORKING: "bg-[#FFF8E7] text-[#FFA800]",
//       REJECTED: "bg-[#FFEEF2] text-[#EE5D50]",
//       LATE: "bg-[#FFEEF2] text-[#EE5D50]",
//       ABSENT: "bg-[#FFEEF2] text-[#EE5D50]",
//       MISSING_OUT: "bg-[#FFEEF2] text-[#EE5D50]",
//       LATE_EARLY: "bg-[#FFEEF2] text-[#EE5D50]",
//       EARLY_LEAVE: "bg-[#FFEEF2] text-[#EE5D50]",
//     };
//     return styles[status] || "bg-gray-50 text-gray-400";
//   };

//   const getStatusText = (status: CombinedStatus) => {
//     const statusMap: Record<string, string> = {
//       NORMAL: "정상",
//       WORKING: "근무 중",
//       LATE: "지각",
//       ABSENT: "결근",
//       APPROVED: "완료",
//       PENDING: "대기",
//       REJECTED: "반려",
//       MISSING_OUT: "퇴근 누락",
//       LATE_EARLY: "지각/조퇴",
//       EARLY_LEAVE: "조퇴",
//     };
//     return statusMap[status] || status;
//   };

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "-";
//     const d = new Date(dateStr);
//     return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
//   };

//   const formatTime = (dateStr: string | null, status: CombinedStatus) => {
//     if (!dateStr || status === "ABSENT") return "--:--";
//     const d = new Date(dateStr);
//     return d.toLocaleTimeString("ko-KR", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: false,
//     });
//   };

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full min-w-[1000px] border-separate border-spacing-y-3">
//         <thead>
//           <tr className="bg-transparent">
//             {headers.map((head, idx) => (
//               <th
//                 key={idx}
//                 className="px-6 py-2 text-[13px] font-bold text-[#A3AED0] text-center first:pl-10 last:pr-10"
//               >
//                 {head}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={headers.length}
//                 className="py-20 text-center text-[#A3AED0] bg-white rounded-[24px]"
//               >
//                 근무 기록이 없습니다.
//               </td>
//             </tr>
//           ) : (
//             data.map((item) => (
//               <tr
//                 key={item.id}
//                 onClick={() => onItemClick(item)}
//                 className="group bg-white hover:shadow-md transition-all duration-200 cursor-pointer text-center"
//               >
//                 {type === "view" ? (
//                   <>
//                     <td className="px-6 py-6 first:rounded-l-[24px] text-sm font-bold text-[#707EAE] border-y border-l border-transparent">
//                       {formatDate(item.date)}
//                     </td>
//                     <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent">
//                       {formatTime(item.clockIn, item.status)}
//                     </td>
//                     <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent">
//                       {formatTime(item.clockOut, item.status)}
//                     </td>
//                     <td className="px-6 py-6 text-sm font-medium text-[#707EAE] border-y border-transparent">
//                       {item.workMinutes !== null
//                         ? `${item.workMinutes}분`
//                         : "0분"}
//                     </td>
//                     {/* 1. 상태 컬럼 */}
//                     <td className="px-6 py-6 border-y border-transparent">
//                       <span
//                         className={`px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
//                       >
//                         {getStatusText(item.status)}
//                       </span>
//                     </td>
//                     {/* 2. 비고(사유) 컬럼 추가 - 이 부분이 빠져있어서 밀렸던 것! */}
//                     <td className="px-6 py-6 text-sm text-[#A3AED0] border-y border-transparent">
//                       {item.isFix ? "정정됨" : "-"}
//                     </td>
//                     {/* 3. 신청 버튼 컬럼 */}
//                     <td className="px-6 py-6 last:rounded-r-[24px] border-y border-r border-transparent last:pr-10">
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           router.push(
//                             `/attendance/correction/create?id=${item.id}`,
//                           );
//                         }}
//                         className="inline-block px-5 py-2.5 bg-[#4318FF] text-white rounded-xl text-[13px] font-bold shadow-md shadow-indigo-100 hover:bg-[#3311CC] transition-all active:scale-95"
//                       >
//                         정정 요청
//                       </button>
//                     </td>
//                   </>
//                 ) : (
//                   <>
//                     {/* 정정 신청 내역(STATISTICS) 탭용 레이아웃 (기존 유지) */}
//                     <td className="px-6 py-6 first:rounded-l-[24px] text-sm font-bold text-[#707EAE] border-y border-l border-transparent">
//                       {formatDate(item.createdAt)}
//                     </td>
//                     <td className="px-6 py-6 text-sm font-bold text-[#1B254B] border-y border-transparent">
//                       {formatDate(item.date)}
//                     </td>
//                     <td className="px-6 py-6 text-sm text-[#707EAE] border-y border-transparent truncate max-w-[200px]">
//                       {item.fixReason || "사유 미입력"}
//                     </td>
//                     <td className="px-6 py-6 border-y border-transparent">
//                       <span
//                         className={`px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
//                       >
//                         {getStatusText(item.status)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-6 last:rounded-r-[24px] border-y border-r border-transparent last:pr-10">
//                       <span className="text-sm font-bold text-[#1B254B]">
//                         {item.approverName || "미승인"}
//                       </span>
//                     </td>
//                   </>
//                 )}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

"use client";

import React from "react";
import { CombinedStatus, AttendanceWorkLog } from "@/types/attendance";
import { useRouter } from "next/navigation";

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

  const headers =
    type === "view"
      ? ["날짜", "출근", "퇴근", "근무시간", "출결", "정정 신청"]
      : ["신청일", "대상날짜", "정정 사유", "결재 상태", "승인자"];

  const getStatusStyle = (status: CombinedStatus) => {
    const styles: Record<string, string> = {
      NORMAL: "bg-[#EFFFF6] text-[#05CD99]",
      WORKING: "bg-[#FFF8E7] text-[#FFA800]",
      LATE: "bg-[#FFEEF2] text-[#EE5D50]",
      ABSENT: "bg-[#FFEEF2] text-[#EE5D50]",
      MISSING_OUT: "bg-[#FFEEF2] text-[#EE5D50]",
      LATE_EARLY: "bg-[#FFEEF2] text-[#EE5D50]",
      EARLY_LEAVE: "bg-[#FFEEF2] text-[#EE5D50]",
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

  const formatTime = (dateStr: string | null, status: CombinedStatus) => {
    if (!dateStr || status === "ABSENT") return "--:--";
    const d = new Date(dateStr);
    return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  };

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <table className="w-full min-w-[1000px] border-collapse">
        <thead>
          <tr className="border-b border-gray-100">
            {headers.map((head, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-[13px] font-bold text-[#A3AED0] text-center"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="py-20 text-center text-[#A3AED0]"
              >
                기록이 없습니다.
              </td>
            </tr>
          ) : (
            data.map((item) => {
              const isDisabled =
                item.isFix ||
                item.apprStatus === "PENDING" ||
                item.status === "NORMAL";

              return (
                <tr
                  key={item.id}
                  onClick={() => !isDisabled && onItemClick(item)}
                  className={`group transition-colors duration-200 text-center border-b border-gray-50 last:border-none
                    ${isDisabled ? "bg-white cursor-default" : "bg-white hover:bg-[#F7F9FF] cursor-pointer"}`}
                >
                  {type === "view" ? (
                    <>
                      <td className="px-6 py-5 text-sm font-bold text-[#707EAE]">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#1B254B]">
                        {formatTime(item.clockIn, item.status)}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#1B254B]">
                        {formatTime(item.clockOut, item.status)}
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-[#707EAE]">
                        {item.workMinutes !== null
                          ? `${item.workMinutes}분`
                          : "0분"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getStatusStyle(item.status)}`}
                        >
                          {attendanceTypeMap[item.status] || "기타"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
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
                            className={`inline-block px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all
                              ${isDisabled ? "bg-[#E0E5F2] text-[#A3AED0] cursor-not-allowed" : "bg-[#4318FF] text-white hover:bg-[#3311CC] active:scale-95"}`}
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
                      <td className="px-6 py-5 text-sm font-bold text-[#707EAE]">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-5 text-sm font-bold text-[#1B254B]">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-5 text-sm text-[#707EAE] truncate max-w-[200px]">
                        {item.fixReason || "사유 미입력"}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[12px] font-black inline-block ${getApprStatusStyle(item.apprStatus)}`}
                        >
                          {approvalStatusMap[item.apprStatus as string] ||
                            "처리 중"}
                        </span>
                      </td>
                      {/* 💡 승인자: 이름과 직급을 가로로 나란히 배치 */}
                      <td className="px-6 py-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <span className="text-sm font-bold text-[#1B254B]">
                            {item.approverName || "미정"}
                          </span>
                          {item.approverName && (
                            <span className="text-[12px] font-medium text-[#A3AED0]">
                              {/* 괄호 안에 직급 표시 (데이터 없을 시 기본값 설정 가능) */}
                              ({item.approverPosition || "팀장"})
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
