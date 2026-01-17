'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Trash2, Edit2} from 'lucide-react'
import {useAdminCategories} from '@/hooks/useAdminCategories'
import type {Category} from '@/generated/prisma/client'
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
import {Textarea} from '@/components/ui/textarea'

interface CategoryListProps {
  categories: Category[]
}

export function CategoryList({categories}: CategoryListProps) {
  const {updateCategory, deleteCategory, isUpdating, isDeleting, error, clearError} = useAdminCategories()
  const router = useRouter()
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '',
    color: '',
  })

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      icon: category.icon,
      color: category.color,
    })
    clearError()
  }

  const handleUpdate = async () => {
    if (!editingCategory) return

    try {
      await updateCategory({
        id: editingCategory.id,
        ...formData,
      })
      setEditingCategory(null)
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id)
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

      <div className="space-y-4">
        {categories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between p-4 bg-mehub-bg rounded-lg border border-mehub-border"
          >
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: category.color}} />
              <div>
                <h3 className="text-mehub-text font-semibold">{category.name}</h3>
                <p className="text-mehub-text-secondary text-sm">{category.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-mehub-border"
                onClick={() => handleEdit(category)}
                disabled={isUpdating || isDeleting}
              >
                <Edit2 size={16} />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => setDeletingId(category.id)}
                disabled={isUpdating || isDeleting}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={(open: boolean) => !open && setEditingCategory(null)}>
        <DialogContent className="bg-mehub-card border-mehub-border">
          <DialogHeader>
            <DialogTitle className="text-mehub-text">Edit Category</DialogTitle>
            <DialogDescription className="text-mehub-text-secondary">
              Make changes to the category here.
            </DialogDescription>
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
              <Label className="text-mehub-text">Slug</Label>
              <Input
                value={formData.slug}
                onChange={e => setFormData({...formData, slug: e.target.value})}
                className="bg-mehub-bg border-mehub-border text-mehub-text"
              />
            </div>

            <div>
              <Label className="text-mehub-text">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({...formData, description: e.target.value})}
                className="bg-mehub-bg border-mehub-border text-mehub-text"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-mehub-text">Icon</Label>
              <Input
                value={formData.icon}
                onChange={e => setFormData({...formData, icon: e.target.value})}
                className="bg-mehub-bg border-mehub-border text-mehub-text"
                placeholder="Lucide icon name"
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
              onClick={() => setEditingCategory(null)}
              disabled={isUpdating}
              className="border-mehub-border text-mehub-text"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating} className="bg-mehub-primary text-white">
              {isUpdating ? 'Updating...' : 'Update Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingId} onOpenChange={(open: boolean) => !open && setDeletingId(null)}>
        <DialogContent className="bg-mehub-card border-mehub-border">
          <DialogHeader>
            <DialogTitle className="text-mehub-text">Delete Category</DialogTitle>
            <DialogDescription className="text-mehub-text-secondary">
              Are you sure you want to delete this category? This action cannot be undone.
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
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

