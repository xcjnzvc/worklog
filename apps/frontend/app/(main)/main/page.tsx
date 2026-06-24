import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { User } from "@/store/useUserStore";
import OwnerMain from "./_views/OwnerMain";
import UserMain from "./_views/UserMain";

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

  if (!user) redirect("/");

  const validUser = user as User;

  if (validUser.role === "OWNER") return <OwnerMain user={validUser} />;

  return <UserMain user={validUser} initialAttendance={null} />;
}
