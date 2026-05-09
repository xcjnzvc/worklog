"use client";

import React, { useState, useMemo } from "react";
import { Plus, Calendar, PieChart, List } from "lucide-react";
import { VacationTable, VacationTableRow } from "./_components/VacationTable";
import Link from "next/link";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem, VacationTabType } from "@/types/vacation";
import { PageTabs } from "@/components/PageTabs";

export default function VacationPage() {
  const { useVacationList } = useVacation();
  const { data, isLoading, isError } = useVacationList();

  const [activeTab, setActiveTab] = useState<VacationTabType>("LIST");
  const [searchKeyword, setSearchKeyword] = useState("");

  const VACATION_TABS: { value: VacationTabType; label: string }[] = [
    { value: "LIST", label: "휴가 내역 목록" },
    // { value: "STATISTICS", label: "상세 통계" },
  ];

  const filteredData = useMemo((): VacationTableRow[] => {
    if (!data?.list) return [];

    // list를 VacationItem[]로 간주
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

  const { summary } = data;

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

        {/* 대시보드 카드 */}
        <div className="grid grid-cols-3 gap-6">
          <StatCard
            label="총 연차"
            value={`${summary.total}일`}
            color="text-[#1B254B]"
            icon={<Calendar />}
          />
          <StatCard
            label="사용한 연차"
            value={`${summary.used}일`}
            color="text-[#4318FF]"
            icon={<PieChart />}
          />
          <StatCard
            label="잔여 연차"
            value={`${summary.remaining}일`}
            color="text-[#00B050]"
            icon={<List />}
          />
        </div>

        <PageTabs
          tabs={VACATION_TABS}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder="내용 또는 승인자 검색..."
        />

        {activeTab === "LIST" ? (
          <VacationTable
            data={filteredData}
            onItemClick={(item) => console.log(item)}
          />
        ) : (
          <div className="p-20 text-center bg-white rounded-[32px]">
            통계 리포트 준비 중
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string;
  color: string;
  icon: React.ReactNode; // Lucide 아이콘이나 JSX 요소는 React.ReactNode 타입을 사용합니다.
}

function StatCard({ label, value, color, icon }: StatCardProps) {
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
