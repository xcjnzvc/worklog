"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUserStore, User } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";
import { markServerAwake } from "@/lib/serverAwake";
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

// OWNER 전용 메뉴를 상단에 미리 정의
const ownerMenus = [
  { name: "팀원 관리", href: "/members", icon: "/setting.svg" },
  { name: "직원 초대", href: "/invite", icon: "/plus.svg" },
];

// --- [공통 메뉴 리스트 컴포넌트] ---
interface MenuListProps {
  pathname: string;
  userRole?: UserRole;
  onItemClick?: () => void;
}

const MenuList = ({ pathname, userRole, onItemClick }: MenuListProps) => {
  // OWNER라면 기본 메뉴 + 관리 메뉴를 합칩니다.
  const menus =
    userRole === "OWNER" ? [...baseMenus, ...ownerMenus] : baseMenus;

  return (
    <ul className="flex flex-col gap-2 flex-1 overflow-y-auto mt-4">
      {menus.map((menu) => {
        const isActive = pathname.startsWith(menu.href); // 페이지 하위 경로까지 활성화 표시
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
  const containerRef = useRef<HTMLDivElement>(null); // 외부 클릭 감지용 Ref

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setPopupOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    markServerAwake();

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
    <div ref={containerRef} className="relative mt-auto mb-[5px] w-full">
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

      {/* hover:bg-[#F5F7FF] 클래스 복구하여 호버 효과 추가 */}
      <button
        onClick={() => setPopupOpen((prev) => !prev)}
        className="w-full rounded-[16px] p-[12px] focus:outline-none hover:bg-[#F5F7FF] transition-colors"
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
        <Link href="/main">
          <h1 className="text-[20px] font-bold text-[#0023A1] cursor-pointer">
            WorkLog
          </h1>
        </Link>
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

        <MenuList
          pathname={pathname}
          userRole={user?.role}
          onItemClick={() => setIsMobileOpen(false)}
        />

        {/* [여기 추가] 모바일용 결제 안내 배너 */}
        {user?.role !== "USER" && (
          <Link
            href="/payment"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-between px-4 py-3 mb-4 rounded-[16px] bg-blue-50 border border-blue-100"
          >
            <span className="text-[13px] font-bold text-blue-600 truncate mr-2">
              FREE 플랜 · 3명 제한
            </span>
            <span className="text-[13px] text-blue-400 font-medium shrink-0">
              업그레이드 →
            </span>
          </Link>
        )}

        <UserProfileArea user={user} clearUser={clearUser} logout={logout} />
      </div>

      {/* 데스크탑 사이드바 */}
      <nav className="hidden lg:flex fixed top-0 left-0 w-[240px] h-screen bg-white border-r border-[#EEEEEE] flex-col px-[20px] pt-[20px] pb-0 z-[30]">
        <Link href="/main" className="px-4 mb-[16px]">
          <h1 className="text-[24px] font-bold text-[#0023A1] cursor-pointer">
            WorkLog
          </h1>
        </Link>

        <MenuList pathname={pathname} userRole={user?.role} />

        {user?.role !== "USER" && (
          <Link
            href="/payment"
            className="flex items-center justify-between px-3 py-2 mb-2 rounded-[12px] bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors"
          >
            {/* 1. min-w-0을 주어 flex 내에서 텍스트가 줄어들 수 있게 함 */}
            {/* 2. truncate를 사용하여 너무 길 경우 ...으로 표시 */}
            <span className="text-[11px] font-bold text-blue-600 truncate mr-2">
              FREE 플랜 · 3명 제한
            </span>
            {/* 3. shrink-0을 주어 업그레이드 버튼이 찌그러지지 않게 고정 */}
            <span className="text-[11px] text-blue-400 font-medium shrink-0">
              업그레이드 →
            </span>
          </Link>
        )}

        <UserProfileArea user={user} clearUser={clearUser} logout={logout} />
      </nav>
    </>
  );
}
