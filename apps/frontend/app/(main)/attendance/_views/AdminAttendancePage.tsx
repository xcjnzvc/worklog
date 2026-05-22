"use client";

import React, { useState, Suspense } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { AttendanceTable } from "../_components/AttendanceTable";
import { PageTabs } from "@/components/PageTabs";
import {
  useWorkLogList,
  useWorkLogDashboard,
  useFixLogList,
} from "@/hooks/useAttendance";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/Pagination";
import { StatCard } from "@/components/StatCard";
import { ListPageLayout } from "@/components/ListPageLayout";

function AdminAttendanceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTab = searchParams.get("tab") || "MY";

  const [searchKeyword, setSearchKeyword] = useState("");
  const [myPage, setMyPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);

  const { data: dashboardData } = useWorkLogDashboard();

  //  내 근무 내역 조회
  const { data: myData, isLoading: isMyLoading } = useWorkLogList(myPage);

  //  관리자용 전체 승인 대기 내역 조회
  const { data: approvalData, isLoading: isApprovalLoading } =
    useFixLogList(approvalPage);

  const isMyTab = activeTab === "MY";
  const displayData = isMyTab
    ? myData?.result || []
    : approvalData?.result || [];
  const isLoading = isMyTab ? isMyLoading : isApprovalLoading;
  const meta = isMyTab ? myData?.metadata : approvalData?.metadata;
  const currentPage = isMyTab ? myPage : approvalPage;
  const setCurrentPage = isMyTab ? setMyPage : setApprovalPage;

  //  대기 중인 총 개수 추출
  const pendingCount = approvalData?.metadata?.totalCount || 0;

  const ADMIN_TABS = [
    { value: "MY", label: "근무 기록 내역" },
    {
      value: "APPROVALS",
      label: `정정 승인 목록 ${pendingCount > 0 ? `(${pendingCount})` : ""}`,
    },
  ];

  return (
    <ListPageLayout
      title="근태 정정 관리 (관리자)"
      description={
        isMyTab
          ? "본인의 근무 기록을 확인합니다."
          : "팀원들이 신청한 근태 정정 요청을 관리합니다."
      }
      stats={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <StatCard
            label="정정 요청중"
            value={`${pendingCount}건`}
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
          tabs={ADMIN_TABS}
          activeTab={activeTab}
          onTabChange={(tab) => {
            router.replace(`/attendance?tab=${tab}`);
          }}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
          searchPlaceholder={
            isMyTab ? "날짜 검색..." : "이름 또는 사유 검색..."
          }
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
            // 💡 내 탭일 때는 단순 뷰, 승인 목록 탭일 때는 관리용 액션 테이블 디자인 적용
            type={isMyTab ? "view" : "correction"}
            onItemClick={(item) => {
              if (isMyTab && item.status !== "NORMAL" && !item.isFix) {
                router.push(`/attendance/correction/create?id=${item.id}`);
              }
              // APPROVALS 탭일 때 상세 조치 팝업이나 페이지 이동 로직이 필요하다면 여기에 작성합니다.
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

export default function AdminAttendancePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">로딩 중...</div>}>
      <AdminAttendanceContent />
    </Suspense>
  );
}
