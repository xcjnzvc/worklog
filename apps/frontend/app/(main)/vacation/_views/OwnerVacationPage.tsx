"use client";

import { useState } from "react";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { useVacation } from "@/hooks/useVacation";
import { ApprovalItem } from "@/types/vacation";
import { ApprovalTable } from "../_components/ApprovalTableRow";
import { ListPageLayout } from "@/components/ListPageLayout";
import { RejectModal } from "@/components/RejectModal";

export default function OwnerVacationPage() {
  const [approvalPage, setApprovalPage] = useState(1);

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const { useApprovalList, useApproveVacation, useRejectVacation } =
    useVacation();
  const { data, isLoading } = useApprovalList(approvalPage);

  const approveMutation = useApproveVacation();
  const rejectMutation = useRejectVacation();

  const pendingCount = data?.summary?.pending || 0;
  const approvedCount = data?.summary?.approved || 0;
  const rejectedCount = data?.summary?.rejected || 0;

  const handleRejectClick = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (reason: string) => {
    if (!selectedRequestId) return;

    rejectMutation.mutate(
      {
        id: selectedRequestId,
        rejectReason: reason,
      },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setSelectedRequestId(null);
        },
      },
    );
  };

  return (
    <>
      <ListPageLayout
        title="휴가 승인 관리"
        description="팀원의 휴가 신청을 최종 승인합니다."
        stats={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              label="승인 대기"
              value={`${pendingCount}건`}
              color="text-[#FFA800]"
              icon={<AlertCircle />}
            />
            <StatCard
              label="승인 완료"
              value={`${approvedCount}건`}
              color="text-[#05CD99]"
              icon={<CheckCircle />}
            />
            <StatCard
              label="반려"
              value={`${rejectedCount}건`}
              color="text-[#EE5D50]"
              icon={<Clock />}
            />
          </div>
        }
        tabs={
          <PageTabs
            tabs={[{ value: "APPROVALS" as const, label: "휴가 승인 목록" }]}
            activeTab="APPROVALS"
            onTabChange={() => {}}
          />
        }
      >
        {isLoading ? (
          <div className="py-20 text-center text-[#A3AED0]">로딩 중...</div>
        ) : (
          <>
            <ApprovalTable
              data={(data?.data || []) as ApprovalItem[]}
              onApprove={(id) => approveMutation.mutate(id)}
              onReject={handleRejectClick}
            />
            <Pagination
              currentPage={approvalPage}
              totalPages={data?.meta?.totalPages || 1}
              onPageChange={setApprovalPage}
            />
          </>
        )}
      </ListPageLayout>

      {/* 💡 깔끔하게 독립시킨 공통 반려 모달 조립 */}
      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
}
