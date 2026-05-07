// "use client";

// import React, { useState, useMemo } from "react";
// import { VacationTabs } from "./_components/VacationTabs";
// import { VacationTable, VacationTableRow } from "./_components/VacationTable";

// /**
//  * 1. 기본 데이터 타입 정의
//  */
// export interface VacationData {
//   id: string;
//   displayId: string;
//   type: "ANNUAL" | "HALF";
//   startDate: string;
//   endDate: string;
//   status: "APPROVED" | "PENDING" | "REJECTED";
//   reason: string;
//   durationText: string;
//   approver: string;
//   timeDetail: string | null;
// }

// /**
//  * 2. 가상 데이터 (API 연결 시 이 구조로 데이터를 받게 됩니다)
//  */
// const RAW_DATA: VacationData[] = [
//   {
//     id: "1",
//     displayId: "001",
//     type: "ANNUAL",
//     startDate: "2026.04.18",
//     endDate: "2026.04.20",
//     status: "APPROVED",
//     reason: "가족 여행으로 인한 연차 신청",
//     durationText: "2.0일",
//     approver: "김팀장",
//     timeDetail: null,
//   },
//   {
//     id: "2",
//     displayId: "002",
//     type: "HALF",
//     startDate: "2026.04.25",
//     endDate: "2026.04.25",
//     status: "PENDING",
//     reason: "개인 용무로 인한 오전 반차",
//     durationText: "0.5일",
//     approver: "이이사",
//     timeDetail: "오전",
//   },
//   {
//     id: "3",
//     displayId: "003",
//     type: "HALF",
//     startDate: "2026.04.28",
//     endDate: "2026.04.28",
//     status: "APPROVED",
//     reason: "오후 병원 진료 건",
//     durationText: "0.5일",
//     approver: "박대표",
//     timeDetail: "오후",
//   },
// ];

// export default function VacationPage() {
//   const [activeTab, setActiveTab] = useState<"LIST" | "APPLY">("LIST");
//   const [searchKeyword, setSearchKeyword] = useState("");

//   /**
//    * 3. 테이블에 전달할 데이터 가공 (formattedPeriod 추가)
//    * 반환 타입을 VacationTableRow[]로 지정하여 'any'를 제거합니다.
//    */
//   const filteredData = useMemo((): VacationTableRow[] => {
//     const formatted = RAW_DATA.map((item) => ({
//       ...item,
//       formattedPeriod:
//         item.startDate === item.endDate
//           ? item.startDate
//           : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
//     }));

//     return formatted.filter(
//       (item) =>
//         item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//         item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
//     );
//   }, [searchKeyword]);

//   return (
//     <div className="w-full min-h-screen bg-[#F4F7FE] p-6 md:p-10 font-sans text-[#1B254B]">
//       <div className="max-w-[1600px] mx-auto space-y-8">
//         {/* 상단 탭 및 검색 컴포넌트 */}
//         <VacationTabs
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//           searchKeyword={searchKeyword}
//           onSearchChange={setSearchKeyword}
//         />

//         {activeTab === "LIST" ? (
//           <div className="space-y-6">
//             {/* 통계 요약 섹션 */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               {[
//                 ["총 연차", "15.0일", "text-[#1B254B]"],
//                 ["사용한 연차", "2.0일", "text-[#4318FF]"],
//                 ["잔여 연차", "13.0일", "text-[#00B050]"],
//               ].map(([title, val, color], i) => (
//                 <div
//                   key={i}
//                   className="bg-white p-6 rounded-3xl shadow-sm border border-[#F4F7FE]"
//                 >
//                   <p className="text-sm font-bold text-[#A3AED0]">{title}</p>
//                   <p className={`text-2xl font-black mt-1 ${color}`}>{val}</p>
//                 </div>
//               ))}
//             </div>

//             {/* 휴가 목록 테이블 컴포넌트 */}
//             <VacationTable
//               data={filteredData} // any 없이 정상적으로 전달됨
//               onItemClick={(item: VacationData) =>
//                 console.log("선택된 휴가:", item)
//               }
//             />

