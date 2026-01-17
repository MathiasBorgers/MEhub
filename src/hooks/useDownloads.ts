/**
 * Hook for download tracking operations
 */
'use client'

import {useTransition, useState} from 'react'
import {useRouter} from 'next/navigation'
import {trackDownloadAction, deleteDownloadAction} from '@/serverFunctions/downloads'

interface UseDownloadsReturn {
  trackDownload: (scriptId: string) => Promise<void>
  deleteDownload: (downloadId: string) => Promise<void>
  isTracking: boolean
  isDeleting: boolean
  error: string | null
  clearError: () => void
}

export function useDownloads(): UseDownloadsReturn {
  const router = useRouter()
  const [isTracking, startTrackTransition] = useTransition()
  const [isDeleting, startDeleteTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const clearError = () => setError(null)

  const trackDownload = async (scriptId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startTrackTransition(async () => {
        try {
          const formData = new FormData()
          formData.append('scriptId', scriptId)
          await trackDownloadAction(null as never, formData)

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to track download')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  const deleteDownload = async (downloadId: string) => {
    setError(null)

    return new Promise<void>((resolve, reject) => {
      startDeleteTransition(async () => {
        try {
          await deleteDownloadAction({id: downloadId})

          router.refresh()
          resolve()
        } catch (err) {
          const error = err instanceof Error ? err : new Error('Failed to delete download')
          setError(error.message)
          reject(error)
        }
      })
    })
  }

  return {
    trackDownload,
    deleteDownload,
    isTracking,
    isDeleting,
    error,
    clearError,
  }
}

