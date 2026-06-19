"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/store/useUserStore";
import { useVacation } from "@/hooks/useVacation";
import { useFixLogListMgmt } from "@/hooks/useAttendance";
import {
  CheckSquare,
  Settings,
  Building2,
  Code,
  Palette,
  Megaphone,
  Briefcase,
  Users,
} from "lucide-react";

import Header from "../_components/Header";
import DashboardSummaryCards from "../_components/owner/DashboardSummaryCards";
import TeamAttendanceCard from "../_components/owner/TeamAttendanceCard";
import MonthlyAttendanceSummaryCard from "../_components/owner/MonthlyAttendanceSummaryCard";
import OwnerWeeklyScheduleCard from "../_components/owner/OwnerWeeklyScheduleCard";
import ManagementMenuCard from "../_components/owner/ManagementMenuCard";
import ActionCenterCard from "../_components/owner/ActionCenterCard";
import InviteModal from "../_components/owner/InviteModal";
import MOCK_TEAMS from "../_components/mock/teams";

const getTeamIcon = (type: string) => {
  switch (type) {
    case "dev":
      return <Code className="text-indigo-600" size={16} />;
    case "design":
      return <Palette className="text-pink-600" size={16} />;
    case "marketing":
      return <Megaphone className="text-orange-600" size={16} />;
    case "sales":
      return <Briefcase className="text-blue-600" size={16} />;
    case "hr":
      return <Users className="text-emerald-600" size={16} />;
    default:
      return <Building2 className="text-gray-600" size={16} />;
  }
};

export default function OwnerMain({ user }: { user: User }) {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { useApprovalList } = useVacation();
  const { data: vacationData } = useApprovalList(1);
  const { data: approvalData } = useFixLogListMgmt(1);

  const serverPendingVacationCount = vacationData?.summary?.pending || 0;
  const serverPendingAttendanceCount =
    approvalData?.metadata?.totalCount || approvalData?.totalCount || 0;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const scrollToActionCenter = () =>
    document
      .getElementById("action-center")
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="relative min-h-screen bg-[#F4F6F8]">
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm font-bold px-6 py-4 rounded-2xl shadow-2xl z-50 flex items-center gap-2.5">
          <CheckSquare size={16} className="text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="min-h-screen px-[16px] md:px-[40px] py-8 font-sans text-[#1a1c21]">
        <div className="max-w-[1600px] mx-auto space-y-8">
          <Header
            companyName={user.companyName}
            userName={user.name}
            userRole={user.role}
            onDownloadClick={() =>
              triggerToast("월간 리포트 파일 준비중입니다.")
            }
          />
          <DashboardSummaryCards
            onAttendanceClick={() =>
              triggerToast("출근 현황 상세 페이지로 이동")
            }
            onLateAbsentClick={() =>
              triggerToast("근태 현황 상세 페이지로 이동")
            }
            onPendingApprovalClick={scrollToActionCenter}
          />
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-stretch">
            <TeamAttendanceCard teams={MOCK_TEAMS} getTeamIcon={getTeamIcon} />
            <MonthlyAttendanceSummaryCard
              teams={MOCK_TEAMS}
              getTeamIcon={getTeamIcon}
              onDetailClick={() => triggerToast("근태 분석 상세 페이지로 이동")}
            />
            <OwnerWeeklyScheduleCard />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCenterCard
              holidayCount={serverPendingVacationCount}
              attendanceCount={serverPendingAttendanceCount}
              onHolidayClick={() => router.push("/vacation")}
              onAttendanceClick={() => router.push("/attendance?tab=APPROVALS")}
              onInviteClick={() => setIsInviteModalOpen(true)}
            />
            <ManagementMenuCard
              title="정책 및 설정"
              description="근무 규정 가이드 수정"
              icon={<Settings size={20} />}
              iconBgColor="bg-blue-50"
              iconColor="text-[#0029C0]"
              hoverBgColor="hover:bg-blue-50/60"
              arrowHoverColor="group-hover:text-blue-400"
              onItemClick={(label) => triggerToast(label)}
              items={[
                {
                  label: "출퇴근/탄력근무 시간 설정",
                  desc: "근무 시작·종료 시간 및 탄력근무제 설정",
                },
                {
                  label: "회사 연차/휴가 정책 설정",
                  desc: "연차 발생 기준 및 특별 휴가 정책 관리",
                },
                {
                  label: "초과근무 정책 설정",
                  desc: "연장근무 한도 및 수당 정책 설정",
                },
              ]}
            />
            <ManagementMenuCard
              title="조직 관리"
              description="조직도 및 직급 관리"
              icon={<Building2 size={20} />}
              iconBgColor="bg-emerald-50"
              iconColor="text-emerald-600"
              hoverBgColor="hover:bg-emerald-50/60"
              arrowHoverColor="group-hover:text-emerald-400"
              onItemClick={(label) => triggerToast(label)}
              items={[
                {
                  label: "팀 생성 및 팀장 지정",
                  desc: "신규 팀 추가 및 팀장 권한 설정",
                },
                {
                  label: "직원 목록 및 권한 수정",
                  desc: "재직자 정보 및 접근 권한 관리",
                },
                {
                  label: "전사 조직도 조회",
                  desc: "부서별 조직 구조 및 계층도 한눈에 보기",
                },
              ]}
            />
          </div>
        </div>
      </div>
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
      />
    </div>
  );
}
