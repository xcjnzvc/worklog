// "use client";

// import React, { useState, Suspense } from "react";
// import { Clock, AlertCircle, CheckCircle } from "lucide-react";
// import { AttendanceTable } from "../_components/AttendanceTable";
// import { PageTabs } from "@/components/PageTabs";
// import { Pagination } from "@/components/Pagination";
// import { StatCard } from "@/components/StatCard";
// import { ListPageLayout } from "@/components/ListPageLayout";

// import {
//   useFixLogListMgmt,
//   useWorkLogDashboard,
//   useApproveAttendance,
//   useRejectAttendance,
// } from "@/hooks/useAttendance";
// import Button from "@/components/Button";

// function OwnerAttendanceContent() {
//   const [approvalPage, setApprovalPage] = useState(1);

//   // 반려 모달 및 사유 입력 상태 관리
//   const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
//   const [rejectReason, setRejectReason] = useState("");

//   // 쿼리 데이터 호출
//   const { data: dashboardData } = useWorkLogDashboard();

//   const { data: approvalData, isLoading } = useFixLogListMgmt(approvalPage);

//   console.log("owner data", dashboardData);

//   // 실무 훅 연결
//   const approveMutation = useApproveAttendance();
//   const rejectMutation = useRejectAttendance();

//   const displayData = approvalData?.result || [];
//   const meta = approvalData?.metadata;
//   const pendingCount = meta?.totalCount || 0;

//   return (
//     <>
//       <ListPageLayout
//         title="근태 정정 최종 승인 (대표용)"
//         description="팀원들이 요청한 근태 정정 기록을 최종 승인하거나 반려합니다."
//         stats={
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
//             <StatCard
//               label="승인 대기 건수"
//               value={`${pendingCount}건`}
//               color="text-[#FFA800]"
//               icon={<AlertCircle />}
//             />
//             <StatCard
//               label="이번 달 승인 완료"
//               value={`${dashboardData?.approvedCount || 0}건`}
//               color="text-[#05CD99]"
//               icon={<CheckCircle />}
//             />
//             <StatCard
//               label="이번 달 전체 정정 대상"
//               value={`${(dashboardData?.pendingCount || 0) + (dashboardData?.approvedCount || 0)}건`}
//               color="text-[#4318FF]"
//               icon={<Clock />}
//             />
//           </div>
//         }
//         tabs={
//           <PageTabs
//             tabs={[{ value: "APPROVALS", label: "정정 승인 대기 목록" }]}
//             activeTab="APPROVALS"
//             onTabChange={() => {}}
//           />
//         }
//       >
//         <div className="flex items-center justify-end mb-6">
//           <span className="text-sm text-[#A3AED0] font-medium">
//             미결재 총 {pendingCount}건
//           </span>
//         </div>

//         {isLoading ? (
//           <div className="py-20 text-center text-[#A3AED0]">
//             결재 서류를 불러오는 중입니다...
//           </div>
//         ) : (
//           <>
//             <AttendanceTable
//               data={displayData}
//               type="correction"
//               onApprove={(id) => approveMutation.mutate(id)}
//               onReject={(id) => setRejectModal({ id })}
//             />
//             <Pagination
//               currentPage={approvalPage}
//               totalPages={meta?.totalPages || 1}
//               onPageChange={setApprovalPage}
//             />
//           </>
//         )}
//       </ListPageLayout>

