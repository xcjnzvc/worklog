"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

import {
  UserPlus,
  Download,
  CheckSquare,
  Umbrella,
  ClipboardList,
  AlarmClock,
  Settings,
  Building2,
  FileCheck,
  ChevronRight,
  Clock,
  Code,
  Palette,
  Megaphone,
  Briefcase,
  Users,
  Award,
} from "lucide-react";

import Button from "@/components/Button";
import WorkStatusCard from "./_components/WorkStatusCard";
import LeaveStatusCard from "./_components/LeaveStatusCard";
import WeeklyScheduleCard from "./_components/WeeklyScheduleCard";
import QuickActionCard from "./_components/QuickActionCard";
import TodoListCard from "./_components/TodoListCard";
import AttendanceSummaryCard from "@/components/AttendanceSummaryCard";

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

const TeamRow = ({ team }: { team: Team }) => {
  const presentCount = team.status.filter((s) => s === "present").length;
  const lateCount = team.status.filter((s) => s === "late").length;
  const leaveCount = team.status.filter((s) => s === "leave").length;

  return (
    <div className="group flex items-center justify-between p-4 hover:bg-gray-50/80 rounded-2xl transition-all border border-transparent hover:border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
          {getTeamIcon(team.teamType)}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-sm text-gray-900">{team.name}</p>

            {team.rate === "100%" && (
              <span className="bg-emerald-50 text-emerald-600 p-0.5 rounded-md">
                <Award size={12} className="fill-emerald-100" />
              </span>
            )}
          </div>

          <p className="text-[11px] font-semibold text-gray-400 mt-0.5">
            {team.rate} 달성 중
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-center min-w-[28px]">
          <p className="text-[10px] font-bold text-gray-400 mb-0.5">출근</p>
          <p className="text-sm font-black text-gray-900">{presentCount}</p>
        </div>

        <div className="text-center min-w-[28px]">
          <p className="text-[10px] font-bold text-orange-400 mb-0.5">지각</p>
          <p className="text-sm font-black text-orange-500">{lateCount}</p>
        </div>

        <div className="text-center min-w-[28px]">
          <p className="text-[10px] font-bold text-blue-400 mb-0.5">휴가</p>
          <p className="text-sm font-black text-blue-700">{leaveCount}</p>
        </div>
      </div>
    </div>
  );
};

