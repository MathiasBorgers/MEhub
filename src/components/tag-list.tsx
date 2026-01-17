'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Trash2, Edit2} from 'lucide-react'
import {useAdminTags} from '@/hooks/useAdminTags'
import type {Tag} from '@/generated/prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'

interface TagListProps {
  tags: Tag[]
}

export function TagList({tags}: TagListProps) {
  const {updateTag, deleteTag, isUpdating, isDeleting, error, clearError} = useAdminTags()
  const router = useRouter()
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    color: '',
  })

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      color: tag.color || '#6366f1',
    })
    clearError()
  }

  const handleUpdate = async () => {
    if (!editingTag) return

    try {
      await updateTag({
        id: editingTag.id,
        ...formData,
      })
      setEditingTag(null)
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id)
      setDeletingId(null)
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => (
          <div
            key={tag.id}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-mehub-border bg-mehub-bg"
            style={{
              borderColor: tag.color || undefined,
              color: tag.color || undefined,
            }}
          >
            <span className="font-medium">{tag.name}</span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                className="text-mehub-text-secondary hover:text-mehub-text"
                onClick={() => handleEdit(tag)}
                disabled={isUpdating || isDeleting}
              >
                <Edit2 size={14} />
              </button>
              <button
                className="text-red-500 hover:text-red-600"
                onClick={() => setDeletingId(tag.id)}
                disabled={isUpdating || isDeleting}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingTag} onOpenChange={(open: boolean) => !open && setEditingTag(null)}>
        <DialogContent className="bg-mehub-card border-mehub-border">
          <DialogHeader>
            <DialogTitle className="text-mehub-text">Edit Tag</DialogTitle>
            <DialogDescription className="text-mehub-text-secondary">Make changes to the tag here.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label className="text-mehub-text">Name</Label>
              <Input
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-mehub-bg border-mehub-border text-mehub-text"
              />
            </div>

            <div>
              <Label className="text-mehub-text">Color</Label>
              <Input
                type="color"
                value={formData.color}
                onChange={e => setFormData({...formData, color: e.target.value})}
                className="h-10 w-20 cursor-pointer"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingTag(null)}
              disabled={isUpdating}
              className="border-mehub-border text-mehub-text"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating} className="bg-mehub-primary text-white">
              {isUpdating ? 'Updating...' : 'Update Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open: boolean) => !open && setDeletingId(null)}>
        <DialogContent className="bg-mehub-card border-mehub-border">
          <DialogHeader>
            <DialogTitle className="text-mehub-text">Delete Tag</DialogTitle>
            <DialogDescription className="text-mehub-text-secondary">
              Are you sure you want to delete this tag? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
              disabled={isDeleting}
              className="border-mehub-border text-mehub-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete Tag'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

