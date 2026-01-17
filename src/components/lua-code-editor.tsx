"use client"

import { Editor } from "@monaco-editor/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface LuaCodeEditorProps {
  value: string
  onChange: (value: string) => void
  height?: string
  readOnly?: boolean
}

export function LuaCodeEditor({
  value,
  onChange,
  height = "400px",
  readOnly = false
}: LuaCodeEditorProps) {
  const [isEditorReady, setIsEditorReady] = useState(false)

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || "")
  }

  const handleEditorDidMount = () => {
    setIsEditorReady(true)
  }

  return (
    <div className="relative border border-mehub-border rounded-lg overflow-hidden bg-mehub-bg">
      {!isEditorReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-mehub-bg z-10">
          <Loader2 className="h-8 w-8 animate-spin text-mehub-primary" />
        </div>
      )}
      <Editor
        height={height}
        defaultLanguage="lua"
        language="lua"
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          readOnly: readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          formatOnPaste: true,
          formatOnType: true,
          suggest: {
            showKeywords: true,
            showSnippets: true,
          },
        }}
      />
    </div>
  )
}

