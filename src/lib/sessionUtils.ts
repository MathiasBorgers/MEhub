import type {Profile, SessionWithProfile} from '@/models/users'
import {cookies} from 'next/headers'
import type {Role} from '@prisma/client'
import {extendSession, getSessionProfile} from '@/dal/users'
import type {StatefulJwtTokenBody} from '@/lib/jwtUtils'
import {createStatefulJwtToken, validateStatefulJwtToken} from '@/lib/jwtUtils'

// *********************************************************************************************************************
//                                                   UTILS
// *********************************************************************************************************************

/**
 * Retrieve the session information from the session cookie.
 *
 * @param stateful If false, the validated JWT cookie will be used and the session validity will not be checked against
 * the database. Defaults to true, can be turned off for faster proxy functions.
 */
export async function getSessionFromCookie(stateful = true): Promise<SessionWithProfile | null> {
  if (stateful) {
    const sessionId = await getSessionId()
    return sessionId ? await getSessionProfile(sessionId) : null
  }

  const tokenBody = await getJwtBody()
  if (!tokenBody) return null

  // For stateless sessions, construct a minimal session from JWT
  // Note: This is not a full database profile, just enough for authentication
  return {
    id: tokenBody.sessionId,
    userId: tokenBody.sub,
    user: {
      username: tokenBody.username,
      role: tokenBody.role,
      id: tokenBody.sub,
      email: tokenBody.email,
      bio: null,
      avatar: null,
      joinDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    activeUntil: new Date(tokenBody.exp * 1000),
    activeFrom: new Date(tokenBody.iat * 1000),
  }
}

export async function getSessionProfileFromCookie(stateful = true): Promise<Profile | null> {
  const session = await getSessionFromCookie(stateful)
  return session?.user ?? null
}

export async function getSessionProfileFromCookieOrThrow(stateful = true): Promise<Profile> {
  const session = await getSessionFromCookie(stateful)

  if (!session) {
    throw new Error("Couldn't retrieve the user's profile in getSessionProfileFromCookieOrThrow.")
  }

  return session?.user ?? null
}

export async function extendSessionAndSetCookie(id: string, role: Role): Promise<void> {
  const extendedSession = await extendSession(id, role)
  if (extendedSession) {
    await setSessionCookie(extendedSession)
  }
}

// *********************************************************************************************************************
//                                                   COOKIES
// *********************************************************************************************************************

const cookieName = 'sessionId'
const clientCookieName = 'session-user' // Voor client-side UI (niet veilig, alleen voor display)

/**
 * Add a session cookie to the request which includes the user's session id.
 *
 * @param session The session for which to create a session.
 */
export async function setSessionCookie(session: SessionWithProfile): Promise<void> {
  const awaitedCookies = await cookies()
  const jwt = createStatefulJwtToken(session)

  // Secure httpOnly cookie voor server-side authenticatie
  awaitedCookies.set({
    name: cookieName,
    value: jwt,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: session.activeUntil,
  })

  // Client-readable cookie voor UI (bevat alleen niet-gevoelige info)
  awaitedCookies.set({
    name: clientCookieName,
    value: JSON.stringify({
      id: session.user.id, // Use user.id instead of userId
      username: session.user.username,
      email: session.user.email,
      role: session.user.role,
      bio: session.user.bio,
      avatar: session.user.avatar,
    }),
    httpOnly: false, // Client kan deze lezen
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: session.activeUntil,
  })
}

/**
 * Remove the active session cookie (if there is one).
 */
export async function clearSessionCookie(): Promise<void> {
  const awaitedCookies = await cookies()
  awaitedCookies.delete(cookieName)
  awaitedCookies.delete(clientCookieName) // Ook de client cookie verwijderen
}

/**
 * Retrieve the id of the current session if there is one.
 */
export async function getSessionId(): Promise<string | undefined> {
  const jwt = (await cookies()).get(cookieName)?.value

  if (!jwt) return undefined

  return validateStatefulJwtToken(jwt)?.sessionId
}

export async function getJwtBody(): Promise<StatefulJwtTokenBody | undefined> {
  const jwt = (await cookies()).get(cookieName)?.value

  if (!jwt) return undefined

  return validateStatefulJwtToken(jwt)
}
