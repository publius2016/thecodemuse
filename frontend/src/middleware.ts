import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getRequestId } from './lib/logger';

/**
 * Next.js middleware to add request ID to all requests
 * This enables tracing requests across the frontend
 */
export function middleware(request: NextRequest) {
  // Generate or extract request ID
  const requestId = getRequestId(request.headers);
  
  // Clone the request headers and add request ID
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-request-id', requestId);
  
  // Create response with request ID header
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Add request ID to response headers
  response.headers.set('X-Request-ID', requestId);
  
  return response;
}

// Configure which routes this middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
