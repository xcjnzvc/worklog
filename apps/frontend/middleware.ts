// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const AUTH_PAGES = ["/", "/signup"];

// export async function proxy(request: NextRequest) {
//   // 👈 middleware → proxy
//   const token = request.cookies.get("accessToken")?.value;
//   const { pathname, search } = request.nextUrl;

//   if (pathname === "/signup" && search.includes("token=")) {
//     return NextResponse.next();
//   }

//   if (AUTH_PAGES.includes(pathname) && token) {
//     return NextResponse.redirect(new URL("/main", request.url));
//   }

//   if (!token && !AUTH_PAGES.includes(pathname)) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   if (token && !AUTH_PAGES.includes(pathname)) {
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 401) {
//         const response = NextResponse.redirect(new URL("/", request.url));
//         response.cookies.delete("accessToken");
//         return response;
//       }
//     } catch {
//       // 네트워크 오류 시 통과
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_PAGES = ["/", "/signup"];
const PUBLIC_PAGES = ["/", "/signup", "/download"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname === "/signup" && search.includes("token=")) {
    return NextResponse.next();
  }

  if (AUTH_PAGES.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/main", request.url));
  }

  if (!token && !PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && !PUBLIC_PAGES.includes(pathname)) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        const response = NextResponse.redirect(new URL("/", request.url));
        response.cookies.delete("accessToken");
        return response;
      }
    } catch {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
