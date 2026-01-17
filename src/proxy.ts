import type {NextRequest} from 'next/server'
import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import type {SessionWithProfile} from '@/models/users'

/**
 * Logging proxy that adds request context headers for the logger.
 * This ensures all log statements include requestId, path, method, sessionId, and userId.
 */
export async function loggingProxy(
  request: NextRequest,
  session: SessionWithProfile | null,
): Promise<NextResponse> {
  const awaitedCookies = await cookies()

  const requestId = crypto.randomUUID()

  // Create new headers from request and add logging context
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-request-id', requestId)
  requestHeaders.set('x-request-path', request.nextUrl.pathname)
  requestHeaders.set('x-request-method', request.method)

  if (session) {
    requestHeaders.set('x-session-id', session.id)
    requestHeaders.set('x-user-id', session.userId)
  }

  // Set requestId cookie for client-side access
  awaitedCookies.set({
    name: 'requestId',
    value: requestId,
    httpOnly: false,
  })

  // Return response with updated request headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

/**
 * Next.js proxy that runs before every request.
 * Adds logging context headers and handles session management.
 */
export async function proxy(request: NextRequest) {
  // Skip proxy for static assets to avoid unnecessary logging
  const pathname = request.nextUrl.pathname
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|webp|css|js|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next()
  }

  // Get session info from cookies (simple reading, no validation to avoid Node.js APIs)
  const awaitedCookies = await cookies()
  const sessionIdCookie = awaitedCookies.get('sessionId') // Correct cookie name
  const sessionUserCookie = awaitedCookies.get('session-user')

  let session: SessionWithProfile | null = null

  // Parse session-user cookie if available (contains basic user info)
  if (sessionIdCookie && sessionUserCookie) {
    try {
      const userInfo = JSON.parse(decodeURIComponent(sessionUserCookie.value)) as {
        id: string
        username: string
        email: string
        role: string
        avatar: string | null
        bio: string | null
      }

      // Decode JWT to get sessionId
      const jwtParts = sessionIdCookie.value.split('.')
      if (jwtParts.length === 3) {
        const payload = JSON.parse(atob(jwtParts[1])) as { sessionId: string }
        session = {
          id: payload.sessionId,
          userId: userInfo.id,
          user: {
            id: userInfo.id,
            username: userInfo.username,
            email: userInfo.email,
            role: userInfo.role,
            avatar: userInfo.avatar,
            bio: userInfo.bio,
            joinDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          activeUntil: new Date(),
          activeFrom: new Date(),
        } as SessionWithProfile
      }
    } catch {
      // Ignore parse errors
    }
  }

  // Add logging headers via loggingProxy and return response
  return loggingProxy(request, session)
}

// Configure which paths the proxy should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}


