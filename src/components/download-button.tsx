'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { trackDownloadAction } from "@/serverFunctions/downloads"
import { useToast } from "@/hooks/use-toast"

interface DownloadButtonProps {
  scriptId: string
  scriptTitle: string
  luaContent: string | null
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
}

export function DownloadButton({
  scriptId,
  scriptTitle,
  luaContent,
  className,
  size = "lg"
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    if (!luaContent) {
      toast({
        title: "No content available",
        description: "This script doesn't have any Lua content to download.",
        variant: "destructive"
      })
      return
    }

    setIsDownloading(true)

    try {
      // Create FormData for the action
      const formData = new FormData()
      formData.append('scriptId', scriptId)

      // Track the download in the database
      const result = await trackDownloadAction({ success: false }, formData)

      console.log('Download action result:', result)

      if (!result.success) {
        const errorMessage = result.errors?.errors?.[0]
        console.error('Download failed:', result.errors)

        toast({
          title: "Download failed",
          description: typeof errorMessage === 'string' ? errorMessage : 'Failed to track download. Please try again.',
          variant: "destructive"
        })
        return
      }

      // Create the Lua file and download it
      const fileName = `${scriptTitle.replace(/\s+/g, '_').replace(/'/g, '')}.lua`
      const blob = new Blob([luaContent], { type: 'text/x-lua' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      const message = result.data?.alreadyDownloaded
        ? `${fileName} downloaded (already tracked).`
        : `${fileName} is being downloaded.`

      toast({
        title: "Download started",
        description: message,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Failed to download script. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      size={size}
      className={className}
      onClick={handleDownload}
      disabled={isDownloading || !luaContent}
    >
      <Download size={20} className="mr-2" />
      {isDownloading ? 'Downloading...' : 'Download Script'}
    </Button>
  )
}

