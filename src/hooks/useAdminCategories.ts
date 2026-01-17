/**
 * Hook for admin category management operations
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createCategoryAction, updateCategoryAction, deleteCategoryAction} from '@/serverFunctions/categories'
import {createCategorySchema, updateCategorySchema} from '@/schemas/categorySchemas'
import type {z} from 'zod'

type CreateCategoryData = z.infer<typeof createCategorySchema>
type UpdateCategoryData = z.infer<typeof updateCategorySchema>

interface UseAdminCategoriesReturn {
  createCategory: (data: CreateCategoryData) => Promise<void>
  updateCategory: (data: UpdateCategoryData) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useAdminCategories(): UseAdminCategoriesReturn {
  const router = useRouter()
  const [isCreating, startCreateTransition] = useTransition()
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const createCategory = async (data: CreateCategoryData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startCreateTransition(async () => {
        try {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, String(value))
          })

          const result = await createCategoryAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to create category'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to create category'
          setError(message)
          reject(err)
        }
      })
    })
  }

  const updateCategory = async (data: UpdateCategoryData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startUpdateTransition(async () => {
        try {
          const formData = new FormData()
          Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
              formData.append(key, String(value))
            }
          })

          const result = await updateCategoryAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to update category'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Failed to update category'
          setError(message)
          reject(err instanceof Error ? err : new Error(message))
        }
      })
    })
  }

  const deleteCategory = async (categoryId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await deleteCategoryAction({id: categoryId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete category')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    clearError,
  }
}