export default function Main() {
  const router = useRouter();

  const { user, isLoggedIn, isLoading } = useUserStore();

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

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

  // 로딩
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-400 font-medium bg-[#F8F9FA]">
        로딩 중...
      </div>
    );
  }

  // 비로그인
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

  // OWNER
  if (user.role === "OWNER") {
    return (
      <div className="relative min-h-screen bg-[#F4F6F8]">
        {showToast && (
          <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-xl z-50 flex items-center gap-2">
            <CheckSquare size={14} className="text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="min-h-screen px-[16px] md:px-[40px] py-8 font-sans text-[#1a1c21]">
          <div className="max-w-[1600px] mx-auto space-y-8">
            {/* 헤더 */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <p className="text-[#0029C0] font-black text-sm mb-1 tracking-wider">
                  {user.companyName}
                </p>

                <h2 className="text-[26px] md:text-[32px] font-black text-[#222] tracking-tight">
                  <span className="text-[#0029C0]">{user.name}</span>

                  <span className="font-medium text-[#555] text-[20px] md:text-[28px] ml-2">
                    대표님, 반갑습니다!
                  </span>
                </h2>
              </div>

              <button
                onClick={() => triggerToast("월간 리포트 파일 준비중입니다.")}
                className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-200/80 font-black text-xs hover:bg-gray-50 shadow-sm transition-all"
              >
                <Download size={15} />
                월간 리포트 다운로드
              </button>
            </header>

            {/* 상단 3개 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  title: "오늘 출근률",
                  val: "75%",
                  sub: "18명 출근 / 전체 24명",
                  icon: <CheckSquare className="text-green-500" size={18} />,
                  hover: "hover:border-emerald-200",
                  onClick: () => triggerToast("출근 현황 상세 페이지로 이동"),
                  hint: null,
                },
                {
                  title: "이번 달 지각·결근률",
                  val: "5.8%",
                  sub: "지각 4.2% · 결근 1.6%",
                  icon: <AlarmClock className="text-red-500" size={18} />,
                  hover: "hover:border-rose-200",
                  onClick: () => triggerToast("근태 현황 상세 페이지로 이동"),
                  hint: null,
                },
                {
                  title: "미처리 승인",
                  val: "17건",
                  sub: "휴가 12건 · 근태정정 5건",
                  icon: <ClipboardList className="text-orange-500" size={18} />,
                  hover: "hover:border-amber-200",
                  onClick: scrollToActionCenter,
                  hint: "↓ 운영 액션 센터에서 처리하기",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  onClick={card.onClick}
                  className={`bg-white p-6 rounded-3xl border border-gray-100 shadow-sm cursor-pointer transition-all duration-300 hover:shadow-md ${card.hover}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-wide">
                      {card.title}
                    </span>
                    <div className="p-1.5 bg-gray-50 rounded-xl">
                      {card.icon}
                    </div>
                  </div>
                  <div className="text-3xl font-black text-[#0029C0]">
                    {card.val}
                  </div>
                  <div className="text-xs font-bold text-gray-400 mt-2">
                    {card.sub}
                  </div>
                  {card.hint && (
                    <p className="text-[10px] font-bold text-orange-400 mt-2">
                      {card.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* 1행: 1:2:1 비율 */}
            <div className="grid grid-cols-4 gap-6 items-stretch">
              {/* 팀별 출근 현황 (col-span-1) */}
              <section className="col-span-1 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-black text-base text-gray-900">
                    팀별 출근 현황
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                    실시간
                  </span>
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[320px] flex-1">
                  {MOCK_TEAMS.map((team) => (
                    <TeamRow key={team.name} team={team} />
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 mb-2 uppercase tracking-wide">
                    오늘 휴가자
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "홍길동", team: "개발팀" },
                      { name: "김철수", team: "영업팀" },
                    ].map((person) => (
                      <div
                        key={person.name}
                        className="flex items-center gap-1.5 bg-blue-50/50 hover:bg-blue-50 px-2.5 py-1.5 rounded-xl border border-blue-100/30 transition"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span className="text-xs font-bold text-blue-900">
                          {person.name}
                        </span>
                        <span className="text-[10px] font-bold text-blue-400">
                          {person.team}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* 이번 달 근태 요약 (col-span-2) */}
              <section className="col-span-2 bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
                {/* 헤더 */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2.5">
                    <div>
                      <h3 className="font-black text-base text-gray-900">
                        이번 달 근태 요약
                      </h3>
                      <p className="text-[10px] font-bold text-gray-400">
                        팀별 월간 출근 현황
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => triggerToast("근태 분석 상세 페이지로 이동")}
                    className="text-[11px] font-bold text-[#888] hover:underline flex items-center gap-0.5 px-3 py-1.5 rounded-xl"
                  >
                    상세 보기 <ChevronRight size={12} />
                  </button>
                </div>

                {/* 전사 요약 3개 칩 */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                    <p className="text-[10px] font-black text-gray-400 mb-1">
                      전사 평균 출근율
                    </p>
                    <p className="text-2xl font-black text-[#0029C0]">83.2%</p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100/50 text-center">
                    <p className="text-[10px] font-black text-orange-400 mb-1">
                      이번 달 총 지각
                    </p>
                    <p className="text-2xl font-black text-orange-500">
                      {MOCK_TEAMS.reduce(
                        (acc, t) =>
                          acc + t.status.filter((s) => s === "late").length,
                        0,
                      )}
                      건
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-2xl p-4 border border-red-100/50 text-center">
                    <p className="text-[10px] font-black text-red-400 mb-1">
                      이번 달 총 결근
                    </p>
                    <p className="text-2xl font-black text-red-500">
                      {MOCK_TEAMS.reduce(
                        (acc, t) =>
                          acc + t.status.filter((s) => s === "absent").length,
                        0,
                      )}
                      건
                    </p>
                  </div>
                </div>

                {/* 팀별 리스트 */}
                <div className="space-y-3 overflow-y-auto max-h-[260px]">
                  {MOCK_TEAMS.map((team) => {
                    const rate = parseInt(team.rate);
                    const lateCount = team.status.filter(
                      (s) => s === "late",
                    ).length;
                    const absentCount = team.status.filter(
                      (s) => s === "absent",
                    ).length;
                    const isGood = rate >= 90;
                    const isWarning = rate < 80;

                    return (
                      <div
                        key={team.name}
                        className="flex items-center gap-5 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100 group"
                      >
                        {/* 팀 아이콘 */}
                        <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0 group-hover:scale-105 transition-transform">
                          {getTeamIcon(team.teamType)}
                        </div>

                        {/* 팀명 + 뱃지 */}
                        <div className="w-[88px] shrink-0">
                          <p className="text-sm font-black text-gray-900">
                            {team.name}
                          </p>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-md ${
                              isGood
                                ? "bg-emerald-50 text-emerald-600"
                                : isWarning
                                  ? "bg-amber-50 text-amber-600"
                                  : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            {isGood
                              ? "✓ 우수"
                              : isWarning
                                ? "⚠ 주의"
                                : "● 정상"}
                          </span>
                        </div>

                        {/* 게이지 바 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-bold text-gray-400">
                              출근율
                            </span>
                            <span className="text-xs font-black text-gray-700">
                              {team.rate}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
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

                        {/* 지각 / 결근 */}
                        <div className="flex gap-4 shrink-0">
                          <div className="text-center">
                            <p className="text-[9px] font-bold text-orange-400 mb-0.5">
                              지각
                            </p>
                            <p className="text-sm font-black text-orange-500">
                              {lateCount}건
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] font-bold text-red-400 mb-0.5">
                              결근
                            </p>
                            <p className="text-sm font-black text-red-500">
                              {absentCount}건
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* 이번 주 일정 (col-span-1) */}
              <section className="col-span-1 bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                    이번 주 일정
                  </h3>
                  <span className="text-[10px] font-bold text-[#0029C0] bg-blue-50 px-2 py-1 rounded-full">
                    5월 3주차
                  </span>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      day: "월",
                      date: "5/19",
                      isToday: false,
                      events: [
                        {
                          label: "홍길동 연차",
                          color: "bg-blue-50 text-blue-700 border-blue-100",
                        },
                        {
                          label: "전사 회의 10:00",
                          color:
                            "bg-purple-50 text-purple-700 border-purple-100",
                        },
                      ],
                    },
                    {
                      day: "화",
                      date: "5/20",
                      isToday: true,
                      events: [
                        {
                          label: "김철수 반차",
                          color: "bg-amber-50 text-amber-700 border-amber-100",
                        },
                      ],
                    },
                    {
                      day: "수",
                      date: "5/21",
                      isToday: false,
                      events: [
                        {
                          label: "개발팀 스프린트",
                          color:
                            "bg-emerald-50 text-emerald-700 border-emerald-100",
                        },
                      ],
                    },
                    { day: "목", date: "5/22", isToday: false, events: [] },
                    {
                      day: "금",
                      date: "5/23",
                      isToday: false,
                      events: [
                        {
                          label: "이영희 연차",
                          color: "bg-blue-50 text-blue-700 border-blue-100",
                        },
                        {
                          label: "월간 보고 15:00",
                          color: "bg-rose-50 text-rose-700 border-rose-100",
                        },
                      ],
                    },
                  ].map((item) => (
                    <div
                      key={item.day}
                      className={`flex items-start gap-3 p-2.5 rounded-2xl transition-all ${item.isToday ? "bg-blue-50/40 border border-blue-100/60" : "hover:bg-gray-50/50 border border-transparent"}`}
                    >
                      <div className="w-9 shrink-0 text-center">
                        <p
                          className={`text-[10px] font-black ${item.isToday ? "text-blue-600" : "text-gray-400"}`}
                        >
                          {item.day}
                        </p>
                        <p
                          className={`text-sm font-black ${item.isToday ? "text-blue-800" : "text-gray-700"}`}
                        >
                          {item.date}
                        </p>
                        {item.isToday && (
                          <span className="inline-block text-[8px] bg-blue-600 text-white font-black px-1 py-0.5 rounded-md mt-0.5">
                            오늘
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1 pt-0.5 flex-1">
                        {item.events.length > 0 ? (
                          item.events.map((ev, i) => (
                            <span
                              key={i}
                              className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${ev.color}`}
                            >
                              {ev.label}
                            </span>
                          ))
                        ) : (
                          <span className="text-[10px] font-semibold text-gray-300 italic pt-1">
                            일정 없음
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* 2행: 운영 액션 센터 + 정책 및 설정 + 조직 관리 (3열 동일) */}
            <div className="grid grid-cols-3 gap-6">
              {/* 운영 액션 센터 */}
              <div id="action-center">
                <section className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-5">
                    <h3 className="font-black text-base text-gray-900 flex items-center gap-2">
                      <FileCheck size={16} className="text-emerald-600" /> 운영
                      액션 센터
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      처리 필요
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1">
                    <button
                      onClick={() =>
                        triggerToast("휴가 결재 요청 페이지로 이동")
                      }
                      className="flex items-center justify-between p-4 bg-emerald-50/50 hover:bg-emerald-50 rounded-2xl border border-emerald-100/60 hover:border-emerald-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl text-emerald-600 shadow-sm">
                          <Umbrella size={16} />
                        </div>
                        <div className="text-left">
                          <p className="font-black text-sm text-gray-900">
                            휴가 결재 요청
                          </p>
                          <p className="text-emerald-700 text-xs font-bold mt-0.5">
                            12건 대기 중
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center">
                          12
                        </span>
                        <ChevronRight size={14} className="text-emerald-400" />
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        triggerToast("근태 정정 요청 페이지로 이동")
                      }
                      className="flex items-center justify-between p-4 bg-blue-50/50 hover:bg-blue-50 rounded-2xl border border-blue-100/60 hover:border-blue-200 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-xl text-blue-600 shadow-sm">
                          <Clock size={16} />
                        </div>
                        <div className="text-left">
                          <p className="font-black text-sm text-gray-900">
                            근태 정정 요청
                          </p>
                          <p className="text-blue-700 text-xs font-bold mt-0.5">
                            5건 대기 중
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                          5
                        </span>
                        <ChevronRight size={14} className="text-blue-400" />
                      </div>
                    </button>

                    {/* 초대하기를 운영 액션 센터 하단에 배치 */}
                    <div className="mt-auto pt-3 border-t border-gray-100">
                      <button
                        onClick={() => triggerToast("팀원 초대 모달 오픈")}
                        className="w-full flex items-center justify-between p-4 bg-[#0029C0] hover:bg-[#0022a0] rounded-2xl transition-all text-white"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/10 rounded-xl">
                            <UserPlus size={16} />
                          </div>
                          <div className="text-left">
                            <p className="font-black text-sm">새 팀원 초대</p>
                            <p className="text-blue-200 text-xs font-bold mt-0.5">
                              초대코드 발행하기
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-blue-300" />
                      </button>
                    </div>
                  </div>
                </section>
              </div>

              {/* 정책 및 설정 */}
              <section className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-50 rounded-2xl text-[#0029C0]">
                    <Settings size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900">
                      정책 및 설정
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400">
                      근무 규정 가이드 수정
                    </p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
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
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => triggerToast(item.label)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-blue-50/60 rounded-2xl transition group"
                    >
                      <div className="text-left">
                        <p className="font-black text-sm text-gray-800">
                          {item.label}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-gray-300 group-hover:text-blue-400 transition shrink-0 ml-2"
                      />
                    </button>
                  ))}
                </div>
              </section>

              {/* 조직 관리 */}
              <section className="bg-white p-7 rounded-[28px] border border-gray-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-gray-900">
                      조직 관리
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400">
                      조직도 및 직급 관리
                    </p>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    {
                      label: "팀 생성 및 팀장 지정",
                      desc: "신규 팀 추가 및 팀장 권한 설정",
                    },
                    {
                      label: "직원 목록 및 권한 수정",
                      desc: "재직자 정보 및 접근 권한 관리",
                    },
                    {
                      label: "부서 이동 및 직급 변경",
                      desc: "인사 이동 및 직급 체계 관리",
                    },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => triggerToast(item.label)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50/80 hover:bg-emerald-50/60 rounded-2xl transition group"
                    >
                      <div className="text-left">
                        <p className="font-black text-sm text-gray-800">
                          {item.label}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-0.5">
                          {item.desc}
                        </p>
                      </div>
                      <ChevronRight
                        size={14}
                        className="text-gray-300 group-hover:text-emerald-400 transition shrink-0 ml-2"
                      />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // USER
  return (
    <div className="min-h-screen bg-[#F8F9FA] p-6 md:p-[40px]">
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-8 md:mb-[40px]">
          <h2 className="text-[24px] md:text-[28px] font-bold text-[#222]">
            <span className="text-[#0029C0]">{user.companyName}</span>
            <span className="text-[#0029C0]"> {user.name}</span>님 환영합니다!
          </h2>
        </header>

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
