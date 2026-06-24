"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function NavigationLoader() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // 마운트 시엔 로딩 안 띄움
    const id = setTimeout(() => setLoading(true), 0);
    timerRef.current = setTimeout(() => setLoading(false), 500);

    return () => {
      clearTimeout(id);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-[#F8F9FA]/80 flex items-center justify-center z-[100]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-4 border-[#0023A1] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-400 font-medium">
          불러오는 중...
        </span>
      </div>
    </div>
  );
}
