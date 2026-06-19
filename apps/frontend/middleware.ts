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

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PAGES = ["/", "/signup", "/download"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (!token || PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.status === 401) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    const user = await res.json();
    const encodedUser = encodeURIComponent(JSON.stringify(user));
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", encodedUser);

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch (error) {
    clearTimeout(timeout);
    console.error("Middleware 인증 에러:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
