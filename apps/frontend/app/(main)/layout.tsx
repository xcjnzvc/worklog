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
      <main className="ml-[240px] flex-1 bg-[#FBFBFB] min-h-screen relative">
        {children}
        <FloatingButton />
      </main>
    </div>
  );
}
