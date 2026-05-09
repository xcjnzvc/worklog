// "use client";

// import React, { useState, useMemo } from "react";
// import { Plus, Clock, AlertCircle, CheckCircle, Search } from "lucide-react";
// import Link from "next/link";
// import { AttendanceTable } from "./_components/AttendanceTable";
// import AttendanceSummaryCard from "@/components/AttendanceSummaryCard";
// import { PageTabs } from "@/components/PageTabs";
// import { AttendanceTabType } from "@/types/attendance";

// // 탭 타입 정의

// const mockSummaryData = {
//   weeklySummary: {
//     period: "2026.05.04 - 2026.05.10",
//     totalHours: 40,
//     totalMinutes: 0,
//   },
//   dailyGraph: [
//     {
//       day: "월",
//       actualMinutes: 480,
//       targetMinutes: 480,
//       percent: 100,
//       status: "NORMAL" as const,
//     },
//     {
//       day: "화",
//       actualMinutes: 480,
//       targetMinutes: 480,
//       percent: 100,
//       status: "NORMAL" as const,
//     },
//     {
//       day: "수",
//       actualMinutes: 0,
//       targetMinutes: 480,
//       percent: 0,
//       status: "ABSENT" as const,
//     },
//     {
//       day: "목",
//       actualMinutes: 500,
//       targetMinutes: 480,
//       percent: 100,
//       status: "NORMAL" as const,
//     },
//     {
//       day: "금",
//       actualMinutes: 480,
//       targetMinutes: 480,
//       percent: 100,
//       status: "NORMAL" as const,
//     },
//   ],
// };

// export default function AttendancePage() {
//   const [activeTab, setActiveTab] = useState<AttendanceTabType>("LIST");
//   const [searchKeyword, setSearchKeyword] = useState("");

//   const ATTENDANCE_TABS: { value: AttendanceTabType; label: string }[] = [
//     { value: "LIST", label: "주간 근무 내역" },
//     { value: "STATISTICS", label: "정정 신청 내역" },
//   ];

//   // 가상의 데이터 (실제로는 useQuery 등으로 가져오기)
//   const attendanceData = useMemo(() => {
//     // 탭에 따라 다른 데이터를 보여주거나 필터링 로직 추가
//     return [];
//   }, [activeTab, searchKeyword]);

//   return (
//     <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1B254B]">
//       <div className="max-w-[1600px] mx-auto space-y-8">
//         {/* 헤더 영역 */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-[32px] font-black">근태 관리</h1>
//             <p className="text-[#A3AED0]">
//               이번 주 근태 현황을 확인하고 잘못된 기록은 정정을 요청할 수
//               있습니다.
//             </p>
//           </div>
//           <Link href="/attendance/correction/create">
//             <button className="flex items-center gap-2 bg-[#4318FF] text-white px-8 py-4 rounded-[20px] font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95">
//               <Plus size={20} /> 근태 정정 신청하기
//             </button>
//           </Link>
//         </div>

//         {/* 상단 섹션: 탭에 따라 다른 카드 보여주기 */}
//         {activeTab === "LIST" ? (
//           // <AttendanceSummaryCard data={mockSummaryData} />
//           <AttendanceSummaryCard showStats={false} />
//         ) : (
//           <div className="grid grid-cols-3 gap-6">
//             <StatCard
//               label="정정 요청중"
//               value="2건"
//               color="text-[#FFA800]"
//               icon={<AlertCircle />}
//             />
//             <StatCard
//               label="정정 완료"
//               value="15건"
//               color="text-[#05CD99]"
//               icon={<CheckCircle />}
//             />
//             <StatCard
//               label="이번 달 총 근무"
//               value="160h"
//               color="text-[#4318FF]"
//               icon={<Clock />}
//             />
//           </div>
//         )}

//         {/* 탭 + 검색바*/}
//         <PageTabs
//           tabs={ATTENDANCE_TABS}
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//           searchKeyword={searchKeyword}
//           onSearchChange={setSearchKeyword}
//           searchPlaceholder="내용 또는 승인자 검색..."
//         />

