// import { headers } from "next/headers";
// import { User } from "@/store/useUserStore";
// import OwnerMain from "./_views/OwnerMain";
// import UserMain from "./_views/UserMain";

// export default async function MainPage() {
//   const headersList = await headers();
//   const userJson = headersList.get("x-user");

//   // 1. 디코딩 후 파싱
//   let user: User | null = null;

//   if (userJson) {
//     try {
//       // encodeURIComponent로 인코딩된 데이터를 다시 복원합니다.
//       const decodedUser = decodeURIComponent(userJson);
//       user = JSON.parse(decodedUser);
//     } catch (error) {
//       console.error("유저 정보 파싱 에러:", error);
//       // 에러 발생 시 user는 null로 유지되어 리다이렉트로 넘어갑니다.
//     }
//   }

//   // 인증 실패 시 처리
//   if (!user) {
//     // redirect('/login'); // 필요시 활성화
//     return null;
//   }

//   if (user.role === "OWNER") {
//     return <OwnerMain user={user} />;
//   }

//   return <UserMain user={user} />;
// }

// import { headers } from "next/headers";
// import { Suspense } from "react"; // 추가
// import { User } from "@/store/useUserStore";
// import OwnerMain from "./_views/OwnerMain";
// import UserMain from "./_views/UserMain";
// import Loading from "@/components/loading";

// export default async function MainPage() {
//   const headersList = await headers();
//   const userJson = headersList.get("x-user");

//   let user: User | null = null;
//   if (userJson) {
//     try {
//       const decodedUser = decodeURIComponent(userJson);
//       user = JSON.parse(decodedUser);
//     } catch (error) {
//       console.error("유저 정보 파싱 에러:", error);
//     }
//   }

//   if (!user) return null;

//   // Suspense로 감싸주면, 하위 컴포넌트가 준비될 때까지 loading.tsx를 보여줍니다.
//   return (
//     <Suspense fallback={<Loading />}>
//       {user.role === "OWNER" ? (
//         <OwnerMain user={user} />
//       ) : (
//         <UserMain user={user} />
//       )}
//     </Suspense>
//   );
// }

// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";
// import { User } from "@/store/useUserStore";
// import OwnerMain from "./_views/OwnerMain";
// import UserMain from "./_views/UserMain";
// import Loading from "@/components/loading";

// export default async function MainPage() {
//   // 1. 쿠키에서 토큰을 가져옵니다.
//   const cookieStore = await cookies();
//   const token = cookieStore.get("accessToken")?.value;

//   // 2. 토큰이 없으면 즉시 로그인 페이지로 리다이렉트합니다.
//   if (!token) {
//     redirect("/");
//   }

//   // 3. 유저 정보를 서버에서 직접 가져옵니다.
//   let user: User | null = null;
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Cache-Control": "no-store",
//       },
//       next: { revalidate: 0 },
//     });

//     if (!res.ok) throw new Error("인증 실패");
//     user = await res.json();
//   } catch (error) {
//     console.error("유저 정보 로딩 에러:", error);
//     redirect("/");
//   }

//   // 4. 이제 user는 확실하게 null이 아닙니다.
//   // 3항 연산자를 사용하여 역할을 분기합니다.
//   return (
//     <Suspense fallback={<Loading />}>
//       {user!.role === "OWNER" ? (
//         <OwnerMain user={user!} />
//       ) : (
//         <UserMain user={user!} />
//       )}
//     </Suspense>
//   );
// }

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/loading";
import OwnerMain from "./_views/OwnerMain";
import UserMain from "./_views/UserMain";
import { cookies } from "next/headers";
import { User } from "@/store/useUserStore";

export default async function MainPage() {
  const headersList = await headers();
  const role = headersList.get("x-user-role");

  if (!role) redirect("/");

  return (
    <Suspense fallback={<Loading />}>
      {role === "OWNER" ? <OwnerMainWrapper /> : <UserMainWrapper />}
    </Suspense>
  );
}

// Wrapper 컴포넌트 (데이터 페칭 담당)
async function OwnerMainWrapper() {
  const user = await getUserData(); // 아래 함수 호출
  return <OwnerMain user={user} />;
}

async function UserMainWrapper() {
  const user = await getUserData(); // 아래 함수 호출
  return <UserMain user={user} />;
}

// 데이터를 가져오는 공통 함수
async function getUserData(): Promise<User> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Cache-Control": "no-store",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) redirect("/");
  return res.json();
}
