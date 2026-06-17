import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware بسيط: يمنع caching تماماً لكل الـ responses
// هذا يحل مشكلة "ERR_TOO_MANY_REDIRECTS" الناتجة عن cached 307 redirects
// في preview proxy
export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Headers قوية تمنع أي caching
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0')
  response.headers.set('Pragma', 'no-cache')
  response.headers.set('Expires', '0')
  response.headers.delete('ETag')
  response.headers.delete('Last-Modified')

  return response
}

export const config = {
  matcher: [
    // كل المسارات ما عدا static assets
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|logo.svg).*)',
  ],
}