//         {/* 리스트 테이블 영역 */}
//         <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-[20px] font-bold">
//               {activeTab === "LIST" ? "주간 상세 기록" : "근태 정정 내역"}
//             </h3>
//             <span className="text-sm text-[#A3AED0] font-medium">
//               총 {attendanceData.length}건
//             </span>
//           </div>

//           <AttendanceTable
//             data={attendanceData}
//             type={activeTab === "LIST" ? "view" : "correction"}
//             onItemClick={(item) => console.log("상세보기:", item)}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// // 스태츠 카드 컴포넌트 (VacationPage와 동일 스타일)
// function StatCard({
//   label,
//   value,
//   color,
//   icon,
// }: {
//   label: string;
//   value: string;
//   color: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <div className="bg-white p-8 rounded-[32px] shadow-sm flex items-center gap-6">
//       <div
//         className={`w-14 h-14 rounded-2xl bg-[#F4F7FE] flex items-center justify-center ${color}`}
//       >
//         {icon}
//       </div>
//       <div>
//         <p className="text-sm font-bold text-[#A3AED0]">{label}</p>
//         <p className={`text-[28px] font-black ${color}`}>{value}</p>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { Plus, Clock, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { AttendanceTable } from "./_components/AttendanceTable";
import { PageTabs } from "@/components/PageTabs";
import { AttendanceTabType } from "@/types/attendance";

export default function AttendanceCorrectionPage() {
  // 현재는 정정 신청 내역만 존재하므로 기본값 고정
  const [activeTab, setActiveTab] = useState<AttendanceTabType>("STATISTICS");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 디자인 유지를 위해 탭 구성을 유지 (항목이 하나인 상태)
  const ATTENDANCE_TABS: { value: AttendanceTabType; label: string }[] = [
    { value: "STATISTICS", label: "정정 신청 내역" },
    // 추후 다른 페이지 기획 시 여기에 추가 가능
  ];

  // 가상의 데이터 (실제로는 useQuery 등으로 가져오기)
  const correctionData = useMemo(() => {
    // 검색어(searchKeyword)를 이용한 필터링 로직이 들어갈 자리입니다.
    return [];
  }, [searchKeyword]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1B254B]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* 헤더 영역 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-black">근태 정정 관리</h1>
            <p className="text-[#A3AED0]">
              신청하신 근태 정정 내역의 승인 상태를 확인하고 관리할 수 있습니다.
            </p>
          </div>
          <Link href="/attendance/correction/create">
            <button className="flex items-center gap-2 bg-[#4318FF] text-white px-8 py-4 rounded-[20px] font-bold shadow-lg shadow-indigo-200 transition-transform active:scale-95">
              <Plus size={20} /> 근태 정정 신청하기
            </button>
          </Link>
        </div>

        {/* 상단 섹션: 정정 관련 요약 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="정정 요청중"
            value="2건"
            color="text-[#FFA800]"
            icon={<AlertCircle />}
          />
          <StatCard
            label="정정 완료"
            value="15건"
            color="text-[#05CD99]"
            icon={<CheckCircle />}
          />
          <StatCard
            label="이번 달 총 근무"
            value="160h"
            color="text-[#4318FF]"
            icon={<Clock />}
          />
        </div>

        {/* 탭 + 검색바 (기존 디자인 레이아웃 유지) */}
        <PageTabs
          tabs={ATTENDANCE_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder="내용 또는 승인자 검색..."
        />

        {/* 리스트 테이블 영역 */}
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[20px] font-bold">근태 정정 내역 상세</h3>
            <span className="text-sm text-[#A3AED0] font-medium">
              총 {correctionData.length}건
            </span>
          </div>

          <AttendanceTable
            data={correctionData}
            type="correction" // 정정 내역용 테이블 레이아웃 고정
            onItemClick={(item) => console.log("상세보기:", item)}
          />
        </div>
      </div>
    </div>
  );
}

// 스태츠 카드 컴포넌트
function StatCard({
  label,
  value,
  color,
  icon,
}: {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm flex items-center gap-6">
      <div
        className={`w-14 h-14 rounded-2xl bg-[#F4F7FE] flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold text-[#A3AED0]">{label}</p>
        <p className={`text-[28px] font-black ${color}`}>{value}</p>
      </div>
    </div>
  );
}
