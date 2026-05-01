// import React, { useState } from "react";
// import { Search, Calendar, Clock, ChevronRight } from "lucide-react";
// import { VacationItem, VacationTableRow } from "@/types/vacation";

// /**
//  * 1. 완벽하게 디자인이 반영된 테이블 컴포넌트
//  */
// const VacationTable = ({
//   data,
//   onItemClick,
// }: {
//   data: VacationTableRow[];
//   onItemClick: (item: VacationTableRow) => void;
// }) => {
//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case "APPROVED":
//         return "bg-[#EFFFF6] text-[#00B050] border-[#D1F7E2]";
//       case "PENDING":
//         return "bg-[#FFF7E6] text-[#FAAD14] border-[#FFE7BA]";
//       case "REJECTED":
//         return "bg-[#FFF2F2] text-[#FF4D4F] border-[#FFD6D6]";
//       default:
//         return "bg-gray-50 text-gray-500 border-gray-100";
//     }
//   };

//   return (
//     <div className="w-full overflow-x-auto bg-white rounded-[32px] border border-[#F4F7FE] shadow-sm">
//       <table className="w-full text-left min-w-[1000px] border-separate border-spacing-0">
//         <thead className="bg-[#F8F9FD]">
//           <tr>
//             <th className="px-8 py-5 text-[13px] font-bold text-[#A3AED0] w-20 first:rounded-tl-2xl">
//               NO.
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center">
//               유형
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
//               제목(내용)
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
//               휴가 기간
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
//               시간/일수
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center">
//               상태
//             </th>
//             <th className="px-8 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center last:rounded-tr-2xl">
//               승인자
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-[#F4F7FE]">
//           {data.map((item, index) => (
//             <tr
//               key={item.id}
//               onClick={() => onItemClick(item)}
//               className="hover:bg-[#F4F7FE]/50 cursor-pointer group transition-colors"
//             >
//               <td className="px-8 py-6 text-sm text-[#A3AED0] font-medium">
//                 {index + 1}
//               </td>
//               <td className="px-6 py-6 text-center">
//                 <span
//                   className={`inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold border ${item.type === "ANNUAL" ? "bg-[#EBF3FF] text-[#4318FF] border-[#D1E4FF]" : "bg-[#FFF2E8] text-[#FA541C] border-[#FFD8BF]"}`}
//                 >
//                   {item.type === "ANNUAL" ? "연차" : "반차"}
//                 </span>
//               </td>
//               <td className="px-6 py-6 text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF]">
//                 {item.reason}
//               </td>
//               <td className="px-6 py-6 text-sm font-medium text-[#707EAE]">
//                 {item.formattedPeriod}
//               </td>
//               <td className="px-6 py-6 text-sm font-bold text-[#707EAE] flex items-center gap-2">
//                 {item.type === "ANNUAL" ? (
//                   <Calendar size={14} className="text-[#4318FF]" />
//                 ) : (
//                   <Clock size={14} className="text-[#FA541C]" />
//                 )}
//                 {item.durationText}
//               </td>
//               <td className="px-6 py-6 text-center">
//                 <span
//                   className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-black border ${getStatusStyle(item.status)}`}
//                 >
//                   {item.status === "APPROVED"
//                     ? "승인 완료"
//                     : item.status === "PENDING"
//                       ? "승인 대기"
//                       : "반려됨"}
//                 </span>
//               </td>
//               <td className="px-8 py-6 text-sm text-center font-bold text-[#1B254B]">
//                 {item.approver || "-"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// /**
//  * 2. 전체 대시보드 메인 컴포넌트
//  */
// export default function VacationDashboard() {
//   const [activeTab, setActiveTab] = useState<"LIST" | "APPLY">("LIST");

//   // 데이터 가공 로직 (Mock)
//   const rawData: VacationItem[] = [
//     {
//       id: "1",
//       type: "ANNUAL",
//       startDate: "2026.01.01",
//       endDate: "2026.01.02",
//       status: "APPROVED",
//       reason: "개인 사유 연차 신청합니다.",
//       createdAt: "2025-12-20",
//       timeRange: "Full-day",
//       approver: "김팀장",
//     },
//   ];
//   const tableData: VacationTableRow[] = rawData.map((item) => ({
//     ...item,
//     formattedPeriod: `${item.startDate} ~ ${item.endDate}`,
//     durationText: item.type === "ANNUAL" ? "2일" : item.timeRange,
//   }));

//   return (
//     <div className="w-full min-h-screen bg-[#F8F9FA] p-10">
//       <div className="max-w-[1600px] mx-auto space-y-6">
//         {/* 탭 네비게이션 */}
//         <div className="flex items-center gap-2">
//           {["LIST", "APPLY"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab as any)}
//               className={`px-6 py-3 rounded-xl text-sm font-black transition-all ${activeTab === tab ? "bg-[#4318FF] text-white shadow-lg shadow-blue-200" : "text-[#A3AED0] hover:bg-white"}`}
//             >
//               {tab === "LIST" ? "휴가 목록" : "휴가 신청"}
//             </button>
//           ))}
//         </div>

//         {/* 컨텐츠 카드 */}
//         {activeTab === "LIST" ? (
//           <div className="space-y-6">
//             {/* 1. 검색 영역 박스 */}
//             <div className="bg-white rounded-[32px] shadow-sm border border-[#F4F7FE] p-8">
//               <div className="flex gap-4">
//                 <input
//                   className="flex-1 bg-[#F4F7FE] rounded-2xl py-4 px-6 text-sm outline-none"
//                   placeholder="검색어를 입력하세요..."
//                 />
//                 <button className="px-8 bg-[#1B254B] text-white rounded-2xl font-bold">
//                   조회
//                 </button>
//               </div>
//             </div>

//             {/* 2. 테이블 영역 박스 (별도 분리) */}
//             <div className="bg-white rounded-[32px] shadow-sm border border-[#F4F7FE] p-8">
//               <VacationTable
//                 data={tableData}
//                 onItemClick={(item) => console.log(item)}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-[32px] shadow-sm border border-[#F4F7FE] p-8 text-center py-20 font-bold text-[#1B254B]">
//             신청 폼 영역
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// import React, { useState } from "react";
// import { Calendar, Clock } from "lucide-react";
// import { VacationItem, VacationTableRow } from "@/types/vacation";

// /**
//  * 1. 디자인이 반영된 테이블 컴포넌트
//  */
// const VacationTable = ({
//   data,
//   onItemClick,
// }: {
//   data: VacationTableRow[];
//   onItemClick: (item: VacationTableRow) => void;
// }) => {
//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case "APPROVED":
//         return "bg-[#EFFFF6] text-[#00B050] border-[#D1F7E2]";
//       case "PENDING":
//         return "bg-[#FFF7E6] text-[#FAAD14] border-[#FFE7BA]";
//       case "REJECTED":
//         return "bg-[#FFF2F2] text-[#FF4D4F] border-[#FFD6D6]";
//       default:
//         return "bg-gray-50 text-gray-500 border-gray-100";
//     }
//   };

//   return (
//     <div className="w-full overflow-x-auto">
//       <table className="w-full text-left min-w-[1000px] border-separate border-spacing-0">
//         <thead className="bg-[#F8F9FD]">
//           <tr>
//             <th className="px-8 py-5 text-[13px] font-bold text-[#A3AED0] w-20 first:rounded-tl-2xl">
//               NO.
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center">
//               유형
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
//               제목(내용)
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
//               휴가 기간
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
//               시간/일수
//             </th>
//             <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center">
//               상태
//             </th>
//             <th className="px-8 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center last:rounded-tr-2xl">
//               승인자
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-[#F4F7FE]">
//           {data.map((item, index) => {
//             const isHalfLeave = item.type !== "ANNUAL";
//             const iconColor = isHalfLeave ? "#F69722" : "#2357E5";
//             const typeBgColor = isHalfLeave ? "#FFF7ED" : "#DBEAFE";
//             const typeTextColor = isHalfLeave ? "#F69722" : "#2357E5";
//             const typeBorderColor = isHalfLeave ? "#FFE7D6" : "#BFDBFE";

//             return (
//               <tr
//                 key={item.id}
//                 onClick={() => onItemClick(item)}
//                 className="hover:bg-[#F4F7FE]/50 cursor-pointer group transition-colors"
//               >
//                 <td className="px-8 py-6 text-sm text-[#A3AED0] font-medium">
//                   {index + 1}
//                 </td>
//                 <td className="px-6 py-6 text-center">
//                   <span
//                     className="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold border"
//                     style={{
//                       backgroundColor: typeBgColor,
//                       color: typeTextColor,
//                       borderColor: typeBorderColor,
//                     }}
//                   >
//                     {item.type === "ANNUAL" ? "연차" : "반차"}
//                   </span>
//                 </td>
//                 <td className="px-6 py-6 text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF]">
//                   {item.reason}
//                 </td>
//                 <td className="px-6 py-6 text-sm font-medium text-[#707EAE]">
//                   {item.formattedPeriod}
//                 </td>
//                 <td className="px-6 py-6 text-sm font-bold text-[#707EAE] flex items-center gap-2">
//                   {item.type === "ANNUAL" ? (
//                     <Calendar size={14} style={{ color: iconColor }} />
//                   ) : (
//                     <Clock size={14} style={{ color: iconColor }} />
//                   )}
//                   {item.durationText}
//                 </td>
//                 <td className="px-6 py-6 text-center">
//                   <span
//                     className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-black border ${getStatusStyle(item.status)}`}
//                   >
//                     {item.status === "APPROVED"
//                       ? "승인 완료"
//                       : item.status === "PENDING"
//                         ? "승인 대기"
//                         : "반려됨"}
//                   </span>
//                 </td>
//                 <td className="px-8 py-6 text-sm text-center font-bold text-[#1B254B]">
//                   {item.approver || "-"}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// /**
//  * 2. 전체 대시보드 메인 컴포넌트
//  */
// export default function VacationDashboard() {
//   const [activeTab, setActiveTab] = useState<"LIST" | "APPLY">("LIST");

//   const rawData: VacationItem[] = [
//     {
//       id: "1",
//       type: "ANNUAL",
//       startDate: "2026.01.01",
//       endDate: "2026.01.02",
//       status: "APPROVED",
//       reason: "개인 사유 연차 신청합니다.",
//       createdAt: "2025-12-20",
//       timeRange: "Full-day",
//       approver: "김팀장",
//     },
//     {
//       id: "2",
//       type: "HALF_PM",
//       startDate: "2026.01.05",
//       endDate: "2026.01.05",
//       status: "PENDING",
//       reason: "오후 병원 진료 건",
//       createdAt: "2026-01-04",
//       timeRange: "14:00 - 18:00",
//       approver: "김팀장",
//     },
//   ];
//   const tableData: VacationTableRow[] = rawData.map((item) => ({
//     ...item,
//     formattedPeriod: `${item.startDate} ~ ${item.endDate}`,
//     durationText: item.type === "ANNUAL" ? "2일" : item.timeRange,
//   }));

//   return (
//     <div className="w-full min-h-screen bg-[#F8F9FA] p-10">
//       <div className="max-w-[1600px] mx-auto space-y-6">
//         {/* 탭 메뉴 */}
//         <div className="flex items-center gap-8 border-b border-[#E0E5F2]">
//           {["LIST", "APPLY"].map((tab) => {
//             const isActive = activeTab === tab;
//             return (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab as any)}
//                 className={`relative pb-4 font-black transition-all duration-300 ${
//                   isActive
//                     ? "text-[24px] text-[#1B254B]"
//                     : "text-[18px] text-[#A3AED0] hover:text-[#4318FF]"
//                 }`}
//               >
//                 {tab === "LIST" ? "휴가 목록" : "휴가 신청"}
//                 {isActive && (
//                   <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4318FF] rounded-t-full" />
//                 )}
//               </button>
//             );
//           })}
//         </div>

//         {/* 컨텐츠 영역 */}
//         {activeTab === "LIST" ? (
//           <div className="space-y-6">
//             <div className="bg-white rounded-[24px] shadow-sm py-3 px-6 border border-[#E0E5F2]">
//               <div className="flex gap-3 items-center">
//                 {/* 카테고리 & 상태 (h-12로 수정) */}
//                 {["카테고리", "상태"].map((label) => (
//                   <div
//                     key={label}
//                     className="h-12 flex items-center justify-between px-5 border border-[#E0E5F2] rounded-xl min-w-[130px] cursor-pointer hover:border-[#4318FF] transition-all"
//                   >
//                     <span className="text-[13px] font-medium text-[#1B254B]">
//                       {label}
//                     </span>
//                     <svg
//                       width="10"
//                       height="6"
//                       viewBox="0 0 12 8"
//                       fill="none"
//                       className="ml-2"
//                     >
//                       <path
//                         d="M1 1.5L6 6.5L11 1.5"
//                         stroke="#1B254B"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </div>
//                 ))}

//                 {/* 날짜 범위 (h-12로 수정) */}
//                 <div className="h-12 flex items-center gap-2 px-5 border border-[#E0E5F2] rounded-xl cursor-pointer hover:border-[#4318FF] transition-all">
//                   <span className="text-[13px] text-[#A3AED0]">
//                     연도. 월. 일.
//                   </span>
//                   <Calendar size={14} className="text-[#1B254B]" />
//                   <span className="text-[#A3AED0]">~</span>
//                   <span className="text-[13px] text-[#A3AED0]">
//                     연도. 월. 일.
//                   </span>
//                   <Calendar size={14} className="text-[#1B254B]" />
//                 </div>

//                 {/* 검색어 (h-12로 수정) */}
//                 <input
//                   className="h-12 flex-1 bg-[#F4F7FE] rounded-xl px-5 text-[13px] outline-none"
//                   placeholder="검색어를 입력하세요..."
//                 />

//                 {/* 조회 버튼 (h-12로 수정) */}
//                 <button className="h-12 px-6 bg-[#0029C0] text-white rounded-xl text-[13px] font-bold">
//                   조회
//                 </button>
//               </div>
//             </div>
//             <div className="bg-white rounded-[32px] shadow-sm border border-[#F4F7FE] p-8">
//               <VacationTable
//                 data={tableData}
//                 onItemClick={(item) => console.log(item)}
//               />
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-[32px] shadow-sm border border-[#F4F7FE] p-8 text-center py-20 font-bold text-[#1B254B]">
//             신청 폼 영역
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useState, useMemo } from "react";
import { Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { parse, isWithinInterval } from "date-fns";
import { VacationItem, VacationTableRow } from "@/types/vacation";

/**
 * 1. 하위 컴포넌트: VacationTable
 * 타입을 명확히 규정하여 'any' 에러를 방지합니다.
 */
interface VacationTableProps {
  data: VacationTableRow[];
  onItemClick: (item: VacationTableRow) => void;
}

const VacationTable = ({ data, onItemClick }: VacationTableProps) => {
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-[#EFFFF6] text-[#00B050] border-[#D1F7E2]";
      case "PENDING":
        return "bg-[#FFF7E6] text-[#FAAD14] border-[#FFE7BA]";
      case "REJECTED":
        return "bg-[#FFF2F2] text-[#FF4D4F] border-[#FFD6D6]";
      default:
        return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left min-w-[1000px] border-separate border-spacing-0">
        <thead className="bg-[#F8F9FD]">
          <tr>
            <th className="px-8 py-5 text-[13px] font-bold text-[#A3AED0] w-20 first:rounded-tl-2xl">
              NO.
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center">
              유형
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
              제목(내용)
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
              휴가 기간
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0]">
              시간/일수
            </th>
            <th className="px-6 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center">
              상태
            </th>
            <th className="px-8 py-5 text-[13px] font-bold text-[#A3AED0] w-32 text-center last:rounded-tr-2xl">
              승인자
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F4F7FE]">
          {data.map((item, index) => (
            <tr
              key={item.id}
              onClick={() => onItemClick(item)}
              className="hover:bg-[#F4F7FE]/50 cursor-pointer group transition-colors"
            >
              <td className="px-8 py-6 text-sm text-[#A3AED0] font-medium">
                {index + 1}
              </td>
              <td className="px-6 py-6 text-center">
                <span
                  className="inline-flex items-center px-3 py-1 rounded-lg text-[12px] font-bold border"
                  style={{
                    backgroundColor:
                      item.type === "ANNUAL" ? "#DBEAFE" : "#FFF7ED",
                    color: item.type === "ANNUAL" ? "#2357E5" : "#F69722",
                    borderColor: item.type === "ANNUAL" ? "#BFDBFE" : "#FFE7D6",
                  }}
                >
                  {item.type === "ANNUAL" ? "연차" : "반차"}
                </span>
              </td>
              <td className="px-6 py-6 text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF]">
                {item.reason}
              </td>
              <td className="px-6 py-6 text-sm font-medium text-[#707EAE]">
                {item.formattedPeriod}
              </td>
              <td className="px-6 py-6 text-sm font-bold text-[#707EAE] flex items-center gap-2">
                {item.type === "ANNUAL" ? (
                  <Calendar size={14} />
                ) : (
                  <Clock size={14} />
                )}
                {item.durationText}
              </td>
              <td className="px-6 py-6 text-center">
                <span
                  className={`inline-flex items-center px-4 py-1.5 rounded-full text-[12px] font-black border ${getStatusStyle(item.status)}`}
                >
                  {item.status === "APPROVED"
                    ? "승인 완료"
                    : item.status === "PENDING"
                      ? "승인 대기"
                      : "반려됨"}
                </span>
              </td>
              <td className="px-8 py-6 text-sm text-center font-bold text-[#1B254B]">
                {item.approver || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * 2. 메인 컴포넌트
 */
export default function VacationDashboard() {
  const [activeTab, setActiveTab] = useState<"LIST" | "APPLY">("LIST");
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "ALL",
    status: "ALL",
    startDate: null as Date | null,
    endDate: null as Date | null,
    keyword: "",
  });

  const rawData: VacationItem[] = [
    {
      id: "1",
      type: "ANNUAL",
      startDate: "2026.01.01",
      endDate: "2026.01.02",
      status: "APPROVED",
      reason: "개인 사유 연차 신청합니다.",
      createdAt: "2025-12-20",
      timeRange: "Full-day",
      approver: "김팀장",
    },
    {
      id: "2",
      type: "HALF_PM",
      startDate: "2026.01.05",
      endDate: "2026.01.05",
      status: "PENDING",
      reason: "오후 병원 진료 건",
      createdAt: "2026-01-04",
      timeRange: "14:00 - 18:00",
      approver: "김팀장",
    },
  ];

  const tableData: VacationTableRow[] = useMemo(
    () =>
      rawData.map((item) => ({
        ...item,
        formattedPeriod: `${item.startDate} ~ ${item.endDate}`,
        durationText: item.type === "ANNUAL" ? "2일" : item.timeRange,
      })),
    [rawData],
  );

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const itemDate = parse(item.startDate, "yyyy.MM.dd", new Date());
      const matchCat =
        filters.category === "ALL" ||
        (filters.category === "ANNUAL"
          ? item.type === "ANNUAL"
          : item.type !== "ANNUAL");
      const matchStat =
        filters.status === "ALL" || item.status === filters.status;
      const matchKeyword = item.reason.includes(filters.keyword);
      const matchDate =
        !filters.startDate ||
        !filters.endDate ||
        isWithinInterval(itemDate, {
          start: filters.startDate,
          end: filters.endDate,
        });
      return matchCat && matchStat && matchKeyword && matchDate;
    });
  }, [filters, tableData]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-10">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex items-center gap-8 border-b border-[#E0E5F2]">
          {(["LIST", "APPLY"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative pb-4 font-black transition-all duration-300 ${activeTab === tab ? "text-[24px] text-[#1B254B]" : "text-[18px] text-[#A3AED0]"}`}
            >
              {tab === "LIST" ? "휴가 목록" : "휴가 신청"}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4318FF] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {activeTab === "LIST" ? (
          <div className="bg-white rounded-[14px] shadow-sm border border-[#F4F7FE] p-8">
            <VacationTable
              data={filteredData}
              onItemClick={(item: VacationTableRow) => console.log(item)}
            />
          </div>
        ) : (
          <div className="p-20 text-center font-bold">신청 폼 영역</div>
        )}
      </div>
    </div>
  );
}
