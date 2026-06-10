"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore, User } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import UserProfileItem from "./UserProfileItem";
import { Menu, X, Settings, HelpCircle, LogOut } from "lucide-react";
import { UserRole } from "@/types/user";

// --- [공통 메뉴 데이터] ---
const baseMenus = [
  { name: "대시보드", href: "/main", icon: "/dashboard.svg" },
  { name: "근태", href: "/attendance", icon: "/clock.svg" },
  { name: "휴가", href: "/vacation", icon: "/vacation.svg" },
  { name: "일정", href: "/schedule", icon: "/calendar.svg" },
];

// --- [공통 메뉴 리스트 컴포넌트] ---
interface MenuListProps {
  pathname: string;
  userRole?: UserRole;
  onItemClick?: () => void;
}

const MenuList = ({ pathname, userRole, onItemClick }: MenuListProps) => {
  const menus =
    userRole !== "USER"
      ? [
          ...baseMenus,
          { name: "직원 초대", href: "/invite", icon: "/vacation.svg" },
        ]
      : baseMenus;

  return (
    // mt-10을 mt-4로 변경하여 로고와 메뉴 사이의 간격을 좁혔습니다.
    <ul className="flex flex-col gap-2 flex-1 overflow-y-auto mt-4">
      {menus.map((menu) => {
        const isActive = pathname === menu.href;
        return (
          <li key={menu.href}>
            <Link
              href={menu.href}
              onClick={onItemClick}
              className={`flex items-center gap-[10px] p-[16px] rounded-[16px] transition-colors ${
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
              <span className="font-bold text-[15px]">{menu.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

// --- [공통 프로필 영역 컴포넌트] ---
interface UserProfileAreaProps {
  user: User | null;
  clearUser: () => void;
  logout: () => void;
}

const UserProfileArea = ({ user, clearUser, logout }: UserProfileAreaProps) => {
  const router = useRouter();
  const [popupOpen, setPopupOpen] = useState(false);

  const handleLogout = () => {
    logout();
    clearUser();
    router.push("/");
  };

  const roleMap: Record<UserRole, string> = {
    OWNER: "대표",
    ADMIN: "관리자",
    USER: "직원",
    SUPER_ADMIN: "최고관리자",
  };

  const roleLabel = user?.role ? roleMap[user.role] : "직원";

  return (
    <div className="relative mt-auto mb-[5px] w-full">
      {popupOpen && (
        <div className="absolute bottom-full mb-2 right-0 w-full bg-white border border-[#EEEEEE] rounded-[20px] shadow-lg p-[20px] flex flex-col gap-[16px] animate-in fade-in slide-in-from-bottom-2 z-10">
          <div className="flex flex-col gap-2 pb-[16px] border-b border-[#EEEEEE]">
            <span className="text-[12px] text-[#999] bg-[#F5F5F5] rounded-full px-[10px] py-[4px] w-fit font-bold">
              {roleLabel}
            </span>
            <span className="text-[14px] text-[#444] font-medium break-all mt-1">
              {user?.email}
            </span>
          </div>

          <div className="flex flex-col gap-[12px] pb-[16px] border-b border-[#EEEEEE]">
            <button className="flex items-center gap-[10px] text-[15px] text-[#444] hover:text-[#0029C0] transition-colors font-medium">
              <Settings size={18} /> 설정
            </button>
            <button className="flex items-center gap-[10px] text-[15px] text-[#444] hover:text-[#0029C0] transition-colors font-medium">
              <HelpCircle size={18} /> 도움말
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-[10px] text-[15px] text-red-500 hover:bg-red-50 p-3 rounded-[12px] transition-colors w-full text-left font-bold"
          >
            <LogOut size={18} /> 로그아웃
          </button>
        </div>
      )}

      {/* hover:bg-[#F5F7FF] 제거하여 호버 시 배경색이 변하지 않도록 수정 */}
      <button
        onClick={() => setPopupOpen((prev) => !prev)}
        className="w-full rounded-[16px] p-[12px] focus:outline-none"
      >
        <UserProfileItem
          name={user?.name ?? "사용자"}
          description={user?.companyName ?? "회사 정보 없음"}
        />
      </button>
    </div>
  );
};

export default function SideNav() {
  const pathname = usePathname();
  const { user, clearUser } = useUserStore();
  const { logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* 모바일 상단 헤더 */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-[60px] bg-white border-b border-[#EEEEEE] flex items-center justify-between px-6 z-[40]">
        <h1 className="text-[20px] font-bold text-[#0023A1]">WorkLog</h1>
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 text-[#666] hover:bg-[#F5F7FF] rounded-lg"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 모바일 Overlay */}
      <div
        className={`
          lg:hidden fixed inset-0 z-[50] bg-black/40 transition-opacity duration-300
          ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={() => setIsMobileOpen(false)}
      />

      {/* 모바일 Drawer */}
      <div
        className={`
          lg:hidden fixed top-0 right-0 z-[60] h-screen bg-white w-[300px] flex flex-col p-6 transition-transform duration-300 shadow-xl
          ${isMobileOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-[#0023A1]">메뉴</h1>
          <button
            className="text-[#999]"
            onClick={() => setIsMobileOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        <MenuList
          pathname={pathname}
          userRole={user?.role}
          onItemClick={() => setIsMobileOpen(false)}
        />

        <UserProfileArea user={user} clearUser={clearUser} logout={logout} />
      </div>

      {/* 데스크탑 사이드바 */}
      <nav className="hidden lg:flex fixed top-0 left-0 w-[240px] h-screen bg-white border-r border-[#EEEEEE] flex-col px-[20px] pt-[20px] pb-0 z-[30]">
        <h1 className="text-[24px] font-bold text-[#0023A1] mb-[16px] px-4">
          {" "}
          {/* mb-10을 mb-[16px]로 줄여 로고 하단 여백도 축소 */}
          WorkLog
        </h1>

        <MenuList pathname={pathname} userRole={user?.role} />

        {user?.role !== "USER" && (
          <Link
            href="/payment"
            className="flex items-center justify-between px-3 py-2 mb-2 rounded-[12px] bg-blue-50 border border-blue-100"
          >
            <span className="text-xs font-bold text-blue-600">
              FREE 플랜 · 3명 제한
            </span>
            <span className="text-xs text-blue-400">업그레이드 →</span>
          </Link>
        )}

        <UserProfileArea user={user} clearUser={clearUser} logout={logout} />
      </nav>
    </>
  );
}
