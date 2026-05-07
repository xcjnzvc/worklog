// "use client";

// import { VacationData } from "@/types/vacation";

// interface VacationTableProps {
//   data: VacationData[];
//   onItemClick: (item: VacationData) => void;
// }

// export const VacationTable = ({ data, onItemClick }: VacationTableProps) => {
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
//       <table className="w-full text-left min-w-[1000px] border-separate border-spacing-y-2">
//         <thead>
//           <tr className="bg-transparent">
//             {[
//               "번호",
//               "유형",
//               "시간",
//               "제목(내용)",
//               "휴가 기간",
//               "일수",
//               "상태",
//               "승인자",
//             ].map((head, idx) => (
//               <th
//                 key={idx}
//                 className={`px-6 py-4 text-[13px] font-bold text-[#A3AED0] uppercase tracking-wider ${head === "상태" || head === "승인자" ? "text-center" : ""}`}
//               >
//                 {head}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item) => (
//             <tr
//               key={item.id}
//               onClick={() => onItemClick(item)}
//               className="group bg-white hover:bg-[#F4F7FE]/50 cursor-pointer transition-all duration-200"
//             >
//               <td className="px-6 py-5 first:rounded-l-2xl border-y border-l border-[#F4F7FE] group-hover:border-[#E0E5F2]">
//                 <span className="text-sm font-bold text-[#707EAE]">
//                   {item.displayId}
//                 </span>
//               </td>
//               <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
//                 <span
//                   className={`text-[14px] font-extrabold ${item.type === "ANNUAL" ? "text-[#2357E5]" : "text-[#F69722]"}`}
//                 >
//                   {item.type === "ANNUAL" ? "연차" : "반차"}
//                 </span>
//               </td>
//               <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
//                 <span className="text-sm font-bold text-[#1B254B]">
//                   {item.timeDetail || "종일"}
//                 </span>
//               </td>
//               <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
//                 <span className="text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF] transition-colors line-clamp-1">
//                   {item.reason}
//                 </span>
//               </td>
//               <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
//                 <span className="text-sm font-medium text-[#707EAE]">
//                   {item.formattedPeriod}
//                 </span>
//               </td>
//               <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
//                 <span className="text-sm font-bold text-[#1B254B]">
//                   {item.durationText}
//                 </span>
//               </td>
//               <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2] text-center">
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
//               <td className="px-6 py-5 last:rounded-r-2xl border-y border-r border-[#F4F7FE] group-hover:border-[#E0E5F2] text-center">
//                 <span className="text-sm font-bold text-[#1B254B]">
//                   {item.approver || "-"}
//                 </span>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

"use client";

import React from "react";
// 1. 부모(page.tsx)에서 만든 타입을 가져옵니다.
import { VacationData } from "../page";

// 2. 부모 타입에 formattedPeriod를 합친 새로운 타입을 만듭니다.
export interface VacationTableRow extends VacationData {
  formattedPeriod: string;
}

interface VacationTableProps {
  data: VacationTableRow[]; // 3. 이제 any 대신 이 타입을 씁니다.
  onItemClick: (item: VacationData) => void;
}

export const VacationTable = ({ data, onItemClick }: VacationTableProps) => {
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
      <table className="w-full text-left min-w-[1000px] border-separate border-spacing-y-2">
        <thead>
          <tr className="bg-transparent">
            {[
              "번호",
              "유형",
              "시간",
              "제목(내용)",
              "휴가 기간",
              "일수",
              "상태",
              "승인자",
            ].map((head, idx) => (
              <th
                key={idx}
                className={`px-6 py-4 text-[13px] font-bold text-[#A3AED0] uppercase tracking-wider ${head === "상태" || head === "승인자" ? "text-center" : ""}`}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr
              key={item.id}
              onClick={() => onItemClick(item)}
              className="group bg-white hover:bg-[#F4F7FE]/50 cursor-pointer transition-all duration-200"
            >
              <td className="px-6 py-5 first:rounded-l-2xl border-y border-l border-[#F4F7FE] group-hover:border-[#E0E5F2]">
                <span className="text-sm font-bold text-[#707EAE]">
                  {item.displayId}
                </span>
              </td>
              <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
                <span
                  className={`text-[14px] font-extrabold ${item.type === "ANNUAL" ? "text-[#2357E5]" : "text-[#F69722]"}`}
                >
                  {item.type === "ANNUAL" ? "연차" : "반차"}
                </span>
              </td>
              <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
                <span className="text-sm font-bold text-[#1B254B]">
                  {item.timeDetail || "종일"}
                </span>
              </td>
              <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
                <span className="text-sm font-bold text-[#1B254B] group-hover:text-[#4318FF] transition-colors line-clamp-1">
                  {item.reason}
                </span>
              </td>
              <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
                <span className="text-sm font-medium text-[#707EAE]">
                  {item.formattedPeriod}
                </span>
              </td>
              <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2]">
                <span className="text-sm font-bold text-[#1B254B]">
                  {item.durationText}
                </span>
              </td>
              <td className="px-6 py-5 border-y border-[#F4F7FE] group-hover:border-[#E0E5F2] text-center">
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
              <td className="px-6 py-5 last:rounded-r-2xl border-y border-r border-[#F4F7FE] group-hover:border-[#E0E5F2] text-center">
                <span className="text-sm font-bold text-[#1B254B]">
                  {item.approver || "-"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
