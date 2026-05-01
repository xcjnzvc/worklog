// "use client";

// import { useUserStore } from "@/store/useUserStore";
// import { useRouter } from "next/navigation";
// import WorkStatusCard from "./_components/WorkStatusCard";
// import AttendanceSummaryCard from "./_components/AttendanceSummaryCard";
// import LeaveStatusCard from "./_components/LeaveStatusCard";
// import WeeklyScheduleCard from "./_components/WeeklyScheduleCard";

// export default function Main() {
//   const { user, isLoggedIn } = useUserStore();
//   const router = useRouter();

//   if (!isLoggedIn || !user) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-400 font-medium bg-[#F8F9FA]">
//         로그인이 필요한 서비스입니다.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#F8F9FA] p-[40px]">
//       <div className="max-w-[1600px] mx-auto">
//         {/* [상단 헤더] */}
//         <header className="mb-[40px]">
//           <h2 className="text-[28px] font-bold text-[#222] flex items-center gap-2">
//             <span className="text-[#0029C0] font-black">
//               {user.companyName}
//             </span>
//             <span className="font-bold text-gray-800">{user.name}님</span>
//             <span className="text-gray-500 font-medium">안녕하세요!</span>
//           </h2>
//         </header>

//         {/* [메인 레이아웃] 사이 간격 30px 고정 */}
//         <div className="grid grid-cols-12 gap-[30px] items-start">
//           {/* 1. 왼쪽 메인 영역 (9/12 차지) */}
//           <div className="col-span-9 flex flex-col gap-[30px]">
//             {/* 상단: 출근 상태(3) + 근태 요약(6) = 총 9컬럼 */}
//             <div className="grid grid-cols-9 gap-[30px]">
//               <div className="col-span-3 w-full">
//                 <WorkStatusCard />
//               </div>
//               <div className="col-span-6 w-full">
//                 <AttendanceSummaryCard />
//               </div>
//             </div>

//             {/* 하단: 주간 스케줄 (위의 두 카드 너비 합과 정확히 일치) */}
//             <div className="w-full">
//               <WeeklyScheduleCard />
//             </div>

//             {/* OWNER 전용 섹션 */}
//             {user.role === "OWNER" && (
//               <section className="p-[30px] border border-gray-100 rounded-[32px] bg-white flex justify-between items-center shadow-sm">
//                 <div>
//                   <h3 className="font-bold text-[#0023A1] text-xl">
//                     관리자 초대하기
//                   </h3>
//                   <p className="text-gray-400 mt-1">
//                     팀원을 초대하여 근태 관리를 시작하세요.
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => router.push("/invite")}
//                   className="bg-[#0029C0] text-white px-8 py-3 rounded-[16px] font-bold hover:bg-[#0023A1] transition-all active:scale-95"
//                 >
//                   초대 링크 생성
//                 </button>
//               </section>
//             )}
//           </div>

//           {/* 2. 오른쪽 사이드바 영역 (3/12 차지) */}
//           <aside className="col-span-3 flex flex-col gap-[30px]">
//             {/* 연차 현황 */}
//             <LeaveStatusCard />

//             {/* 진행 중인 프로젝트 */}
//             <article className="bg-white rounded-[32px] border border-gray-100 p-[30px] min-h-[380px] shadow-sm flex flex-col">
//               <h3 className="font-bold text-[18px] text-gray-950 mb-6">
//                 진행 중인 프로젝트
//               </h3>
//               <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
//                 <div className="text-[40px] mb-2">📂</div>
//                 <p className="text-[14px] text-gray-500">
//                   진행 중인 프로젝트가
//                   <br />
//                   없습니다.
//                 </p>
//               </div>
//             </article>
//           </aside>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import WorkStatusCard from "./_components/WorkStatusCard";
import AttendanceSummaryCard from "./_components/AttendanceSummaryCard";
import LeaveStatusCard from "./_components/LeaveStatusCard";
import WeeklyScheduleCard from "./_components/WeeklyScheduleCard";
import QuickActionCard from "./_components/QuickActionCard";
import TodoListCard from "./_components/TodoListCard";

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

  if (!isLoggedIn || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] gap-6">
        <h2 className="text-[24px] font-bold text-gray-700">
          로그인이 필요한 서비스입니다.
        </h2>
        <Button text="로그인하러 가기" onClick={() => router.push("/login")} />
      </div>
    );
  }

  // 1. 대표 전용 대시보드
  if (user.role === "OWNER") {
    return (
      <div className="min-h-screen bg-[#F8F9FA] p-[40px]">
        <div className="max-w-[1600px] mx-auto">
          <header className="mb-[40px]">
            <h2 className="text-[28px] font-bold text-[#222]">
              <span className="text-[#0029C0]">{user.companyName}</span> 관리자
              모드
            </h2>
          </header>

          {/* 관리자용 레이아웃 (초대하기 섹션 포함) */}
          <section className="bg-white p-[40px] rounded-[32px] border border-gray-100 shadow-sm flex justify-between items-center mb-[30px]">
            <div>
              <h3 className="font-bold text-[#0023A1] text-2xl">
                관리자 대시보드
              </h3>
              <p className="text-gray-400 mt-2">
                팀원을 초대하여 근태 관리를 시작하세요.
              </p>
            </div>
            <button
              onClick={() => router.push("/invite")}
              className="bg-[#0029C0] text-white px-8 py-4 rounded-[16px] font-bold hover:bg-[#0023A1]"
            >
              초대 링크 생성
            </button>
          </section>
        </div>
      </div>
    );
  }

  // 2.직원 전용 대시보드(초대하기 섹션 없음)
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-[40px]">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-[40px]">
          <h2 className="text-[28px] font-bold text-[#222]">
            <span className="text-[#0029C0]">{user.companyName}</span>{" "}
            {user.name}님 환영합니다!
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-[30px] items-stretch">
          <div className="col-span-3 flex flex-col gap-[30px]">
            <WorkStatusCard />
            <LeaveStatusCard />
          </div>
          <div className="col-span-6 flex flex-col gap-[30px]">
            <AttendanceSummaryCard />
            <WeeklyScheduleCard />
          </div>
          <aside className="col-span-3 flex flex-col gap-[30px]">
            <QuickActionCard />
            <TodoListCard />
          </aside>
        </div>
      </div>
    </div>
  );
}
