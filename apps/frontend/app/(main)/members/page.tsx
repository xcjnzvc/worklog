"use client";

import { useState, Suspense } from "react";
import { Users, UserMinus, ShieldCheck } from "lucide-react";
import { PageTabs } from "@/components/PageTabs";
import { Pagination } from "@/components/Pagination";
import { StatCard } from "@/components/StatCard";
import { ListPageLayout } from "@/components/ListPageLayout";
import PageLoading from "@/components/PageLoading";
import Button from "@/components/Button";
import { MemberTable } from "./_components/MemberTable";
import { useMember } from "@/hooks/useMember"; // 메인 훅을 가져옵니다.

function OwnerMemberContent() {
  const [page, setPage] = useState(1);
  const [deleteModal, setDeleteModal] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // 훅들을 객체에서 추출하여 사용
  const { useMemberList, useDeleteMember } = useMember();

  const { data: memberData, isLoading } = useMemberList(page);
  const deleteMutation = useDeleteMember(() => {
    setDeleteModal(null); // 성공 시 모달 닫기
  });

  const displayData = memberData?.result || [];
  const meta = memberData?.metadata;

  return (
    <>
      <ListPageLayout
        title="팀원 관리"
        description="등록된 팀원을 관리하고 퇴사 처리할 수 있습니다."
        stats={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              label="전체 팀원"
              value={`${meta?.totalCount || 0}명`}
              color="text-[#4318FF]"
              icon={<Users />}
            />
            <StatCard
              label="관리자(Owner)"
              value="1명"
              color="text-[#05CD99]"
              icon={<ShieldCheck />}
            />
            <StatCard
              label="최근 퇴사 처리"
              value="0건"
              color="text-[#EE5D50]"
              icon={<UserMinus />}
            />
          </div>
        }
        tabs={
          <PageTabs
            tabs={[{ value: "ALL", label: "전체 팀원 목록" }]}
            activeTab="ALL"
            onTabChange={() => {}}
          />
        }
      >
        <div className="flex items-center justify-end mb-6">
          <span className="text-sm text-[#A3AED0] font-medium">
            총 {meta?.totalCount || 0}명
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#A3AED0]">
            팀원 정보를 불러오는 중입니다...
          </div>
        ) : (
          <>
            <MemberTable
              data={displayData}
              onDelete={(member) =>
                setDeleteModal({ id: member.id, name: member.name })
              }
            />
            <Pagination
              currentPage={page}
              totalPages={meta?.totalPages || 1}
              onPageChange={setPage}
            />
          </>
        )}
      </ListPageLayout>

      {/* 퇴사 처리 확인 모달 */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-[400px] space-y-4 shadow-xl">
            <h2 className="text-lg font-black text-[#1B254B]">
              팀원 퇴사 처리
            </h2>
            <p className="text-sm text-[#707EAE]">
              <span className="font-bold text-[#1B254B]">
                {deleteModal.name}
              </span>{" "}
              님을 정말 퇴사 처리하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                text="취소"
                onClick={() => setDeleteModal(null)}
                className="bg-gray-50 border border-gray-200 text-[#707EAE] hover:bg-gray-100"
              />
              <Button
                size="sm"
                text="탈퇴 처리"
                isLoading={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(deleteModal.id)}
                className="bg-[#EE5D50] text-white hover:bg-[#d64f43]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function OwnerMemberPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <OwnerMemberContent />
    </Suspense>
  );
}
