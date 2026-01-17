'use client'

import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface FileDownloadButtonProps {
  fileName: string
  fileUrl?: string  // Optional, kept for backwards compatibility
  fileContent?: string
}

export function FileDownloadButton({ fileName, fileContent }: FileDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    setIsDownloading(true)

    try {
      if (fileContent) {
        // If we have the content, download it directly
        const blob = new Blob([fileContent], { type: 'text/plain' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Download started",
          description: `${fileName} is being downloaded.`,
        })
      } else {
        // No content available - show error
        toast({
          title: "Download failed",
          description: "File content is not available.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Download failed",
        description: "Failed to download file. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className="border-mehub-border text-mehub-text hover:bg-mehub-hover bg-transparent"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      <Download size={16} className="mr-1" />
      {isDownloading ? 'Downloading...' : 'Download'}
    </Button>
  )
}

