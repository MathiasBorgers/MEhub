"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DashboardActionsProps {
  scriptId: string
  scriptTitle: string
  onDelete?: (id: string) => void
}

export function DashboardActions({ scriptId, scriptTitle, onDelete }: DashboardActionsProps) {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleDelete = () => {
    if (onDelete) {
      onDelete(scriptId)
    }
    setDeleteConfirm(null)
  }

  return (
    <>
      {deleteConfirm === scriptId ? (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
            onClick={handleDelete}
          >
            Confirm Delete
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-mehub-border text-mehub-text hover:bg-mehub-hover"
            onClick={() => setDeleteConfirm(null)}
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
    </>
  )
}