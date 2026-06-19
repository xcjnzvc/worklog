import { User } from "@/store/useUserStore";
import Header from "../_components/Header";
import WorkStatusCard from "../_components/user/WorkStatusCard";
import LeaveStatusCard from "../_components/user/LeaveStatusCard";
import WeeklyScheduleCard from "../_components/user/WeeklyScheduleCard";
import QuickActionCard from "../_components/user/QuickActionCard";
import TodoListCard from "../_components/user/TodoListCard";
import AttendanceSummaryCard from "@/components/AttendanceSummaryCard";
import { Suspense } from "react";
import CardSkeleton from "@/components/Skeleton/CardSkeleton";
import { AttendanceData } from "@/types/attendance";

export default function UserMain({
  user,
  initialAttendance,
}: {
  user: User;
  initialAttendance: AttendanceData | null;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-[40px]">
      <div className="max-w-[1600px] mx-auto">
        <Header
          companyName={user.companyName ?? "회사 정보 없음"}
          userName={user.name ?? "사용자"}
          userRole={user.role}
        />
        <div className="grid grid-cols-12 gap-6 md:gap-[30px] items-start">
          <div className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
            <Suspense
              fallback={<CardSkeleton className="w-full min-h-[500px]" />}
            >
              <WorkStatusCard initialAttendance={initialAttendance} />
            </Suspense>
            <Suspense
              fallback={<CardSkeleton className="w-full min-h-[200px]" />}
            >
              <LeaveStatusCard />
            </Suspense>
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 md:gap-[30px] min-w-0">
            <Suspense
              fallback={<CardSkeleton className="w-full min-h-[300px]" />}
            >
              <AttendanceSummaryCard />
            </Suspense>
            <Suspense
              fallback={<CardSkeleton className="w-full min-h-[200px]" />}
            >
              <WeeklyScheduleCard />
            </Suspense>
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
