"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SideNav from "@/components/SideNav";
import { useAuthStore } from "@/store/useAuthStore";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const serverDown = useAuthStore((s) => s.serverDown);
  const setServerDown = useAuthStore((s) => s.setServerDown);

  useEffect(() => {
    if (!serverDown) return;

    toast.error("서버와의 연결이 끊겼습니다. 다시 연결해주세요.");
    localStorage.removeItem("isServerAwake");

    setServerDown(false);
    router.push("/");
  }, [serverDown, router, setServerDown]);

  return (
    <div className="flex">
      <SideNav />
      <main className="pt-[60px] lg:pt-0 lg:ml-[240px] flex-1 bg-[#FBFBFB] min-h-screen relative">
        {children}
      </main>
    </div>
  );
}
