/**
 * Hook for session management operations
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {revokeSessionAction, extendSessionAction} from '@/serverFunctions/sessions'

interface UseSessionsReturn {
  revokeSession: (sessionId: string) => Promise<void>
  extendSession: (sessionId: string) => Promise<void>
  isRevoking: boolean
  isExtending: boolean
  error: string | null
  clearError: () => void
}

export function useSessions(): UseSessionsReturn {
  const router = useRouter()
  const [isRevoking, startRevokeTransition] = useTransition()
  const [isExtending, startExtendTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const revokeSession = async (sessionId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startRevokeTransition(async () => {
        try {
          await revokeSessionAction({id: sessionId})

          router.refresh()
          resolve()
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to revoke session'
          setError(message)
          reject(err instanceof Error ? err : new Error(message))
        }
      })
    })
  }

  const extendSession = async (sessionId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startExtendTransition(async () => {
        try {
          await extendSessionAction({id: sessionId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to extend session')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    revokeSession,
    extendSession,
    isRevoking,
    isExtending,
    error,
    clearError,
  }
}

