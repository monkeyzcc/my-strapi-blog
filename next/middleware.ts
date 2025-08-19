import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  if (!pathname.startsWith('/zh')) {
    return NextResponse.redirect(new URL(`/zh${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url))
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}