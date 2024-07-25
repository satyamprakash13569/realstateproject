import { NextResponse } from "next/server";
export function middleware(request) {
    const path = request.nextUrl.pathname;
    const isProtectedPath = path === "/profile" || path==="/avatar" || "/createListing" || "/verifyEmail";
    const token = request.cookies.get("token")?.value || '';
    if (isProtectedPath && !token) {
        return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    if (isProtectedPath && token) {
        return NextResponse.next();
    }
}
export const config = {
    matcher: ['/profile/:path*',"/createListing/:path*","/avatar/:path*","/verifyEmail/:path*"]
};