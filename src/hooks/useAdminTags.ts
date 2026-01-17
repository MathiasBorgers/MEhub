/**
 * Hook for admin tag management operations
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createTagAction, updateTagAction, deleteTagAction} from '@/serverFunctions/tags'
import type {z} from 'zod'
import type {createTagSchema, updateTagSchema} from '@/schemas/tagSchemas'

type CreateTagData = z.infer<typeof createTagSchema>
type UpdateTagData = z.infer<typeof updateTagSchema>

interface UseAdminTagsReturn {
  createTag: (data: CreateTagData) => Promise<void>
  updateTag: (data: UpdateTagData) => Promise<void>
  deleteTag: (tagId: string) => Promise<void>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useAdminTags(): UseAdminTagsReturn {
  const router = useRouter()
  const [isCreating, startCreateTransition] = useTransition()
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const createTag = async (data: CreateTagData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startCreateTransition(async () => {
        try {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, String(value))
            }
          })

          const result = await createTagAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to create tag'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to create tag')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const updateTag = async (data: UpdateTagData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startUpdateTransition(async () => {
        try {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              formData.append(key, String(value))
            }
          })

          const result = await updateTagAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to update tag'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to update tag')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const deleteTag = async (tagId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await deleteTagAction({id: tagId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete tag')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    createTag,
    updateTag,
    deleteTag,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    clearError,
  }
}