//       {/* 반려 사유 입력 모달 마크업 */}
//       {rejectModal && (
//         <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-[24px] p-8 w-full max-w-[400px] space-y-4 shadow-xl">
//             <h2 className="text-lg font-black text-[#1B254B]">반려 사유</h2>
//             <textarea
//               placeholder="반려 사유를 입력하세요. (선택사항)"
//               className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none h-[120px] focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20"
//               value={rejectReason}
//               onChange={(e) => setRejectReason(e.target.value)}
//             />
//             <p className="text-xs text-[#A3AED0]">
//               사유를 입력하지 않으면 &quot;사유 없음&quot;으로 처리됩니다.
//             </p>
//             <div className="flex gap-3">
//               <Button
//                 size="sm"
//                 text="취소"
//                 onClick={() => {
//                   setRejectModal(null);
//                   setRejectReason("");
//                 }}
//                 className="bg-gray-50 border border-gray-200 text-[#707EAE] hover:bg-gray-100"
//               />
//               <Button
//                 size="sm"
//                 text="반려 확인"
//                 isLoading={rejectMutation.isPending}
//                 onClick={() => {
//                   rejectMutation.mutate({
//                     id: rejectModal.id,
//                     reason: rejectReason.trim(),
//                   });
//                   // 모달 닫기나 상태 초기화는 mutation이 성공했을 때 하는 것이 더 좋습니다 (onSuccess 활용 추천)
//                 }}
//                 className="bg-[#EE5D50] text-white hover:bg-[#d64f43]"
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default function OwnerAttendancePage() {
//   return (
//     <Suspense fallback={<div className="p-10 text-center">로딩 중...</div>}>
//       <OwnerAttendanceContent />
//     </Suspense>
//   );
// }

"use client";

import React, { useState, Suspense } from "react";
import { Clock, AlertCircle, CheckCircle } from "lucide-react";
import { AttendanceTable } from "../_components/AttendanceTable";
import { PageTabs } from "@/components/PageTabs";
import { Pagination } from "@/components/Pagination";
import { StatCard } from "@/components/StatCard";
import { ListPageLayout } from "@/components/ListPageLayout";

import {
  useFixLogListMgmt,
  useWorkLogDashboard,
  useApproveAttendance,
  useRejectAttendance,
} from "@/hooks/useAttendance";
import Button from "@/components/Button";

function OwnerAttendanceContent() {
  const [approvalPage, setApprovalPage] = useState(1);

  // 반려 모달 및 사유 입력 상태 관리
  const [rejectModal, setRejectModal] = useState<{ id: string } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // 쿼리 데이터 호출
  const { data: dashboardData } = useWorkLogDashboard();
  const { data: approvalData, isLoading } = useFixLogListMgmt(approvalPage);

  // 실무 훅 연결: 성공 시 모달을 닫는 로직을 onSuccess로 정의
  const approveMutation = useApproveAttendance();
  const rejectMutation = useRejectAttendance(() => {
    setRejectModal(null);
    setRejectReason("");
  });

  const displayData = approvalData?.result || [];
  const meta = approvalData?.metadata;
  const pendingCount = meta?.totalCount || 0;

  return (
    <>
      <ListPageLayout
        title="근태 정정 최종 승인 (대표용)"
        description="팀원들이 요청한 근태 정정 기록을 최종 승인하거나 반려합니다."
        stats={
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <StatCard
              label="승인 대기 건수"
              value={`${pendingCount}건`}
              color="text-[#FFA800]"
              icon={<AlertCircle />}
            />
            <StatCard
              label="이번 달 승인 완료"
              value={`${dashboardData?.approvedCount || 0}건`}
              color="text-[#05CD99]"
              icon={<CheckCircle />}
            />
            <StatCard
              label="이번 달 전체 정정 대상"
              value={`${(dashboardData?.pendingCount || 0) + (dashboardData?.approvedCount || 0)}건`}
              color="text-[#4318FF]"
              icon={<Clock />}
            />
          </div>
        }
        tabs={
          <PageTabs
            tabs={[{ value: "APPROVALS", label: "정정 승인 대기 목록" }]}
            activeTab="APPROVALS"
            onTabChange={() => {}}
          />
        }
      >
        <div className="flex items-center justify-end mb-6">
          <span className="text-sm text-[#A3AED0] font-medium">
            미결재 총 {pendingCount}건
          </span>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#A3AED0]">
            결재 서류를 불러오는 중입니다...
          </div>
        ) : (
          <>
            <AttendanceTable
              data={displayData}
              type="correction"
              onApprove={(id) => approveMutation.mutate(id)}
              onReject={(id) => setRejectModal({ id })}
            />
            <Pagination
              currentPage={approvalPage}
              totalPages={meta?.totalPages || 1}
              onPageChange={setApprovalPage}
            />
          </>
        )}
      </ListPageLayout>

      {/* 반려 사유 입력 모달 */}
      {rejectModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[24px] p-8 w-full max-w-[400px] space-y-4 shadow-xl">
            <h2 className="text-lg font-black text-[#1B254B]">반려 사유</h2>
            <textarea
              placeholder="반려 사유를 입력하세요. (선택사항)"
              className="w-full border border-gray-200 rounded-xl p-4 text-sm resize-none h-[120px] focus:outline-none focus:ring-2 focus:ring-[#4318FF]/20"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <p className="text-xs text-[#A3AED0]">
              사유를 입력하지 않으면 &quot;사유 없음&quot;으로 처리됩니다.
            </p>
            <div className="flex gap-3">
              <Button
                size="sm"
                text="취소"
                onClick={() => {
                  setRejectModal(null);
                  setRejectReason("");
                }}
                className="bg-gray-50 border border-gray-200 text-[#707EAE] hover:bg-gray-100"
              />
              <Button
                size="sm"
                text="반려 확인"
                isLoading={rejectMutation.isPending}
                onClick={() => {
                  rejectMutation.mutate({
                    id: rejectModal.id,
                    reason: rejectReason.trim(),
                  });
                }}
                className="bg-[#EE5D50] text-white hover:bg-[#d64f43]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function OwnerAttendancePage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">로딩 중...</div>}>
      <OwnerAttendanceContent />
    </Suspense>
  );
}
