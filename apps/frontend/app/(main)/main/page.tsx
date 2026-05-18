"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import WorkStatusCard from "./_components/WorkStatusCard";
import LeaveStatusCard from "./_components/LeaveStatusCard";
import WeeklyScheduleCard from "./_components/WeeklyScheduleCard";
import QuickActionCard from "./_components/QuickActionCard";
import TodoListCard from "./_components/TodoListCard";
import AttendanceSummaryCard from "@/components/AttendanceSummaryCard";

export default function Main() {
  const { user, isLoggedIn, isLoading } = useUserStore();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 font-medium bg-[#F8F9FA]">
        로딩 중...
      </div>
    );
  }

  // 로그인 안 된 경우 (심플한 안내 페이지)
  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] p-6">
        <div className="max-w-[480px] w-full bg-white rounded-[40px] p-[40px] md:p-[60px] border border-gray-100 shadow-[0_20px_50px_rgba(0,41,192,0.05)] text-center">
          <div className="relative w-[110px] h-[110px] mx-auto mb-10">
            <div className="absolute inset-0 bg-[#0029C0] opacity-[0.05] rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-10 h-12">
                <div className="absolute bottom-0 w-full h-8 bg-[#0029C0] rounded-lg shadow-sm" />
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-7 border-[3.5px] border-[#0029C0] rounded-full"
                  style={{ clipPath: "inset(0 0 50% 0)" }}
                />
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full" />
              </div>
            </div>
          </div>
          <h2 className="text-[24px] md:text-[26px] font-bold text-gray-950 mb-4 tracking-tight">
            서비스 이용 안내
          </h2>
          <p className="text-gray-400 text-[15px] md:text-[16px] leading-relaxed mb-10">
            안전한 서비스 이용을 위해
            <br />
            <span className="text-gray-600 font-semibold">
              로그인이 필요합니다.
            </span>
          </p>
          <div className="flex flex-col">
            <Button
              text="로그인하러 가기"
              onClick={() => router.push("/login")}
            />
          </div>
        </div>
      </div>
    );
  }

  // 1. 대표 전용 대시보드 (반응형 적용)
  if (user.role === "OWNER") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-[40px]">
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-8 md:mb-[40px]">
            <h2 className="text-[24px] md:text-[28px] font-bold text-[#222]">
              <span className="text-[#0029C0]">{user.companyName}</span> 관리자
              모드
            </h2>
          </header>

          <section className="bg-white p-6 md:p-[40px] rounded-[24px] md:rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6 mb-[30px]">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-[#0023A1] text-xl md:text-2xl">
                관리자 대시보드
              </h3>
              <p className="text-gray-400 mt-2">
                팀원을 초대하여 근태 관리를 시작하세요.
              </p>
            </div>
            <button
              onClick={() => router.push("/invite")}
              className="w-full md:w-auto bg-[#0029C0] text-white px-8 py-4 rounded-[16px] font-bold hover:bg-[#0023A1]"
            >
              초대 링크 생성
            </button>
          </section>
        </div>
      </div>
    );
  }

  // 2. 직원 전용 대시보드 (반응형 레이아웃)
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-[40px]">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 md:mb-[40px]">
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#222] leading-snug">
            <span className="text-[#0029C0]">{user.companyName}</span>{" "}
            <span className="">회사의</span>
            <span className="text-[#0029C0]"> {user.name}</span>님 환영합니다!
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-6 md:gap-[30px] items-start">
          {/* [왼쪽 섹션]: 
              모바일(12) - 세로 쌓임 
              태블릿(12) - grid-cols-2로 나란히 배치 
              데스크탑(3) - 다시 세로로 쌓여서 한 줄 점유 */}
          <div className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
            <WorkStatusCard />
            <LeaveStatusCard />
          </div>

          {/* [중앙 섹션]: 태블릿과 모바일에서 전체 너비 사용 */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 md:gap-[30px] min-w-0">
            <AttendanceSummaryCard />
            <WeeklyScheduleCard />
          </div>

          {/* [오른쪽 섹션]: 
              모바일(12) - 세로 쌓임
              태블릿(12) - grid-cols-2로 나란히 배치
              데스크탑(3) - 세로 쌓임 */}
          <aside className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
            <QuickActionCard />
            <TodoListCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
