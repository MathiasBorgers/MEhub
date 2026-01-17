'use client'

import {useState} from 'react'
import {useAdminCategories} from '@/hooks/useAdminCategories'
import {Button} from '@/components/ui/button'
import {Loader2} from 'lucide-react'

interface EditCategoryFormProps {
  category: {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    color: string
  }
  onSuccess?: () => void
}

export function EditCategoryForm({category, onSuccess}: EditCategoryFormProps) {
  const hook = useAdminCategories()
  const {updateCategory, deleteCategory, isUpdating, isDeleting, error, clearError} = hook
  const [formData, setFormData] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: category.icon,
    color: category.color,
  })
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      clearError()
      await updateCategory({
        id: category.id,
        ...formData,
      })
      alert('Category updated successfully!')
      onSuccess?.()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      clearError()
      await deleteCategory(category.id)
      alert('Category deleted successfully!')
      onSuccess?.()
    } catch (err) {
      console.error(err)
      setShowConfirmDelete(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-mehub-text font-medium mb-2">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-mehub-text font-medium mb-2">Slug</label>
          <input
            type="text"
            value={formData.slug}
            onChange={e => setFormData({...formData, slug: e.target.value})}
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-mehub-text font-medium mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-mehub-text font-medium mb-2">Icon</label>
          <input
            type="text"
            value={formData.icon}
            onChange={e => setFormData({...formData, icon: e.target.value})}
            className="w-full px-4 py-2 bg-mehub-bg border border-mehub-border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-mehub-text font-medium mb-2">Color</label>
          <input
            type="color"
            value={formData.color}
            onChange={e => setFormData({...formData, color: e.target.value})}
            className="w-20 h-10 rounded border border-mehub-border"
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isUpdating}>
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Category'
            )}
          </Button>

          {!showConfirmDelete ? (
            <Button type="button" onClick={() => setShowConfirmDelete(true)} variant="destructive" disabled={isDeleting}>
              Delete Category
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button type="button" onClick={handleDelete} variant="destructive" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </Button>
              <Button type="button" onClick={() => setShowConfirmDelete(false)} variant="outline" disabled={isDeleting}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}

