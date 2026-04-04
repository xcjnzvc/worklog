"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function SideNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, clearUser } = useUserStore();
  const { logout } = useAuthStore();
  const [popupOpen, setPopupOpen] = useState(false);

  const baseMenus = [
    { name: "대시보드", href: "/main", icon: "/dashboard.svg" },
    { name: "근태", href: "/attendance", icon: "/clock.svg" },
    { name: "일정", href: "/schedule", icon: "/calendar.svg" },
    { name: "프로젝트", href: "/project", icon: "/folder.svg" },
    { name: "휴가", href: "/vacation", icon: "/vacation.svg" },
  ];

  const menus =
    user?.role !== "USER"
      ? [
          ...baseMenus,
          { name: "직원 초대", href: "/invite", icon: "/vacation.svg" },
        ]
      : baseMenus;

  const handleLogout = () => {
    logout();
    clearUser();
    router.push("/");
  };

  const roleLabel =
    {
      OWNER: "대표",
      ADMIN: "관리자",
      USER: "직원",
    }[user?.role ?? "USER"] ?? "직원";

  return (
    <nav className="w-[240px] h-screen bg-white border-r border-[#EEEEEE] flex flex-col p-[20px]">
      <h1 className="text-[24px] font-bold text-[#0023A1] mb-10 px-4">
        WorkLog
      </h1>

      <ul className="flex flex-col gap-2 flex-1">
        {menus.map((menu) => {
          const isActive = pathname === menu.href;
          return (
            <li key={menu.href}>
              <Link
                href={menu.href}
                className={`flex items-center gap-[8px] p-[14px] rounded-[12px] transition-colors ${
                  isActive
                    ? "bg-[#0023A1] text-white"
                    : "hover:bg-[#F5F7FF] text-[#666] hover:text-[#0023A1]"
                }`}
              >
                <Image
                  src={menu.icon}
                  alt={menu.name}
                  width={20}
                  height={20}
                  className={isActive ? "brightness-0 invert" : ""}
                />
                <span className="font-medium">{menu.name}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className="relative">
        {popupOpen && (
          <div className="absolute bottom-[72px] left-0 w-full bg-white border border-[#EEEEEE] rounded-[16px] shadow-lg p-[16px] flex flex-col gap-[12px]">
            <div className="flex flex-col gap-[4px] pb-[12px] border-b border-[#EEEEEE]">
              <span className="text-[12px] text-[#999] bg-[#F5F5F5] rounded-full px-[8px] py-[2px] w-fit">
                {roleLabel}
              </span>
              <span className="text-[13px] text-[#444] mt-[4px]">
                {user?.email}
              </span>
            </div>

            <div className="flex flex-col gap-[8px] pb-[12px] border-b border-[#EEEEEE]">
              <button className="flex items-center gap-[8px] text-[14px] text-[#444] hover:text-[#0029C0] transition-colors">
                <span>⚙️</span> 설정
              </button>
              <button className="flex items-center gap-[8px] text-[14px] text-[#444] hover:text-[#0029C0] transition-colors">
                <span>❓</span> 도움말
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-[8px] text-[14px] text-[#444] hover:text-red-500 transition-colors"
            >
              <span>🚪</span> 로그아웃
            </button>
          </div>
        )}

        <button
          onClick={() => setPopupOpen((prev) => !prev)}
          className="w-full flex items-center gap-[12px] p-[12px] rounded-[12px] hover:bg-[#F5F7FF] transition-colors"
        >
          <div className="w-[36px] h-[36px] rounded-full bg-[#CCCCCC] flex items-center justify-center text-white text-[14px] font-bold flex-shrink-0">
            {user?.name?.[0] ?? "?"}
          </div>
          <div className="flex flex-col items-start overflow-hidden">
            <span className="text-[14px] font-medium text-[#222] truncate w-full text-left">
              {user?.name}
            </span>
            <span className="text-[12px] text-[#999] truncate w-full text-left">
              {user?.companyName}
            </span>
          </div>
        </button>
      </div>
    </nav>
  );
}
