// middleware.js
import { NextResponse } from 'next/server';

export function middleware(req) {
    const url = req.nextUrl.clone();
    // list routes you want protected
    const protectedPaths = ['/dashboard', '/booking', '/account'];

    if (protectedPaths.some(p => url.pathname.startsWith(p))) {
        const authCookie = req.cookies.get('auth')?.value;
        if (!authCookie) {
            url.pathname = '/not-authorized';
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/booking/:path*', '/account/:path*']
};
