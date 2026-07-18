"use client";

import React from "react";
import Button from "@/components/Button";

// 데이터 타입 정의 (프로젝트 환경에 맞춰 수정하세요)
export interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MemberTableProps {
  data: Member[];
  onDelete: (member: Member) => void;
}

export const MemberTable = ({ data, onDelete }: MemberTableProps) => {
  if (data.length === 0) {
    return (
      <div className="py-20 text-center text-[#A3AED0]">
        등록된 팀원이 없습니다.
      </div>
    );
  }

  return (
    <>
      {/* ── 모바일 카드 뷰 (sm 미만) ── */}
      <div className="sm:hidden flex flex-col gap-4">
        {data.map((member) => (
          <div
            key={member.id}
            className="bg-white border border-gray-50 rounded-[28px] p-6 shadow-sm flex flex-col gap-3"
          >
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-sm text-[#1B254B]">
                {member.name}
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-black bg-[#F4F7FE] text-[#4318FF]">
                {member.role}
              </span>
            </div>
            <div className="text-sm text-[#707EAE]">{member.email}</div>

            {member.role !== "OWNER" && (
              <div className="pt-2 border-t border-gray-50">
                <Button
                  size="sm"
                  text="탈퇴 처리"
                  onClick={() => onDelete(member)}
                  className="bg-[#FFEEF2] text-[#EE5D50] hover:bg-[#FFDDE4] w-full"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── 데스크탑/태블릿 테이블 뷰 (sm 이상) ── */}
      <div className="hidden sm:block overflow-x-auto scrollbar-hide">
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                이름
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                이메일
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                권한
              </th>
              <th className="px-4 py-4 text-[13px] font-bold text-[#A3AED0] text-center">
                관리
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((member) => (
              <tr
                key={member.id}
                className="text-center border-b border-gray-50 last:border-none"
              >
                <td className="px-4 py-5 text-sm font-bold text-[#1B254B]">
                  {member.name}
                </td>
                <td className="px-4 py-5 text-sm text-[#707EAE]">
                  {member.email}
                </td>
                <td className="px-4 py-5 text-sm font-medium text-[#4318FF]">
                  {member.role}
                </td>
                <td className="px-4 py-5">
                  {member.role !== "OWNER" && (
                    <Button
                      size="sm"
                      text="탈퇴"
                      onClick={() => onDelete(member)}
                      className="bg-[#FFEEF2] text-[#EE5D50] hover:bg-[#FFDDE4] mx-auto"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
