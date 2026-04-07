// @/components/common/UserProfileItem.tsx (또는 _components 내)

import React from "react";

interface UserProfileItemProps {
  name: string;
  description: string; // 네비바에서는 회사명, 여기선 직무
  image?: string;
  //   size?: "sm" | "md";
}

export default function UserProfileItem({
  name,
  description,
  //   size = "md",
}: UserProfileItemProps) {
  //   const avatarSize = size === "sm" ? "w-9 h-9" : "w-12 h-12";

  return (
    <div className="flex items-center gap-3">
      {/* 아바타 이미지 영역 */}
      <div
        className={`w-[40px] h-[40px] rounded-full bg-[#CCCCCC] flex-shrink-0 flex items-center justify-center text-white font-bold text-[14px]`}
      >
        {name[0]} {/* 이미지가 없을 때 이름 첫 글자 표시 */}
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-col overflow-hidden text-left">
        <span className="text-[15px] font-bold text-gray-900 truncate">
          {name}
        </span>
        <span className="text-[13px] text-gray-400 font-medium truncate">
          {description}
        </span>
      </div>
    </div>
  );
}
