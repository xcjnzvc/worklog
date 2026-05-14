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

  const filteredData = useMemo((): VacationTableRow[] => {
    if (!data?.list) return [];
    const list = data.list as VacationItem[];
    return list
      .map(
        (item): VacationTableRow => ({
          ...item,
          formattedPeriod:
            item.startDate === item.endDate
              ? item.startDate
              : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
        }),
      )
      .filter(
        (item) =>
          item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
      );
  }, [data, searchKeyword]);

  if (isLoading) return <div className="p-10">로딩 중...</div>;
  if (isError || !data)
    return <div className="p-10 text-red-500">에러 발생</div>;

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1B254B]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-black">휴가 관리</h1>
            <p className="text-[#A3AED0]">
              나의 휴가 현황을 확인하고 신청할 수 있습니다.
            </p>
          </div>
          <Link href="/vacation/create">
            <button className="flex items-center gap-2 bg-[#0029C0] text-white px-8 py-4 rounded-[20px] font-bold">
              <Plus size={20} /> 새 휴가 신청하기
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
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

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
          <div className="flex items-center justify-end mb-6">
            <span className="text-sm text-[#A3AED0] font-medium">
              총 {data.metadata?.totalCount || filteredData.length}건
            </span>
          </div>

          <VacationTable
            data={filteredData}
            onItemClick={(item) => console.log(item)}
          />

          {/* 페이지네이션 컴포넌트 적용 */}
          <Pagination
            currentPage={currentPage}
            totalPages={data.metadata?.totalPages || 1}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
