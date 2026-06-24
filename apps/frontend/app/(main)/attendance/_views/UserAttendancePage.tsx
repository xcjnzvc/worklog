"use client";

import { useState, Suspense } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
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
import { ListPageLayout } from "@/components/ListPageLayout";
import { AttendanceTable } from "../_components/AttendanceTable";
import PageLoading from "@/components/PageLoading";

function UserAttendancePage() {
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

  console.log("userdata", workLogData);

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
    <ListPageLayout
      title="근태 정정 관리"
      description="근무 기록을 확인하고 잘못된 기록은 정정을 요청할 수 있습니다."
      stats={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
      }
      tabs={
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
      }
    >
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
    </ListPageLayout>
  );
}

export default function AttendanceCorrectionPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <UserAttendancePage />
    </Suspense>
  );
}
