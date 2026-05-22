"use client";

import React from "react";
import { Award } from "lucide-react";

export interface Team {
  name: string;
  teamType: string;
  rate: string;
  status: ("present" | "late" | "leave" | string)[];
}

interface Vacationer {
  name: string;
  team: string;
}

interface TeamAttendanceCardProps {
  teams: Team[];
  vacationers?: Vacationer[];
  getTeamIcon: (teamType: string) => React.ReactNode;
}

// 하위 컴포넌트: TeamRow
function TeamRow({
  team,
  getTeamIcon,
}: {
  team: Team;
  getTeamIcon: (teamType: string) => React.ReactNode;
}) {
  const presentCount = team.status.filter((s) => s === "present").length;
  const lateCount = team.status.filter((s) => s === "late").length;
  const leaveCount = team.status.filter((s) => s === "leave").length;

  return (
    /* 💡 px-4에서 px-0으로 수정하여 왼쪽 시작선을 타이틀 텍스트와 맞췄습니다. 
       대신 hover했을 때 어색하지 않도록 호버 배경 범위에 마이너스 마진을 주거나,
       깔끔하게 줄 단위 구분 느낌만 나도록 패딩 구조를 최적화했습니다. */
    <div className="group flex items-center justify-between py-3.5 px-0 hover:bg-gray-50/80 rounded-xl transition-all border-b border-gray-100/50 last:border-0">
      <div className="flex items-center gap-3.5">
        {/* 이제 이 아이콘 박스의 왼쪽 면이 상단 "팀별 출근 현황"의 '팀' 글자와 수직으로 딱 맞아떨어집니다. */}
        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
          {getTeamIcon(team.teamType)}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-base text-gray-900 leading-tight">
              {team.name}
            </p>
            {team.rate === "100%" && (
              <span className="bg-emerald-50 text-emerald-600 p-1 rounded-md">
                <Award size={14} className="fill-emerald-100" />
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-gray-400 mt-1">
            {team.rate} 달성 중
          </p>
        </div>
      </div>

      {/* 수치 레이아웃 (우측 정렬 유지) */}
      <div className="flex items-center gap-6">
        <div className="text-center min-w-[36px]">
          <p className="text-xs font-bold text-gray-400 mb-1">출근</p>
          <p className="text-base font-black text-gray-900">{presentCount}</p>
        </div>
        <div className="text-center min-w-[36px]">
          <p className="text-xs font-bold text-orange-400 mb-1">지각</p>
          <p className="text-base font-black text-orange-500">{lateCount}</p>
        </div>
        <div className="text-center min-w-[36px]">
          <p className="text-xs font-bold text-blue-400 mb-1">휴가</p>
          <p className="text-base font-black text-blue-700">{leaveCount}</p>
        </div>
      </div>
    </div>
  );
}

// 메인 컴포넌트: TeamAttendanceCard
export default function TeamAttendanceCard({
  teams,
  getTeamIcon,
  vacationers = [
    { name: "홍길동", team: "개발팀" },
    { name: "김철수", team: "영업팀" },
  ],
}: TeamAttendanceCardProps) {
  return (
    <section className="col-span-1 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
      <div className="flex justify-between items-center mb-5">
        {/* 타이틀: text-base -> text-lg */}
        <h3 className="font-bold text-lg text-gray-900">팀별 출근 현황</h3>
        {/* 실시간 배지: text-[10px] -> text-xs */}
        <span className="text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100">
          실시간
        </span>
      </div>

      <div className="space-y-1.5 overflow-y-auto max-h-[340px] flex-1">
        {teams.map((team) => (
          <TeamRow key={team.name} team={team} getTeamIcon={getTeamIcon} />
        ))}
      </div>

      <div className="mt-5 pt-5 border-t border-gray-100">
        {/* 오늘 휴가자 라벨: text-[10px] -> text-xs */}
        <p className="text-xs font-black text-gray-400 mb-3 uppercase tracking-wide">
          오늘 휴가자
        </p>
        <div className="flex flex-wrap gap-2.5">
          {vacationers.map((person) => (
            <div
              key={person.name}
              className="flex items-center gap-2 bg-blue-50/50 hover:bg-blue-50 px-3 py-2 rounded-xl border border-blue-100/30 transition"
            >
              <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              {/* 휴가자 이름: text-xs -> text-sm */}
              <span className="text-sm font-bold text-blue-900">
                {person.name}
              </span>
              {/* 소속 팀: text-[10px] -> text-xs */}
              <span className="text-xs font-semibold text-blue-400">
                {person.team}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
