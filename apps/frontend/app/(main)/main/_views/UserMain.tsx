// "use client";
// import { User } from "@/store/useUserStore";
// import Header from "../_components/Header";
// import WorkStatusCard from "../_components/user/WorkStatusCard";
// import LeaveStatusCard from "../_components/user/LeaveStatusCard";
// import WeeklyScheduleCard from "../_components/user/WeeklyScheduleCard";
// import QuickActionCard from "../_components/user/QuickActionCard";
// import TodoListCard from "../_components/user/TodoListCard";
// import AttendanceSummaryCard from "@/components/AttendanceSummaryCard";

// export default function UserMain({ user }: { user: User }) {
//   return (
//     <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-[40px]">
//       <div className="max-w-[1600px] mx-auto">
//         {/* 이제 user.name, user.companyName 등을 안전하게 사용할 수 있습니다 */}
//         <Header
//           companyName={user.companyName ?? "회사 정보 없음"}
//           userName={user.name ?? "사용자"}
//           userRole={user.role}
//         />
//         <div className="grid grid-cols-12 gap-6 md:gap-[30px] items-start">
//           <div className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
//             <WorkStatusCard />
//             <LeaveStatusCard />
//           </div>
//           <div className="col-span-12 lg:col-span-6 flex flex-col gap-6 md:gap-[30px] min-w-0">
//             <AttendanceSummaryCard />
//             <WeeklyScheduleCard />
//           </div>
//           <aside className="col-span-12 lg:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 md:gap-[30px]">
//             <QuickActionCard />
//             <TodoListCard />
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import dynamic from "next/dynamic";
import { User } from "@/store/useUserStore";

// 컴포넌트들을 dynamic import로 분리
const Header = dynamic(() => import("../_components/Header"), { ssr: true }); // 헤더는 바로 보여야 하므로 ssr: true 유지 권장
const WorkStatusCard = dynamic(
  () => import("../_components/user/WorkStatusCard"),
  { ssr: false },
);
const LeaveStatusCard = dynamic(
  () => import("../_components/user/LeaveStatusCard"),
  { ssr: false },
);
const WeeklyScheduleCard = dynamic(
  () => import("../_components/user/WeeklyScheduleCard"),
  { ssr: false },
);
const QuickActionCard = dynamic(
  () => import("../_components/user/QuickActionCard"),
  { ssr: false },
);
const TodoListCard = dynamic(() => import("../_components/user/TodoListCard"), {
  ssr: false,
});
const AttendanceSummaryCard = dynamic(
  () => import("@/components/AttendanceSummaryCard"),
  { ssr: false },
);

export default function UserMain({ user }: { user: User }) {
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
