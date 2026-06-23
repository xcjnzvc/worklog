"use client";

import React from "react";
import { ChevronRight } from "lucide-react";
import Button from "@/components/Button";

export interface Team {
  name: string;
  teamType: string;
  rate: string;
  status: string[];
}

interface MonthlyAttendanceSummaryCardProps {
  teams: Team[];
  getTeamIcon: (teamType: string) => React.ReactNode;
  onDetailClick?: () => void;
}

// [하위 컴포넌트] 내부 연산과 UI 복잡도가 높은 한 줄 (텍스트 스케일 업 버전)
function AttendanceTeamRow({
  team,
  getTeamIcon,
}: {
  team: Team;
  getTeamIcon: (teamType: string) => React.ReactNode;
}) {
  const rate = parseInt(team.rate);
  const lateCount = team.status.filter((s) => s === "late").length;
  const absentCount = team.status.filter((s) => s === "absent").length;

  const isGood = rate >= 90;
  const isWarning = rate < 80;

  return (
    <div className="flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group">
      {/* 팀 아이콘 박스 확장 */}
      <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:scale-105 transition-transform shadow-sm">
        {getTeamIcon(team.teamType)}
      </div>

      {/* 팀명 + 뱃지 공간 넉넉하게 확장 */}
      <div className="w-[100px] shrink-0 space-y-1">
        {/* 팀명: text-sm -> text-base */}
        <p className="text-base font-bold text-gray-900 leading-tight">
          {team.name}
        </p>
        {/* 뱃지: text-[9px] -> text-xs */}
        <span
          className={`inline-block text-xs font-bold px-2 py-0.5 rounded-md ${
            isGood
              ? "bg-emerald-50 text-emerald-600"
              : isWarning
                ? "bg-amber-50 text-amber-600"
                : "bg-blue-50 text-blue-600"
          }`}
        >
          {isGood ? "✓ 우수" : isWarning ? "⚠ 주의" : "● 정상"}
        </span>
      </div>

      {/* 게이지 바 */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1.5">
          {/* 출근율 라벨: text-[10px] -> text-xs */}
          <span className="text-xs font-bold text-gray-400">출근율</span>
          {/* 수치 퍼센트: text-xs -> text-sm */}
          <span className="text-sm font-black text-gray-700">{team.rate}</span>
        </div>
        {/* 바 높이: h-2 -> h-2.5 */}
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isGood
                ? "bg-emerald-500"
                : isWarning
                  ? "bg-amber-400"
                  : "bg-[#0029C0]"
            }`}
            style={{ width: `${rate}%` }}
          />
        </div>
      </div>

      {/* 지각 / 결근 수치 우측 배치 */}
      <div className="flex gap-5 shrink-0">
        <div className="text-center min-w-[32px]">
          {/* 라벨: text-[9px] -> text-xs */}
          <p className="text-xs font-bold text-orange-400 mb-0.5">지각</p>
          {/* 수치 건수: text-sm -> text-base */}
          <p className="text-base font-black text-orange-500">{lateCount}건</p>
        </div>
        <div className="text-center min-w-[32px]">
          <p className="text-xs font-bold text-red-400 mb-0.5">결근</p>
          <p className="text-base font-black text-red-500">{absentCount}건</p>
        </div>
      </div>
    </div>
  );
}

// [메인 컴포넌트] 전체 큰 틀 및 상단 전사 요약 칩 관리
export default function MonthlyAttendanceSummaryCard({
  teams,
  getTeamIcon,
  onDetailClick,
}: MonthlyAttendanceSummaryCardProps) {
  const totalLateCount = teams.reduce(
    (acc, t) => acc + t.status.filter((s) => s === "late").length,
    0,
  );

  const totalAbsentCount = teams.reduce(
    (acc, t) => acc + t.status.filter((s) => s === "absent").length,
    0,
  );

  return (
    <section className="col-span-2 bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2.5">
          <div>
            {/* 타이틀: text-base -> text-lg */}
            <h3 className="font-bold text-lg text-gray-900">
              이번 달 근태 요약
            </h3>
            {/* 서브 타이틀: text-[10px] -> text-xs */}
            <p className="text-[14px] font-semibold text-gray-400 mt-0.5">
              팀별 월간 출근 현황
            </p>
          </div>
        </div>
        {onDetailClick && (
          <Button
            size="sm"
            text="상세 보기"
            icon={<ChevronRight size={14} />}
            onClick={onDetailClick}
            className="bg-transparent hover:bg-gray-100 text-gray-500 hover:text-gray-800 hover:underline px-3 w-auto"
          />
        )}
      </div>

      {/* 전사 요약 3개 칩 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 rounded-2xl p-4.5 border border-gray-100 text-center">
          {/* 칩 상단 라벨: text-[10px] -> text-xs */}
          <p className="text-xs font-bold text-gray-400 mb-1">
            전사 평균 출근율
          </p>
          <p className="text-2xl font-black text-[#0029C0]">83.2%</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4.5 border border-orange-100/50 text-center">
          <p className="text-xs font-bold text-orange-400 mb-1">
            이번 달 총 지각
          </p>
          <p className="text-2xl font-black text-orange-500">
            {totalLateCount}건
          </p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4.5 border border-red-100/50 text-center">
          <p className="text-xs font-bold text-red-400 mb-1">이번 달 총 결근</p>
          <p className="text-2xl font-black text-red-500">
            {totalAbsentCount}건
          </p>
        </div>
      </div>

      {/* 팀별 리스트 */}
      <div className="space-y-1.5 overflow-y-auto max-h-[280px] flex-1">
        {teams.map((team) => (
          <AttendanceTeamRow
            key={team.name}
            team={team}
            getTeamIcon={getTeamIcon}
          />
        ))}
      </div>
    </section>
  );
}
