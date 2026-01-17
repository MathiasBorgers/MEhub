"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2, Loader2 } from "lucide-react"
import { useScripts } from "@/hooks/useScripts"

interface DashboardActionsProps {
  scriptId: string
  scriptTitle: string
  onDelete?: (id: string) => void
}

export function DashboardActions({ scriptId, scriptTitle: _scriptTitle, onDelete }: DashboardActionsProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const { deleteScript, isDeleting, error } = useScripts()

  const handleDelete = async () => {
    try {
      await deleteScript(scriptId)

      if (onDelete) {
        onDelete(scriptId)
      }

      setDeleteConfirm(null)
    } catch (err) {
      console.error("Delete error:", err)
      setDeleteConfirm(null)
    }
  }

  return (
    <>
      {deleteConfirm === scriptId ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            onClick={() => void handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                Deleting...
              </>
            ) : (
              "Confirm Delete"
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover"
            onClick={() => setDeleteConfirm(null)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="border-mehub-border text-mehub-text-secondary hover:border-red-400 hover:text-red-400 hover:bg-red-400/10"
          onClick={() => setDeleteConfirm(scriptId)}
        >
          <Trash2 size={16} />
        </Button>
      )}
      {error && (
        <div className="absolute mt-1 p-2 bg-red-500/10 border border-red-500 rounded text-red-500 text-xs whitespace-nowrap z-10">
          {error}
        </div>
      )}
    </>
  )
}

