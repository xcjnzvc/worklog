// "use client";

// import React, { useState, useMemo } from "react";
// import { Plus, Calendar, PieChart, List } from "lucide-react";
// import { VacationTable, VacationTableRow } from "./_components/VacationTable";
// import Link from "next/link";
// import { useVacation } from "@/hooks/useVacation";
// import { VacationItem, VacationTabType } from "@/types/vacation";
// import { PageTabs } from "@/components/PageTabs";
// import { StatCard } from "@/components/StatCard";
// import { Pagination } from "@/components/Pagination";

// export default function VacationPage() {
//   const [currentPage, setCurrentPage] = useState(1);
//   const { useVacationList } = useVacation();
//   const { data, isLoading, isError } = useVacationList(currentPage);

//   console.log("전체 응답 데이터:", data);
//   console.log("메타데이터 확인:", data?.metadata);

//   const [activeTab, setActiveTab] = useState<VacationTabType>("LIST");
//   const [searchKeyword, setSearchKeyword] = useState("");

//   // 데이터 가공 및 필터링 영역
//   const filteredData = useMemo((): VacationTableRow[] => {
//     if (!data?.list) return [];
//     const list = data.list as VacationItem[];

//     // 1단계: 검색 키워드로 먼저 필터링 진행
//     const searchedList = list.filter(
//       (item) =>
//         item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
//         item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
//     );

//     // 2단계: 필터링된 결과의 인덱스를 기반으로 displayId를 '001', '002' 형태로 강제 오버라이딩
//     return searchedList.map(
//       (item, index): VacationTableRow => ({
//         ...item,
//         // 💡 고유 번호 대신 목록 순서대로 001, 002를 패딩하여 주입 (정순 처리)
//         displayId: String(index + 1).padStart(3, "0"),
//         formattedPeriod:
//           item.startDate === item.endDate
//             ? item.startDate
//             : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
//       }),
//     );
//   }, [data, searchKeyword]);

//   if (isLoading) return <div className="p-10">로딩 중...</div>;
//   if (isError || !data)
//     return <div className="p-10 text-red-500">에러 발생</div>;

//   return (
//     <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1B254B]">
//       <div className="max-w-[1600px] mx-auto space-y-8">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-[32px] font-black">휴가 관리</h1>
//             <p className="text-[#A3AED0]">
//               나의 휴가 현황을 확인하고 신청할 수 있습니다.
//             </p>
//           </div>
//           <Link href="/vacation/create">
//             <button className="flex items-center gap-2 bg-[#0029C0] text-white px-8 py-4 rounded-[20px] font-bold">
//               <Plus size={20} /> 새 휴가 신청하기
//             </button>
//           </Link>
//         </div>

//         <div className="grid grid-cols-3 gap-6">
//           <StatCard
//             label="총 연차"
//             value={`${data.summary.total}일`}
//             color="text-[#1B254B]"
//             icon={<Calendar />}
//           />
//           <StatCard
//             label="사용한 연차"
//             value={`${data.summary.used}일`}
//             color="text-[#4318FF]"
//             icon={<PieChart />}
//           />
//           <StatCard
//             label="잔여 연차"
//             value={`${data.summary.remaining}일`}
//             color="text-[#00B050]"
//             icon={<List />}
//           />
//         </div>

//         <PageTabs
//           tabs={[{ value: "LIST", label: "휴가 내역 목록" }]}
//           activeTab={activeTab}
//           onTabChange={setActiveTab}
//           searchKeyword={searchKeyword}
//           onSearchChange={setSearchKeyword}
//           searchPlaceholder="내용 또는 승인자 검색..."
//         />

//         <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
//           <div className="flex items-center justify-end mb-6">
//             <span className="text-sm text-[#A3AED0] font-medium">
//               총 {data.metadata?.totalCount || filteredData.length}건
//             </span>
//           </div>

//           {/* 💡 팁: 만약 번호가 모바일 화면에서 숨겨진다면,
//               `@/app/(main)/vacation/_components/VacationTable` 파일 내부 컴포넌트 단에서
//               displayId를 출력하는 <td> 혹은 <div> 태그에 'hidden' 또는 'md:block' 같은
//               반응형 제거 유틸리티 클래스가 들어있는지 확인해 주세요. */}
//           <VacationTable
//             data={filteredData}
//             onItemClick={(item) => console.log(item)}
//           />

