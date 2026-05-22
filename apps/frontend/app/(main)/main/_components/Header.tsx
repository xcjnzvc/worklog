"use client";

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
        <button
          onClick={onDownloadClick}
          className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl border border-gray-200/80 font-black text-xs hover:bg-gray-50 shadow-sm transition-all"
        >
          <Download size={15} />
          월간 리포트 다운로드
        </button>
      )}
    </header>
  );
}
