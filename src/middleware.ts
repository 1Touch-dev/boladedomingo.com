import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const middleware = (request: NextRequest) => {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  if (hostname.startsWith("www.")) {
    const url = request.nextUrl.clone();
    url.hostname = hostname.replace(/^www\./, "");
    url.protocol = "https:";
    return NextResponse.redirect(url, 308);
  }

  const { pathname } = request.nextUrl;
  const prefix = pathname.match(/^\/(en|pt|es)(?=\/|$)/);
  if (prefix) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/(en|pt|es)/, "") || "/";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
