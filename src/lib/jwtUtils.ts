import 'server-only'
import JWT from 'jsonwebtoken'
import type {Profile, SessionWithProfile} from '@/models/users'
import type {Role} from '@/generated/prisma/enums'

const {PUBLIC_KEY, PRIVATE_KEY} = process.env
const TOKEN_EXPIRATION = '24h'

const PUBLIC_KEY_DECODED = Buffer.from(PUBLIC_KEY!, 'base64').toString('utf-8')
const PRIVATE_KEY_DECODED = Buffer.from(PRIVATE_KEY!, 'base64').toString('utf-8')

export interface TokenBody {
  email: string
  id: string
  role: Role
  username: string
  iat: number
  exp: number
  iss: string
  sub: string
}

export interface StatefulJwtTokenBody extends TokenBody {
  sessionId: string
}

export const validateJwtToken = (token: string): TokenBody | undefined => {
  try {
    return JWT.verify(token, PUBLIC_KEY_DECODED) as unknown as TokenBody
  } catch (_e) {
    return undefined
  }
}

export const validateStatefulJwtToken = (token: string): StatefulJwtTokenBody | undefined => {
  try {
    return JWT.verify(token, PUBLIC_KEY_DECODED) as unknown as StatefulJwtTokenBody
  } catch (_e) {
    return undefined
  }
}

export const createJwtToken = (user: Profile) => {
  return JWT.sign(
    {
      email: user.email,
      id: user.id,
      username: user.username,
      role: user.role,
    },
    PRIVATE_KEY_DECODED,
    {algorithm: 'RS256', expiresIn: TOKEN_EXPIRATION, subject: user.email, issuer: 'contacts-app'},
  )
}

export const createStatefulJwtToken = (session: SessionWithProfile) => {
  return JWT.sign(
    {
      email: session.user.email,
      id: session.user.id,
      username: session.user.username,
      role: session.user.role,
      sessionId: session.id,
    },
    PRIVATE_KEY_DECODED,
    {algorithm: 'RS256', expiresIn: TOKEN_EXPIRATION, subject: session.user.email, issuer: 'contacts-app'},
  )
}
