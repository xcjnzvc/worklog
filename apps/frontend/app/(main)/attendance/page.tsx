"use client";

import React, { useState, Suspense } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { AttendanceTable } from "./_components/AttendanceTable";
import { PageTabs } from "@/components/PageTabs";
import { AttendanceTabType } from "@/types/attendance";
import {
  useFixLogList,
  useWorkLogList,
  useWorkLogDashboard,
} from "@/hooks/useAttendance";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { StatCard } from "@/components/StatCard";

function AttendanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = (searchParams.get("tab") as AttendanceTabType) || "LIST";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [workLogPage, setWorkLogPage] = useState(1);
  const [fixLogPage, setFixLogPage] = useState(1);

  const { data: dashboardData } = useWorkLogDashboard();

  const { data: workLogData, isLoading: isLoadingList } =
    useWorkLogList(workLogPage);
  const { data: fixLogData, isLoading: isLoadingFix } =
    useFixLogList(fixLogPage);

  const isListView = activeTab === "LIST";
  const displayData = isListView
    ? workLogData?.result || []
    : fixLogData?.result || [];
  const isLoading = isListView ? isLoadingList : isLoadingFix;
  const meta = isListView ? workLogData?.metadata : fixLogData?.metadata;
  const currentPage = isListView ? workLogPage : fixLogPage;
  const setCurrentPage = isListView ? setWorkLogPage : setFixLogPage;

  const ATTENDANCE_TABS: { value: AttendanceTabType; label: string }[] = [
    { value: "LIST", label: "근무 기록 내역" },
    { value: "STATISTICS", label: "정정 신청 내역" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-4 md:p-6 lg:p-10  font-sans text-[#1B254B]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-[32px] font-black">근태 정정 관리</h1>
            <p className="text-[#A3AED0]">
              근무 기록을 확인하고 잘못된 기록은 정정을 요청할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="정정 요청중"
            value={`${dashboardData?.pendingCount || 0}건`}
            color="text-[#FFA800]"
            icon={<AlertCircle />}
          />
          <StatCard
            label="정정 완료"
            value={`${dashboardData?.approvedCount || 0}건`}
            color="text-[#05CD99]"
            icon={<CheckCircle />}
          />
          <StatCard
            label="이번 달 총 근무"
            value={`${dashboardData?.totalWorkHours || 0}h`}
            color="text-[#4318FF]"
            icon={<Clock />}
          />
        </div>

        <PageTabs
          tabs={ATTENDANCE_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => {
            router.replace(`/attendance?tab=${tab}`);
          }}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder={isListView ? "날짜 검색..." : "사유 검색..."}
        />

        <div className="bg-white p-4 md:p-8 rounded-[32px] shadow-sm border border-gray-50">
          <div className="flex items-center justify-end mb-6">
            <span className="text-sm text-[#A3AED0] font-medium">
              총 {meta?.totalCount || 0}건
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center text-[#A3AED0]">
              데이터를 불러오는 중입니다...
            </div>
          ) : (
            <>
              <AttendanceTable
                data={displayData}
                type={isListView ? "view" : "correction"}
                onItemClick={(item) => {
                  const isAlreadyFixing =
                    item.isFix || item.apprStatus === "PENDING";
                  const isNormal = item.status === "NORMAL";

                  if (isListView && !isAlreadyFixing && !isNormal) {
                    router.push(`/attendance/correction/create?id=${item.id}`);
                  }
                }}
              />
              <Pagination
                currentPage={currentPage}
                totalPages={meta?.totalPages || 1}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AttendanceCorrectionPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">로딩 중...</div>}>
      <AttendanceContent />
    </Suspense>
  );
}