//             {/* 검색 결과가 없을 때 */}
//             {filteredData.length === 0 && (
//               <div className="py-20 text-center">
//                 <p className="text-[#A3AED0] font-bold">
//                   검색 결과가 없습니다.
//                 </p>
//               </div>
//             )}
//           </div>
//         ) : (
//           /* 휴가 신청 섹션 (준비 중) */
//           <div className="bg-white rounded-3xl p-20 text-center border border-[#F4F7FE] shadow-sm">
//             <h3 className="text-xl font-black mb-2">휴가 신청하기</h3>
//             <p className="text-[#A3AED0] font-medium">준비중인 서비스입니다.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { VacationTabs } from "./_components/VacationTabs";
import { VacationTable, VacationTableRow } from "./_components/VacationTable";

/** * 1. 탭 전용 타입을 별도로 정의합니다.
 * VacationTabs 컴포넌트에서도 이 타입을 가져다 쓰면 완벽합니다.
 */
export type VacationTabType = "LIST" | "APPLY" | "STATISTICS";

export interface VacationData {
  id: string;
  displayId: string;
  type: "ANNUAL" | "HALF";
  startDate: string;
  endDate: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  reason: string;
  durationText: string;
  approver: string;
  timeDetail: string | null;
}

const RAW_DATA: VacationData[] = [
  {
    id: "1",
    displayId: "001",
    type: "ANNUAL",
    startDate: "2026.04.18",
    endDate: "2026.04.20",
    status: "APPROVED",
    reason: "가족 여행",
    durationText: "2.0일",
    approver: "김팀장",
    timeDetail: null,
  },
  {
    id: "2",
    displayId: "002",
    type: "HALF",
    startDate: "2026.04.25",
    endDate: "2026.04.25",
    status: "PENDING",
    reason: "오전 반차",
    durationText: "0.5일",
    approver: "이이사",
    timeDetail: "오전",
  },
];

export default function VacationPage() {
  // 2. useState에 정의한 탭 타입을 명시합니다.
  const [activeTab, setActiveTab] = useState<VacationTabType>("LIST");
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredData = useMemo((): VacationTableRow[] => {
    const formatted = RAW_DATA.map((item) => ({
      ...item,
      formattedPeriod:
        item.startDate === item.endDate
          ? item.startDate
          : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
    }));
    return formatted.filter(
      (item) =>
        item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
    );
  }, [searchKeyword]);

  /** * 3. 객체의 키를 VacationTabType으로 제한합니다.
   */
  const TabContent: Record<VacationTabType, React.ReactNode> = {
    LIST: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ["총 연차", "15.0일", "text-[#1B254B]"],
            ["사용한 연차", "2.0일", "text-[#4318FF]"],
            ["잔여 연차", "13.0일", "text-[#00B050]"],
          ].map(([title, val, color], i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-sm border border-[#F4F7FE]"
            >
              <p className="text-sm font-bold text-[#A3AED0]">{title}</p>
              <p className={`text-2xl font-black mt-1 ${color}`}>{val}</p>
            </div>
          ))}
        </div>
        <VacationTable
          data={filteredData}
          onItemClick={(item) => console.log(item)}
        />
      </div>
    ),
    APPLY: (
      <div className="bg-white rounded-3xl p-20 text-center border border-[#F4F7FE] shadow-sm">
        <h3 className="text-xl font-black mb-2">휴가 신청하기</h3>
        <p className="text-[#A3AED0] font-medium">준비중인 서비스입니다.</p>
      </div>
    ),
    STATISTICS: (
      <div className="bg-white rounded-3xl p-20 text-center border border-[#F4F7FE] shadow-sm">
        <h3 className="text-xl font-black mb-2">통계 보기</h3>
        <p className="text-[#A3AED0] font-medium">차트 준비중...</p>
      </div>
    ),
  };

  return (
    <div className="w-full min-h-screen bg-[#F4F7FE] p-6 md:p-10 font-sans text-[#1B254B]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <VacationTabs
          activeTab={activeTab} // 이제 any 없이 호환됩니다.
          onTabChange={(tab) => setActiveTab(tab as VacationTabType)} // 명확한 타입 캐스팅
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
        />

        {TabContent[activeTab]}
      </div>
    </div>
  );
}
