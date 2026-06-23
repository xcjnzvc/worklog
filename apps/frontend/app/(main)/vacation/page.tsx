"use client";

import { useUserStore } from "@/store/useUserStore";
import UserVacationPage from "./_views/UserVacationPage";
import AdminVacationPage from "./_views/AdminVacationPage";
import OwnerVacationPage from "./_views/OwnerVacationPage";
import PageLoading from "@/components/PageLoading";

export default function VacationPage() {
  const { user, isLoading } = useUserStore();

  if (isLoading) return <PageLoading />;
  if (!user) return null;
  if (user.role === "OWNER") return <OwnerVacationPage />;
  if (user.role === "ADMIN") return <AdminVacationPage />;
  return <UserVacationPage />;
}
