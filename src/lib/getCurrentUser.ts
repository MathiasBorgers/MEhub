import 'server-only'
import { cookies } from 'next/headers'
import { validateStatefulJwtToken } from './jwtUtils'
import { getUserById } from '@/dal/users'
import type { Profile } from '@/models/users'

export async function getCurrentUser(): Promise<Profile | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decodedToken = validateStatefulJwtToken(token)
    if (!decodedToken) {
      return null
    }

    const user = await getUserById(decodedToken.id)
    return user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}