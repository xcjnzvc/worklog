"use client";

import React, { useState, useMemo } from "react";
import { Plus, Calendar, PieChart, List } from "lucide-react";
import { VacationTabs, VacationTabType } from "./_components/VacationTabs";
import { VacationTable, VacationTableRow } from "./_components/VacationTable";
import Link from "next/link";

export interface VacationData {
  id: string;
  displayId: string;
  type: "ANNUAL" | "HALF";
  startDate: string;
  endDate: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  reason: string;
  durationText: string;
  approver: string;
  timeDetail: string | null;
}

const RAW_DATA: VacationData[] = [
  {
    id: "1",
    displayId: "001",
    type: "ANNUAL",
    startDate: "2026.04.18",
    endDate: "2026.04.20",
    status: "APPROVED",
    reason: "가족 여행",
    durationText: "2.0일",
    approver: "김팀장",
    timeDetail: null,
  },
  {
    id: "2",
    displayId: "002",
    type: "HALF",
    startDate: "2026.04.25",
    endDate: "2026.04.25",
    status: "PENDING",
    reason: "오전 병원 진료",
    durationText: "0.5일",
    approver: "이이사",
    timeDetail: "오전",
  },
  {
    id: "3",
    displayId: "003",
    type: "HALF",
    startDate: "2026.04.28",
    endDate: "2026.04.28",
    status: "REJECTED",
    reason: "개인 업무",
    durationText: "0.5일",
    approver: "박대표",
    timeDetail: "오후",
  },
];

export default function VacationPage() {
  const [activeTab, setActiveTab] = useState<VacationTabType>("LIST");
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredData = useMemo((): VacationTableRow[] => {
    const formatted = RAW_DATA.map((item) => ({
      ...item,
      formattedPeriod:
        item.startDate === item.endDate
          ? item.startDate
          : `${item.startDate} - ${item.endDate.split(".").slice(2).join(".")}`,
    }));
    return formatted.filter(
      (item) =>
        item.reason.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.approver.toLowerCase().includes(searchKeyword.toLowerCase()),
    );
  }, [searchKeyword]);

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] p-6 md:p-10 font-sans text-[#1B254B]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* 상단 헤더 섹션 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-[32px] font-black text-[#1B254B] tracking-tight">
              휴가 관리
            </h1>
            <p className="text-[#A3AED0] font-medium mt-1">
              나의 휴가 현황을 확인하고 신청할 수 있습니다.
            </p>
          </div>

          {/* <button className="flex items-center gap-2 bg-[#0029C0] text-white px-8 py-4 rounded-[20px] font-bold shadow-[0_10px_20px_rgba(0,41,192,0.15)] hover:bg-[#0023A1] hover:scale-[1.02] active:scale-[0.98] transition-all">
            <Plus size={20} strokeWidth={3} />
            <span>새 휴가 신청하기</span>
          </button> */}
          <Link href="/vacation/create">
            <button className="flex items-center gap-2 bg-[#0029C0] text-white px-8 py-4 rounded-[20px] font-bold shadow-[0_10px_20px_rgba(0,41,192,0.15)] hover:bg-[#0023A1] hover:scale-[1.02] active:scale-[0.98] transition-all">
              <Plus size={20} strokeWidth={3} />
              <span>새 휴가 신청하기</span>
            </button>
          </Link>
        </div>

        {/* 대시보드 요약 정보 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "총 연차",
              value: "15.0일",
              color: "text-[#1B254B]",
              icon: <Calendar size={20} />,
            },
            {
              label: "사용한 연차",
              value: "2.5일",
              color: "text-[#4318FF]",
              icon: <PieChart size={20} />,
            },
            {
              label: "잔여 연차",
              value: "12.5일",
              color: "text-[#00B050]",
              icon: <List size={20} />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50 flex items-center gap-6"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-[#F4F7FE] flex items-center justify-center ${stat.color} opacity-80`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-bold text-[#A3AED0]">{stat.label}</p>
                <p className={`text-[28px] font-black mt-1 ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 탭 및 컨트롤바 영역 */}
        <VacationTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          searchKeyword={searchKeyword}
          onSearchChange={setSearchKeyword}
        />

        {/* 콘텐츠 영역 (이펙트 제거) */}
        {activeTab === "LIST" ? (
          <div>
            <VacationTable
              data={filteredData}
              onItemClick={(item) => console.log("상세 보기:", item)}
            />
            {filteredData.length === 0 && (
              <div className="py-32 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                <p className="text-[#A3AED0] font-bold text-lg">
                  해당하는 휴가 내역이 없습니다.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] p-24 text-center border border-gray-50 shadow-sm">
            <div className="w-20 h-20 bg-[#F4F7FE] rounded-3xl flex items-center justify-center mx-auto mb-6 text-[#4318FF]">
              <PieChart size={40} />
            </div>
            <h3 className="text-2xl font-black text-[#1B254B] mb-2">
              통계 리포트 준비 중
            </h3>
            <p className="text-[#A3AED0] font-medium text-lg">
              사용자의 연간 휴가 사용 패턴을 분석하고 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
