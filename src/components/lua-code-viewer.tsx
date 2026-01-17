"use client"

import { LuaCodeEditor } from "@/components/lua-code-editor"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Download } from "lucide-react"
import { useState } from "react"

interface LuaCodeViewerProps {
  code: string
  title?: string
}

export function LuaCodeViewer({ code, title = "Lua Script" }: LuaCodeViewerProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${title.replace(/\s+/g, "_")}.lua`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="bg-mehub-card border-mehub-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-mehub-text text-xl">{title}</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover bg-transparent"
          >
            <Copy size={16} className="mr-1" />
            {copied ? "Copied!" : "Copy"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover bg-transparent"
          >
            <Download size={16} className="mr-1" />
            Download
          </Button>
        </div>
      </div>
      <LuaCodeEditor value={code} onChange={() => {}} readOnly={true} height="600px" />
      <p className="text-mehub-text-secondary text-sm mt-3">
        💡 This code is read-only. Download the file to edit and use it.
      </p>
    </Card>
  )
}

