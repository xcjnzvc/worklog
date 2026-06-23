"use client";

import { useUserStore } from "@/store/useUserStore";
import OwnerAttendancePage from "./_views/OwnerAttendancePage";
import AdminAttendancePage from "./_views/AdminAttendancePage";
import UserAttendancePage from "./_views/UserAttendancePage";
import PageLoading from "@/components/PageLoading";

export default function AttendancePage() {
  const { user, isLoading } = useUserStore();

  if (isLoading) return <PageLoading />;
  if (!user) return null;
  if (user.role === "OWNER") return <OwnerAttendancePage />;
  if (user.role === "ADMIN") return <AdminAttendancePage />;
  return <UserAttendancePage />;
}
