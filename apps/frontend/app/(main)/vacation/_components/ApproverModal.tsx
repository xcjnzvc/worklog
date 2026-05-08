"use client";

import React from "react";
import { User, X } from "lucide-react";
// 1. 공통 타입 임포트 (이게 핵심입니다!)
import { Approver } from "@/types/user";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  approvers: Approver[]; // 공통 타입을 사용
  onSelect: (approver: Approver) => void; // 공통 타입을 사용
  selectedId?: string;
}

export default function ApproverModal({
  isOpen,
  onClose,
  approvers,
  onSelect,
  selectedId,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-[#1B254B]/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-[#1B254B]">결재권자 선택</h3>
          <button
            onClick={onClose}
            className="text-[#A3AED0] hover:text-[#1B254B]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {approvers.map((person) => (
            <button
              key={person.id}
              onClick={() => {
                onSelect(person); // 이제 타입이 일치합니다!
                onClose();
              }}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                selectedId === person.id
                  ? "border-[#0029C0] bg-[#F4F7FE]"
                  : "border-transparent bg-[#F8F9FA] hover:bg-[#F4F7FE]"
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#0029C0] shadow-sm">
                <User size={20} />
              </div>
              <div className="text-left">
                <p className="font-bold text-[#1B254B]">{person.name}</p>
                <p className="text-xs text-[#A3AED0] font-medium uppercase tracking-wider">
                  {/* role 타입을 UserRole로 맞춰놨기 때문에 안전하게 비교 가능합니다 */}
                  {person.role === "OWNER" ? "Team Leader" : "Company Admin"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
