import { headers } from "next/headers";
import { User } from "@/store/useUserStore";
import OwnerMain from "./_views/OwnerMain";
import UserMain from "./_views/UserMain";
import { getTodayAttendanceServer } from "@/api/attendance.server";

export default async function MainPage() {
  const headersList = await headers();
  const userJson = headersList.get("x-user");

  let user: User | null = null;
  if (userJson) {
    try {
      user = JSON.parse(decodeURIComponent(userJson));
    } catch (error) {
      console.error("유저 정보 파싱 에러:", error);
    }
  }

  if (!user) return null;

  if (user.role === "OWNER") return <OwnerMain user={user} />;

  // OWNER가 아닐 때만 서버에서 미리 fetch
  let initialAttendance = null;
  try {
    initialAttendance = await getTodayAttendanceServer();
  } catch {
    // 실패해도 클라이언트에서 재시도
  }

  return <UserMain user={user} initialAttendance={initialAttendance} />;
}
