"use client";

import { useRouter } from "next/navigation";
import { X, Zap } from "lucide-react";
import Button from "@/components/Button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-[24px] p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-3">
          <h3 className="text-lg font-black text-[#1B254B]">
            플랜 업그레이드 필요
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center py-4 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#0029C0]">
            <Zap size={24} />
          </div>
          <p className="text-[15px] font-bold text-[#1B254B]">
            현재 플랜의 최대 인원에 도달했습니다.
          </p>
          <p className="text-sm text-[#A3AED0] font-medium">
            더 많은 팀원을 초대하려면 플랜을 업그레이드해주세요.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            size="sm"
            text="취소"
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600"
          />
          <Button
            size="sm"
            text="업그레이드하기"
            onClick={() => router.push("/payment")}
            className="bg-[#0029C0] hover:bg-[#001fa0]"
          />
        </div>
      </div>
    </div>
  );
}
