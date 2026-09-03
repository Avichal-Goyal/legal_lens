import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
    const token = await getToken({
        req: request,
        secret: process.env.AUTH_SECRET,
    });

    if (!token) {
        const signInUrl = new URL("/userSetup/sign-in", request.url);

        signInUrl.searchParams.set(
        "callbackUrl",
        request.nextUrl.pathname
        );

        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/Dashboard/:path*",
        "/fileText/:path*",
        "/consultant/:path*",
        "/Readers/:path*",
        "/bookOpen/:path*",
        "/proofReader/:path*",
        "/testAnalyze/:path*",
        "/testAnalyze2/:path*",
        "/analysisResult/:path*",
    ],
};