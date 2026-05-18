"use client";

import SideNav from "@/components/SideNav";
import FloatingButton from "@/components/FloatingButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <SideNav />
      <main className="pt-[60px] lg:pt-0 lg:ml-[240px] flex-1 bg-[#FBFBFB] min-h-screen relative">
        {children}
        <FloatingButton />
      </main>
    </div>
  );
}
