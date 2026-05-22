"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rejectReason: string) => void;
}

export function RejectModal({ isOpen, onClose, onSubmit }: RejectModalProps) {
  const [rejectReason, setRejectReason] = useState("");

  if (!isOpen) return null;

  const handleSubmitClick = () => {
    onSubmit(rejectReason.trim());
    setRejectReason(""); // 제출 후 인풋 초기화
  };

  const handleCloseClick = () => {
    setRejectReason(""); // 닫을 때 인풋 초기화
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-lg font-black text-[#1B254B]">휴가 신청 반려</h3>
          <button
            onClick={handleCloseClick}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-[#707EAE]">
            반려 사유 입력 (선택)
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="팀원에게 전달할 반려 사유를 입력해 주세요. 미입력 시 '사유 없음'으로 처리됩니다."
            maxLength={200}
            className="w-full h-28 p-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-medium text-[#1B254B] focus:outline-none focus:border-[#0029C0] focus:bg-white resize-none transition-all placeholder:text-gray-300"
          />
          <p className="text-right text-[11px] font-medium text-gray-400">
            {rejectReason.length} / 200자
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleCloseClick}
            className="py-3.5 rounded-2xl font-bold text-sm bg-gray-100 hover:bg-gray-200 text-gray-600 transition"
          >
            취소
          </button>
          <button
            onClick={handleSubmitClick}
            className="py-3.5 rounded-2xl font-bold text-sm bg-[#EE5D50] hover:bg-[#d64f43] text-white transition shadow-sm"
          >
            반려 확정
          </button>
        </div>
      </div>
    </div>
  );
}
