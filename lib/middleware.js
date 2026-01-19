import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Inspect cookies and token for debugging
  console.log('middleware cookies:', req.headers.get('cookie'));

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  console.log('middleware decoded token:', JSON.stringify(token));

  if (!token) {
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  // Accept multiple shapes: token.role, token.user?.role, token?.roleName
  const rawRole = token.role ?? token.user?.role ?? token.roleName ?? token?.userRole;
  const userRole = typeof rawRole === 'string' ? rawRole.trim().toLowerCase() : undefined;

  if (!userRole) {
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin')) {
    if (userRole !== 'admin' && userRole !== 'super_admin') {
      url.pathname = userRole === 'partner' ? '/partner' : '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/partner')) {
    if (userRole !== 'partner') {
      url.pathname = userRole === 'admin' || userRole === 'super_admin' ? '/admin' : '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    if (userRole === 'user') return NextResponse.next();
    if (userRole === 'admin' || userRole === 'partner') {
      url.pathname = userRole === 'admin' ? '/admin' : '/partner';
      return NextResponse.redirect(url);
    }
    url.pathname = '/auth/signin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/partner/:path*', '/dashboard/:path*', '/dashboard']
};
