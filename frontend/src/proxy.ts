import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from './lib/auth'

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value

  // Paths that require auth
  if (request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const payload = await verifyAccessToken(token) as any;
    
    if (!payload) {
      // Invalid or expired token
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Role verification
    if (request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Redirect authenticated users away from public pages like login
  if (request.nextUrl.pathname === '/login' && token) {
     const payload = await verifyAccessToken(token) as any;
     if (payload) {
        if (payload.role === 'ADMIN') {
           return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        return NextResponse.redirect(new URL('/dashboard', request.url));
     }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login'],
}
