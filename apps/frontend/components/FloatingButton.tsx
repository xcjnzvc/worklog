"use client";

import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function FloatingButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserStore();

  if (!user || (user.role !== "ADMIN" && user.role !== "OWNER")) return null;

  const isMainPage = pathname === "/main";
  const isOwner = user.role === "OWNER";

  if (isMainPage && isOwner) return null;

  return (
    <button
      title="빠른 작업"
      onClick={() => router.push("/invite")}
      className="fixed bottom-10 right-10 w-[64px] h-[64px] bg-[#0029C0] text-white rounded-full shadow-[0_8px_30px_rgb(0,41,192,0.4)] text-3xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-50"
    >
      +
    </button>
  );
}
