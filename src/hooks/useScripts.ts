/**
 * Hook for script management operations (Developer & Admin)
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {createScriptAction, updateScriptAction, deleteScriptAction} from '@/serverFunctions/scripts'
import type {z} from 'zod'
import type {createScriptSchema, updateScriptSchema} from '@/schemas/scriptSchemas'

type CreateScriptData = z.infer<typeof createScriptSchema>
type UpdateScriptData = z.infer<typeof updateScriptSchema>

interface UseScriptsReturn {
  createScript: (data: CreateScriptData) => Promise<string | undefined>
  updateScript: (data: UpdateScriptData) => Promise<void>
  deleteScript: (scriptId: string) => Promise<void>
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useScripts(): UseScriptsReturn {
  const router = useRouter()
  const [isCreating, startCreateTransition] = useTransition()
  const [isUpdating, startUpdateTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const createScript = async (data: CreateScriptData) => {
    setError(null)

    return new Promise<string | undefined>((resolve, reject) => {
      startCreateTransition(async () => {
        try {
          const formData = new FormData()

          // Handle regular fields
          Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null) {
              return // Skip undefined/null values
            }

            if (Array.isArray(value)) {
              // Arrays as JSON strings
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'boolean') {
              // Booleans as JSON to preserve type
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'number') {
              // Numbers as JSON to preserve type
              formData.append(key, JSON.stringify(value))
            } else {
              // Everything else as string
              formData.append(key, String(value))
            }
          })

          const result = await createScriptAction({success: false}, formData)

          if (result.success) {
            router.refresh()
            resolve(result.data?.scriptId)
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to create script'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to create script')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const updateScript = async (data: UpdateScriptData) => {
    setError(null)

    console.log("=== useScripts updateScript ===")
    console.log("Input data:", data)

    return new Promise<void>((resolve, reject) => {
      startUpdateTransition(async () => {
        try {
          const formData = new FormData()

          // Handle regular fields
          Object.entries(data).forEach(([key, value]) => {
            if (value === undefined || value === null) {
              return // Skip undefined/null values
            }

            if (Array.isArray(value)) {
              // Arrays as JSON strings
              console.log(`Appending array ${key}:`, value)
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'boolean') {
              // Booleans as JSON to preserve type
              console.log(`Appending boolean ${key}:`, value)
              formData.append(key, JSON.stringify(value))
            } else if (typeof value === 'number') {
              // Numbers as JSON to preserve type
              console.log(`Appending number ${key}:`, value)
              formData.append(key, JSON.stringify(value))
            } else {
              // Everything else as string
              console.log(`Appending string ${key}:`, value)
              formData.append(key, String(value))
            }
          })

          console.log("FormData entries:")
          for (const [key, value] of formData.entries()) {
            console.log(`  ${key}:`, value)
          }

          console.log("Calling updateScriptAction...")
          const result = await updateScriptAction({success: false}, formData)
          console.log("Server result:", result)

          if (result.success) {
            router.refresh()
            resolve()
          } else {
            const message = result.errors?.errors?.[0] || 'Failed to update script'
            setError(message)
            reject(new Error(message))
          }
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to update script')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const deleteScript = async (scriptId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await deleteScriptAction({id: scriptId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete script')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    createScript,
    updateScript,
    deleteScript,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    clearError,
  }
}

