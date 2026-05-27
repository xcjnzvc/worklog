"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
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

import Button from "@/components/Button";
import WorkStatusCard from "./_components/user/WorkStatusCard";
import LeaveStatusCard from "./_components/user/LeaveStatusCard";
import WeeklyScheduleCard from "./_components/user/WeeklyScheduleCard";
import QuickActionCard from "./_components/user/QuickActionCard";
import TodoListCard from "./_components/user/TodoListCard";
import AttendanceSummaryCard from "@/components/AttendanceSummaryCard";
import Header from "./_components/Header";
import DashboardSummaryCards from "./_components/owner/DashboardSummaryCards";
import TeamAttendanceCard from "./_components/owner/TeamAttendanceCard";
import MonthlyAttendanceSummaryCard from "./_components/owner/MonthlyAttendanceSummaryCard";
import OwnerWeeklyScheduleCard from "./_components/owner/OwnerWeeklyScheduleCard";
import ManagementMenuCard from "./_components/owner/ManagementMenuCard";
import ActionCenterCard from "./_components/owner/ActionCenterCard";
import InviteModal from "./_components/owner/InviteModal";

interface Team {
  name: string;
  status: string[];
  rate: string;
  overtimeHours: number;
  overtimeMembers: string[];
  teamType: "dev" | "design" | "marketing" | "sales" | "hr";
}

const MOCK_TEAMS: Team[] = [
  {
    name: "개발팀",
    status: [
      "present",
      "present",
      "present",
      "present",
      "present",
      "present",
      "leave",
    ],
    rate: "88%",
    overtimeHours: 42,
    overtimeMembers: ["김개발", "이코딩"],
    teamType: "dev",
  },
  {
    name: "디자인팀",
    status: ["present", "present", "late", "absent"],
    rate: "75%",
    overtimeHours: 15,
    overtimeMembers: ["박디자인"],
    teamType: "design",
  },
  {
    name: "마케팅팀",
    status: ["present", "present", "present", "present", "absent"],
    rate: "80%",
    overtimeHours: 8,
    overtimeMembers: [],
    teamType: "marketing",
  },
  {
    name: "영업팀",
    status: ["present", "present", "present", "leave"],
    rate: "75%",
    overtimeHours: 24,
    overtimeMembers: ["최영업"],
    teamType: "sales",
  },
  {
    name: "인사팀",
    status: ["present", "present", "present"],
    rate: "100%",
    overtimeHours: 0,
    overtimeMembers: [],
    teamType: "hr",
  },
];

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

export default function Main() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading: isUserLoading } = useUserStore();

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const { useApprovalList } = useVacation();
  const { data: vacationData } = useApprovalList(1);
  const serverPendingVacationCount = vacationData?.summary?.pending || 0;

  const { data: approvalData } = useFixLogListMgmt(1);

  const serverPendingAttendanceCount =
    approvalData?.metadata?.totalCount || approvalData?.totalCount || 0;

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const scrollToActionCenter = () => {
    document
      .getElementById("action-center")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 font-medium bg-[#F8F9FA]">
        로딩 중...
      </div>
    );
  }

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] p-6">
        <div className="max-w-[480px] w-full bg-white rounded-[40px] p-[40px] md:p-[60px] border border-gray-100 shadow-[0_20px_50px_rgba(0,41,192,0.05)] text-center">
          <h2 className="text-[24px] font-bold text-gray-950 mb-4">
            서비스 이용 안내
          </h2>
          <Button
            text="로그인하러 가기"
            onClick={() => router.push("/login")}
          />
        </div>
      </div>
    );
  }

  // OWNER (대표 계정 화면)
  if (user.role === "OWNER") {
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
              <TeamAttendanceCard
                teams={MOCK_TEAMS}
                getTeamIcon={getTeamIcon}
              />
              <MonthlyAttendanceSummaryCard
                teams={MOCK_TEAMS}
                getTeamIcon={getTeamIcon}
                onDetailClick={() =>
                  triggerToast("근태 분석 상세 페이지로 이동")
                }
              />
              <OwnerWeeklyScheduleCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* <ActionCenterCard
                holidayCount={serverPendingVacationCount}
                attendanceCount={serverPendingAttendanceCount}
                onHolidayClick={() => router.push("/vacation")}
                onAttendanceClick={() =>
                  router.push("/attendance?tab=APPROVALS")
                }
                onInviteClick={() => triggerToast("팀원 초대 모달 오픈")}
              /> */}

              <ActionCenterCard
                holidayCount={serverPendingVacationCount}
                attendanceCount={serverPendingAttendanceCount}
                onHolidayClick={() => router.push("/vacation")}
                onAttendanceClick={() =>
                  router.push("/attendance?tab=APPROVALS")
                }
                onInviteClick={() => setIsInviteModalOpen(true)} // 💡 모달 오픈 액션 연결
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

  // USER
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-[40px]">
      <div className="max-w-[1600px] mx-auto">
        <Header
          companyName={user.companyName}
          userName={user.name}
          userRole={user.role}
        />

        <div className="grid grid-cols-12 gap-6 md:gap-[30px] items-start">
          <div className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
            <WorkStatusCard />
            <LeaveStatusCard />
          </div>

          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 md:gap-[30px] min-w-0">
            <AttendanceSummaryCard />
            <WeeklyScheduleCard />
          </div>

          <aside className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
            <QuickActionCard />
            <TodoListCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
