"use client";

import SideNav from "@/components/SideNav";
import FloatingButton from "@/components/FloatingButton"; // 컴포넌트 불러오기

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <main className="flex-1 bg-[#FBFBFB] min-h-screen relative">
        {children}
        <FloatingButton />
      </main>
    </div>
  );
}
