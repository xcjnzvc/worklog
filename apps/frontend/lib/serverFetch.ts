import { cookies } from "next/headers";

export async function serverFetch<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value; // 쿠키 이름 확인 완료

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`fetch 실패: ${res.status}`);
  return res.json();
}
