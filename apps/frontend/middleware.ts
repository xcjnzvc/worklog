// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PUBLIC_PAGES = ["/", "/signup", "/download"];

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("accessToken")?.value;
//   const { pathname } = request.nextUrl;

//   // 1. 토큰이 없거나 퍼블릭 페이지면 바로 통과
//   if (!token || PUBLIC_PAGES.includes(pathname)) {
//     return NextResponse.next();
//   }

//   // 2. 보호된 페이지 진입 시 유저 정보 조회
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     if (res.status === 401) {
//       const response = NextResponse.redirect(new URL("/", request.url));
//       response.cookies.delete("accessToken");
//       return response;
//     }

//     const user = await res.json();

//     console.log("middleware", user);

//     // 3. 헤더에 유저 정보 세팅 (인코딩 필수!)
//     // 한글이 포함될 경우를 대비해 encodeURIComponent 사용
//     const encodedUser = encodeURIComponent(JSON.stringify(user));

//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set("x-user", encodedUser);

//     return NextResponse.next({
//       request: { headers: requestHeaders },
//     });
//   } catch (error) {
//     console.error("Middleware 인증 에러:", error);
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PUBLIC_PAGES = ["/", "/signup", "/download"];

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("accessToken")?.value;
//   const { pathname } = request.nextUrl;

//   if (!token || PUBLIC_PAGES.includes(pathname)) {
//     return NextResponse.next();
//   }

//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 2000);

//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//       headers: { Authorization: `Bearer ${token}` },
//       signal: controller.signal,
//     });
//     clearTimeout(timeout);

//     if (res.status === 401) {
//       const response = NextResponse.redirect(new URL("/", request.url));
//       response.cookies.delete("accessToken");
//       return response;
//     }

//     const user = await res.json();
//     const encodedUser = encodeURIComponent(JSON.stringify(user));
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.set("x-user", encodedUser);

//     return NextResponse.next({ request: { headers: requestHeaders } });
//   } catch (error) {
//     clearTimeout(timeout);
//     console.error("Middleware 인증 에러:", error);
//     return NextResponse.next();
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 공개 페이지 목록
const PUBLIC_PAGES = ["/", "/signup", "/download"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // 1. 공개 페이지는 즉시 통과
  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  // 2. 보호된 페이지 진입 시 토큰 없으면 루트로 리다이렉트
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // 3. JWT 토큰 페이로드 디코딩 (Edge Runtime 호환: atob 사용)
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) throw new Error("Invalid token format");

    // Base64Url 형식을 Base64로 변환 후 디코딩
    const decodedPayload = JSON.parse(
      atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")),
    );

    // 4. 만료 시간 체크 (현재 시간보다 exp가 작으면 만료)
    const now = Math.floor(Date.now() / 1000);
    if (decodedPayload.exp && decodedPayload.exp < now) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    // 5. 검증 성공 시 요청 헤더에 권한 정보 추가하여 전달
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-role", decodedPayload.role || "user");

    return NextResponse.next({
      request: { headers: requestHeaders },
    });
  } catch (e) {
    // 토큰 위조/형식 오류 시 쿠키 삭제 후 리다이렉트
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("accessToken");
    return response;
  }
}

// 미들웨어가 실행될 경로 설정
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
