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
import WorkStatusCard from "./_components/WorkStatusCard";
import AttendanceSummaryCard from "./_components/AttendanceSummaryCard";
import LeaveStatusCard from "./_components/LeaveStatusCard";
import WeeklyScheduleCard from "./_components/WeeklyScheduleCard";
import QuickActionCard from "./_components/QuickActionCard";
import TodoListCard from "./_components/TodoListCard";

export default function Main() {
  const { user, isLoggedIn } = useUserStore();
  const router = useRouter();

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 font-medium bg-[#F8F9FA]">
        로그인이 필요한 서비스입니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-[40px]">
      <div className="max-w-[1600px] mx-auto">
        {/* [상단 헤더] */}
        <header className="mb-[40px]">
          <h2 className="text-[28px] font-bold text-[#222] flex items-center gap-2">
            <span className="text-[#0029C0] font-black">
              {user.companyName}
            </span>
            <span className="font-bold text-gray-800">{user.name}님</span>
            <span className="text-gray-500 font-medium">안녕하세요!</span>
          </h2>
        </header>

        {/* [레이아웃 전략] 
          1. items-stretch를 통해 세 기둥(col)의 높이를 동일하게 맞춤
          2. 가장 내용이 많은 중앙 기둥이 전체 높이를 결정함
        */}
        <div className="grid grid-cols-12 gap-[30px] items-stretch">
          {/* 기둥 1: 왼쪽 (너비 3) */}
          <div className="col-span-3 flex flex-col gap-[30px]">
            <WorkStatusCard />
            <LeaveStatusCard />
          </div>

          {/* 기둥 2: 중앙 (너비 6) - 기준점 */}
          <div className="col-span-6 flex flex-col gap-[30px]">
            <AttendanceSummaryCard />
            <WeeklyScheduleCard />
          </div>

          {/* 기둥 3: 오른쪽 (너비 3) */}
          <aside className="col-span-3 flex flex-col gap-[30px]">
            <QuickActionCard />

            {/* flex-1을 부여하여 QuickActionCard를 제외한 
               남은 모든 높이를 프로젝트와 할 일이 채우도록 함 
            */}
            <div className="flex-1 flex flex-col gap-[30px]">
              {/* 진행 중인 프로젝트 (50%) */}
              <article className="bg-white rounded-[32px] border border-gray-100 p-[30px] shadow-sm flex flex-col flex-1">
                <h3 className="font-bold text-[18px] text-gray-950 mb-6">
                  진행 중인 프로젝트
                </h3>
                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                  <div className="text-[40px] mb-2">📂</div>
                  <p className="text-[14px] text-gray-500">
                    진행 중인 프로젝트가
                    <br />
                    없습니다.
                  </p>
                </div>
              </article>

              {/* 오늘 할 일 (50%) */}
              <TodoListCard />
            </div>
          </aside>

          {/* OWNER 전용 섹션 (하단 전체 너비) */}
          {user.role === "OWNER" && (
            <section className="col-span-12 p-[30px] border border-gray-100 rounded-[32px] bg-white flex justify-between items-center shadow-sm">
              <div>
                <h3 className="font-bold text-[#0023A1] text-xl">
                  관리자 초대하기
                </h3>
                <p className="text-gray-400 mt-1">
                  팀원을 초대하여 근태 관리를 시작하세요.
                </p>
              </div>
              <button
                onClick={() => router.push("/invite")}
                className="bg-[#0029C0] text-white px-8 py-3 rounded-[16px] font-bold hover:bg-[#0023A1] transition-all active:scale-95"
              >
                초대 링크 생성
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
