"use client";

import { useState, useMemo } from "react";
import { Plus, Clock, CheckCircle, List } from "lucide-react";
import Link from "next/link";
import { PageTabs } from "@/components/PageTabs";
import { StatCard } from "@/components/StatCard";
import { Pagination } from "@/components/Pagination";
import { VacationTable } from "../_components/VacationTable";
import { useVacation } from "@/hooks/useVacation";
import { VacationItem, VacationTableRow, ApprovalItem } from "@/types/vacation";
import { ApprovalTable } from "../_components/ApprovalTableRow";
import { ListPageLayout } from "@/components/ListPageLayout";
import { RejectModal } from "@/components/RejectModal";

export default function AdminVacationPage() {
  const [activeTab, setActiveTab] = useState<"MY" | "APPROVALS">("MY");
  const [currentPage, setCurrentPage] = useState(1);
  const [approvalPage, setApprovalPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null,
  );

  const {
    useVacationList,
    useApprovalList,
    useApproveVacation,
    useRejectVacation,
  } = useVacation();
  const { data, isLoading, isError } = useVacationList(currentPage);
  const { data: approvalData, isLoading: approvalLoading } = useApprovalList(
    approvalPage,
    "PENDING",
  );

  const approveMutation = useApproveVacation();
  const rejectMutation = useRejectVacation();

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

  const handleRejectClick = (id: string) => {
    setSelectedRequestId(id);
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = (reason: string) => {
    if (!selectedRequestId) return;

    rejectMutation.mutate(
      { id: selectedRequestId, rejectReason: reason },
      {
        onSuccess: () => {
          setIsRejectModalOpen(false);
          setSelectedRequestId(null);
        },
      },
    );
  };

  if (isLoading) return <div className="p-10">로딩 중...</div>;
  if (isError || !data)
    return <div className="p-10 text-red-500">에러 발생</div>;

  const pendingCount = approvalData?.meta?.totalCount || 0;

  return (
    <>
      <ListPageLayout
        title="휴가 관리"
        description="팀원 휴가를 승인하고 나의 휴가를 신청할 수 있습니다."
        headerRight={
          <Link href="/vacation/create" className="hidden sm:block shrink-0">
            <button className="flex items-center gap-2 bg-[#0029C0] text-white px-6 py-3.5 rounded-[20px] font-bold text-sm hover:bg-[#002094] transition-colors">
              <Plus size={18} /> 새 휴가 신청하기
            </button>
          </Link>
        }
        stats={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              label="승인 대기"
              value={`${pendingCount}건`}
              color="text-[#FFA800]"
              icon={<Clock />}
            />
            <StatCard
              label="잔여 연차"
              value={`${data.summary.remaining}일`}
              color="text-[#00B050]"
              icon={<List />}
            />
            <StatCard
              label="사용한 연차"
              value={`${data.summary.used}일`}
              color="text-[#4318FF]"
              icon={<CheckCircle />}
            />
          </div>
        }
        tabs={
          <PageTabs<"MY" | "APPROVALS">
            tabs={[
              { value: "MY", label: "휴가 내역 목록" },
              {
                value: "APPROVALS",
                label: `휴가 승인 목록 ${pendingCount > 0 ? `(${pendingCount})` : ""}`,
              },
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            searchKeyword={activeTab === "MY" ? searchKeyword : undefined}
            onSearchChange={activeTab === "MY" ? setSearchKeyword : undefined}
            searchPlaceholder="내용 또는 승인자 검색..."
          />
        }
      >
        {activeTab === "MY" && (
          <>
            <VacationTable
              data={filteredData}
              onItemClick={(item) => console.log(item)}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={data.metadata?.totalPages || 1}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {activeTab === "APPROVALS" && (
          <>
            {approvalLoading ? (
              <div className="py-20 text-center text-[#A3AED0]">로딩 중...</div>
            ) : (
              <>
                <ApprovalTable
                  data={(approvalData?.data || []) as ApprovalItem[]}
                  onApprove={(id) => approveMutation.mutate(id)}
                  onReject={handleRejectClick}
                />
                <Pagination
                  currentPage={approvalPage}
                  totalPages={approvalData?.meta?.totalPages || 1}
                  onPageChange={setApprovalPage}
                />
              </>
            )}
          </>
        )}
      </ListPageLayout>

      <Link
        href="/vacation/create"
        className="sm:hidden fixed bottom-6 right-6 z-50"
      >
        <button className="w-14 h-14 bg-[#0029C0] text-white rounded-full flex items-center justify-center shadow-lg">
          <Plus size={28} />
        </button>
      </Link>

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </>
  );
}
