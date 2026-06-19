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

import { headers } from "next/headers";
import { Suspense } from "react"; // 추가
import { User } from "@/store/useUserStore";
import OwnerMain from "./_views/OwnerMain";
import UserMain from "./_views/UserMain";
import Loading from "@/components/loading";

export default async function MainPage() {
  const headersList = await headers();
  const userJson = headersList.get("x-user");

  let user: User | null = null;
  if (userJson) {
    try {
      const decodedUser = decodeURIComponent(userJson);
      user = JSON.parse(decodedUser);
    } catch (error) {
      console.error("유저 정보 파싱 에러:", error);
    }
  }

  if (!user) return null;

  // Suspense로 감싸주면, 하위 컴포넌트가 준비될 때까지 loading.tsx를 보여줍니다.
  return (
    <Suspense fallback={<Loading />}>
      {user.role === "OWNER" ? (
        <OwnerMain user={user} />
      ) : (
        <UserMain user={user} />
      )}
    </Suspense>
  );
}
