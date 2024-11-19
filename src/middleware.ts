import { NextResponse } from "next/server";
import { API } from "./utils/paths";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("funds-explorer-token")?.value;
  const loginUrl = new URL("/", req.url);

  if (!token && pathname !== "/") {
    return NextResponse.redirect(loginUrl);
  }

  if (token) {
    const response = await fetch(`${req.nextUrl.origin}${API.AUTH.VERIFY_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const verifiedToken = await response.json();

    if (verifiedToken.data === undefined) {
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("funds-explorer-token");
      return response;
    } else if (verifiedToken.data !== token) {
      const response = NextResponse.next();
      response.cookies.set("funds-explorer-token", verifiedToken.data);
      return response;
    }

    if (pathname === "/") {
      const dashboardUrl = new URL("/dashboard", req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|/:path*|_next/image|sign-up|favicon.ico|image|sign-up/).*)"], // routes to be unprotected, separated by "|"
};
