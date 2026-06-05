import { NextResponse } from 'next/server'

export function middleware(req) {
  const auth = req.cookies.get('admin_auth')?.value
  if (req.nextUrl.pathname.startsWith('/dashboard') && auth !== 'true') {
    return NextResponse.redirect(new URL('/', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*']
}
