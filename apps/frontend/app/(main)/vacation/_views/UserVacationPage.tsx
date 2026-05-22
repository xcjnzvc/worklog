"use client";

import { useState, useMemo } from "react";
import { Plus, Calendar, PieChart, List } from "lucide-react";
import Link from "next/link";
import { PageTabs } from "@/components/PageTabs";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { VacationTable } from "../_components/VacationTable";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem, VacationTableRow } from "@/types/vacation";
import { ListPageLayout } from "@/components/ListPageLayout";

export default function UserVacationPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { useVacationList } = useVacation();
  const { data, isLoading, isError } = useVacationList(currentPage);

  // 검색 및 데이터 포맷팅 필터링 로직
  const filteredData = useMemo((): VacationTableRow[] => {
    if (!data?.list) return [];
    return (data.list as VacationItem[])
      .filter(
        (item) =>
          item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
      )
      .map((item, index) => ({
        ...item,
        displayId: String(index + 1).padStart(3, "0"),
        formattedPeriod:
          item.startDate === item.endDate
            ? item.startDate
            : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
      }));
  }, [data, searchKeyword]);

  if (isLoading) return <div className="p-10">로딩 중...</div>;
  if (isError || !data)
    return <div className="p-10 text-red-500">에러 발생</div>;

  return (
    <>
      <ListPageLayout
        title="휴가 관리"
        description="나의 휴가 현황을 확인하고 신청할 수 있습니다."
        // 1. 우측 상단 새 휴가 신청 버튼
        headerRight={
          <Link href="/vacation/create" className="hidden sm:block shrink-0">
            <button className="flex items-center gap-2 bg-[#0029C0] text-white px-6 py-3.5 rounded-[20px] font-bold text-sm hover:bg-[#002094] transition-colors">
              <Plus size={18} /> 새 휴가 신청하기
            </button>
          </Link>
        }
        // 2. 상단 연차 현황 통계 카드들
        stats={
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
        }
        // 3. 검색 창이 포함된 탭 영역
        tabs={
          <PageTabs
            tabs={[{ value: "MY" as const, label: "휴가 내역 목록" }]}
            activeTab="MY"
            onTabChange={() => {}}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
            searchPlaceholder="내용 또는 승인자 검색..."
          />
        }
      >
        {/* 4. Children 영역: 테이블 + 페이지네이션 */}
        <VacationTable
          data={filteredData}
          onItemClick={(item) => console.log(item)}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={data.metadata?.totalPages || 1}
          onPageChange={setCurrentPage}
        />
      </ListPageLayout>

      {/* 5. 레이아웃 외부 고정 위치 요소: 모바일 플로팅 버튼 */}
      <Link
        href="/vacation/create"
        className="sm:hidden fixed bottom-6 right-6 z-50"
      >
        <button className="w-14 h-14 bg-[#0029C0] text-white rounded-full flex items-center justify-center shadow-lg">
          <Plus size={28} />
        </button>
      </Link>
    </>
  );
}
