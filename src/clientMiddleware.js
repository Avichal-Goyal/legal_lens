import { NextRequest, NextResponse } from "next/server";

export function clientMiddleware(req) {
    const path = req.nextUrl.pathname;
    const isPublicPath = path === '/login' || path === '/signup' || path === '/verifyemail';

    const token = req.cookies.get('token')?.value || '';

    if(isPublicPath && token) {
        return NextResponse.redirect(new URL('/profile', req.nextUrl));
    }

    if(!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
    }
}
export const config = {
    matcher: ["/proofReader", "/consultant", "/Readers", "/bookOpen", "/fileText", "/dashboard", "/login", "/signup"],
};