//           <Pagination
//             currentPage={currentPage}
//             totalPages={data.metadata?.totalPages || 1}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useMemo } from "react";
import { Plus, Calendar, PieChart, List } from "lucide-react";
import { VacationTable, VacationTableRow } from "./_components/VacationTable";
import Link from "next/link";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem, VacationTabType } from "@/types/vacation";
import { PageTabs } from "@/components/PageTabs";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";

export default function VacationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { useVacationList } = useVacation();
  const { data, isLoading, isError } = useVacationList(currentPage);

  console.log("전체 응답 데이터:", data);
  console.log("메타데이터 확인:", data?.metadata);

  const [activeTab, setActiveTab] = useState<VacationTabType>("LIST");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 데이터 가공 및 필터링 영역
  const filteredData = useMemo((): VacationTableRow[] => {
    if (!data?.list) return [];
    const list = data.list as VacationItem[];

    // 1단계: 검색 키워드로 먼저 필터링 진행
    const searchedList = list.filter(
      (item) =>
        item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
    );

    // 2단계: 필터링된 결과의 인덱스를 기반으로 displayId를 '001', '002' 형태로 강제 오버라이딩
    return searchedList.map(
      (item, index): VacationTableRow => ({
        ...item,
        displayId: String(index + 1).padStart(3, "0"),
        formattedPeriod:
          item.startDate === item.endDate
            ? item.startDate
            : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
      }),
    );
  }, [data, searchKeyword]);

  if (isLoading) return <div className="p-10">로딩 중...</div>;
  if (isError || !data)
    return <div className="p-10 text-red-500">에러 발생</div>;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-4 md:p-10 font-sans text-[#1B254B] relative">
      <div className="max-w-[1600px] mx-auto space-y-6 md:space-y-8">
        {/* 헤더 영역: 타이틀 및 등록 버튼 */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[26px] md:text-[32px] font-black tracking-tight">
              휴가 관리
            </h1>
            <p className="text-xs md:text-sm text-[#A3AED0] mt-0.5">
              나의 휴가 현황을 확인하고 신청할 수 있습니다.
            </p>
          </div>

          {/* 데스크탑/태블릿 전용 버튼 (sm 미만 해상도 찌러짐 방지용 hidden) */}
          <Link href="/vacation/create" className="hidden sm:block shrink-0">
            <button className="flex items-center gap-2 bg-[#0029C0] text-white px-6 md:px-8 py-3.5 md:py-4 rounded-[20px] font-bold text-sm md:text-base hover:bg-[#002094] transition-colors active:scale-95 duration-200">
              <Plus size={20} /> 새 휴가 신청하기
            </button>
          </Link>
        </div>

        {/* 💡 대시보드 통계 카드 반응형 그리드 수정
            grid-cols-1 (모바일에서 세로로 1개씩 이쁘게 쌓임)
            md:grid-cols-3 (태블릿/PC 폭 확보 시 원래대로 가로 3열 정렬) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            label="총 연차"
            value={`${data.summary.total}일`}
            color="text-[#1B254B]"
            icon={<Calendar />}
          />
          <StatCard
            label="사용한 연차"
            value={`${data.summary.used}일`}
            color="text-[#4318FF]"
            icon={<PieChart />}
          />
          <StatCard
            label="잔여 연차"
            value={`${data.summary.remaining}일`}
            color="text-[#00B050]"
            icon={<List />}
          />
        </div>

        <PageTabs
          tabs={[{ value: "LIST", label: "휴가 내역 목록" }]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder="내용 또는 승인자 검색..."
        />

        <div className="bg-white p-4 md:p-8 rounded-[24px] md:rounded-[32px] shadow-sm border border-gray-50">
          <div className="flex items-center justify-end mb-4 md:mb-6">
            <span className="text-xs md:text-sm text-[#A3AED0] font-medium">
              총 {data.metadata?.totalCount || filteredData.length}건
            </span>
          </div>

          <VacationTable
            data={filteredData}
            onItemClick={(item) => console.log(item)}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={data.metadata?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 모바일 전용 플로팅 액션 플러스 버튼 */}
      <Link
        href="/vacation/create"
        className="sm:hidden fixed bottom-6 right-6 z-50"
      >
        <button className="w-14 h-14 bg-[#0029C0] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-800/40 active:scale-90 transition-transform">
          <Plus size={28} />
        </button>
      </Link>
    </div>
  );
}
