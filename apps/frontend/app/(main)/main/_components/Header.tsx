"use client";

import Button from "@/components/Button";
import { Download } from "lucide-react";

interface HeaderProps {
  companyName: string;
  userName: string;
  userRole: string;
  onDownloadClick?: () => void;
}

export default function Header({
  companyName,
  userName,
  userRole,
  onDownloadClick,
}: HeaderProps) {
  const isOwner = userRole === "OWNER";

  const titleTail = isOwner ? "대표님, 반갑습니다!" : "님 환영합니다!";

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8 md:mb-[40px]">
      <div>
        <p className="text-[#0029C0] font-black text-sm mb-1 tracking-wider">
          {companyName}
        </p>

        <h2 className="text-[26px] md:text-[32px] font-black text-[#222] tracking-tight">
          <span className="text-[#0029C0]">{userName}</span>
          <span className="font-medium text-[#555] text-[20px] md:text-[28px] ml-2">
            {titleTail}
          </span>
        </h2>
      </div>

      {isOwner && onDownloadClick && (
        <Button
          size="sm"
          text="월간 리포트 다운로드"
          icon={<Download size={15} />}
          onClick={onDownloadClick}
          // 기본 bg-blue 스타일을 덮어쓰고 테두리 스타일 적용
          className="bg-white border border-gray-200/80 text-gray-700 hover:bg-gray-50 shadow-sm"
        />
      )}
    </header>
  );
}
