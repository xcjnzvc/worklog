// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// const PUBLIC_PAGES = ["/", "/signup", "/download"];

// export async function middleware(request: NextRequest) {
//   const token = request.cookies.get("accessToken")?.value;
//   const { pathname } = request.nextUrl;

//   if (PUBLIC_PAGES.includes(pathname)) {
//     return NextResponse.next();
//   }

//   if (!token) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   const controller = new AbortController();
//   const timeout = setTimeout(() => controller.abort(), 5000);

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
//   } catch {
//     clearTimeout(timeout);
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

  if (PUBLIC_PAGES.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const payloadBase64 = token.split(".")[1];
    const decoded = JSON.parse(
      atob(payloadBase64.replace(/-/g, "+").replace(/_/g, "/")),
    );

    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < now) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.delete("accessToken");
      return response;
    }

    // x-user에 필요한 정보 전부 담기
    const user = {
      id: decoded.userId || decoded.sub,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      companyId: decoded.companyId,
      companyName: decoded.companyName,
      plan: decoded.plan,
      maxMembers: decoded.maxMembers,
    };

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user", encodeURIComponent(JSON.stringify(user)));

    return NextResponse.next({ request: { headers: requestHeaders } });
  } catch {
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("accessToken");
    return response;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
