/**
 * Hook for file management operations (Developer & Admin)
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createFileAction, updateFileAction, deleteFileAction} from '@/serverFunctions/files'
import type {z} from 'zod'
import type {createFileSchema, updateFileSchema} from '@/schemas/fileSchemas'

type CreateFileData = z.infer<typeof createFileSchema>
type UpdateFileData = z.infer<typeof updateFileSchema>

interface UseFilesReturn {
  createFile: (data: CreateFileData) => Promise<void>
  updateFile: (data: UpdateFileData) => Promise<void>
  deleteFile: (fileId: string) => Promise<void>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useFiles(): UseFilesReturn {
  const router = useRouter()
  const [isCreating, startCreateTransition] = useTransition()
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const createFile = async (data: CreateFileData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startCreateTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('name', data.name)
          formData.append('size', String(data.size))
          formData.append('type', data.type)
          formData.append('url', data.url)
          formData.append('scriptId', data.scriptId)

          const result = await createFileAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to create file'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to create file')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const updateFile = async (data: UpdateFileData) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startUpdateTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('id', data.id)
          if (data.name !== undefined && data.name !== null) {
            formData.append('name', data.name)
          }
          if (data.url !== undefined && data.url !== null) {
            formData.append('url', data.url)
          }

          const result = await updateFileAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to update file'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to update file')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const deleteFile = async (fileId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await deleteFileAction({id: fileId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete file')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    createFile,
    updateFile,
    deleteFile,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    clearError,
  }
}

