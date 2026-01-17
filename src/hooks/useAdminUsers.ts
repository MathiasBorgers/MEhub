/**
 * Hook for admin user management operations
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {updateUserRoleAction, deleteUserAction} from '@/serverFunctions/users'
import type {Role} from '@/generated/prisma/enums'

interface UseAdminUsersReturn {
  updateUserRole: (userId: string, role: Role) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useAdminUsers(): UseAdminUsersReturn {
  const router = useRouter()
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const updateUserRole = async (userId: string, role: Role) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startUpdateTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('id', userId)
          formData.append('role', role)

          await updateUserRoleAction({success: false}, formData)

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to update user role')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const deleteUser = async (userId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await deleteUserAction({id: userId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete user')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    updateUserRole,
    deleteUser,
    isUpdating,
    isDeleting,
    error,
    clearError,
  }
}

