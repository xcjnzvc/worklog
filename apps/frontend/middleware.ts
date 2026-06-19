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

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

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
  } catch {
    clearTimeout(timeout);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
