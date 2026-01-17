import 'server-only'
import type { Profile } from '@/models/users'
import { getSessionProfileFromCookie } from './sessionUtils'

/**
 * @deprecated Use getSessionProfileFromCookie() from sessionUtils instead
 * This function uses the old auth-token cookie which is no longer used
 */
export async function getCurrentUser(): Promise<Profile | null> {
  // Redirect to the new session management function
  return getSessionProfileFromCookie()
}