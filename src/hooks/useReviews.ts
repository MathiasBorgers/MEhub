/**
 * Hook for review management operations
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createReviewAction, updateReviewAction, deleteReviewAction} from '@/serverFunctions/reviews'
import type {z} from 'zod'
import type {createReviewSchema, updateReviewSchema} from '@/schemas/reviewSchemas'

type CreateReviewData = z.infer<typeof createReviewSchema>
type UpdateReviewData = z.infer<typeof updateReviewSchema>

interface UseReviewsReturn {
  createReview: (data: CreateReviewData) => Promise<void>
  updateReview: (data: UpdateReviewData) => Promise<void>
  deleteReview: (reviewId: string) => Promise<void>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useReviews(): UseReviewsReturn {
  const router = useRouter()
  const [isCreating, startCreateTransition] = useTransition()
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const createReview = async (data: CreateReviewData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startCreateTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('scriptId', data.scriptId)
          formData.append('rating', String(data.rating))
          if (data.comment !== null && data.comment !== undefined) {
            formData.append('comment', data.comment)
          }

          const result = await createReviewAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to create review'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to create review')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const updateReview = async (data: UpdateReviewData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startUpdateTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('id', data.id)
          if (data.rating !== undefined) {
            formData.append('rating', String(data.rating))
          }
          if (data.comment !== undefined && data.comment !== null) {
            formData.append('comment', data.comment)
          }

          const result = await updateReviewAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to update review'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to update review')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const deleteReview = async (reviewId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await (deleteReviewAction as (data: {id: string}) => Promise<void>)({id: reviewId})
          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete review')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    createReview,
    updateReview,
    deleteReview,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    clearError,
  }
}

