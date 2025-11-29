// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // Check if the path is exactly the root path "/"
  if (url.pathname === '/') {
    // 1. Update the pathname to '/login'
    url.pathname = '/login';

    // 2. Redirect the user to the new URL
    return NextResponse.redirect(url);
  }

  // If the path is anything else (e.g., /dashboard, /about), continue as normal
  return NextResponse.next();
}

// ⬇️ Configuration object for middleware (optional but recommended)
export const config = {
  // Match all requests except those for static files, API routes, and _next internals.
  // We explicitly match the root path here for simplicity.
  matcher: [
    '/',
  ],
};