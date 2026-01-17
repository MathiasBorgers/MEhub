# Custom Hooks voor CRUD Operaties

Deze hooks maken het eenvoudig om alle CRUD operaties uit te voeren in je React components.

## Beschikbare Hooks

### 1. `useAdminUsers` - User Management (Admin only)
```typescript
import { useAdminUsers } from '@/hooks'

const { 
  updateUserRole, 
  deleteUser, 
  isUpdating, 
  isDeleting, 
  error, 
  clearError 
} = useAdminUsers()

// Update user role
await updateUserRole(userId, 'Developer')

// Delete user
await deleteUser(userId)
```

### 2. `useAdminCategories` - Category Management (Admin only)
```typescript
import { useAdminCategories } from '@/hooks'

const { 
  createCategory, 
  updateCategory, 
  deleteCategory,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  clearError
} = useAdminCategories()

// Create category
await createCategory({
  name: 'Combat',
  slug: 'combat',
  description: 'Combat related scripts',
  icon: 'Swords',
  color: '#ff0000'
})

// Update category
await updateCategory({
  id: categoryId,
  name: 'Updated Name'
})

// Delete category
await deleteCategory(categoryId)
```

### 3. `useAdminTags` - Tag Management (Admin only)
```typescript
import { useAdminTags } from '@/hooks'

const { 
  createTag, 
  updateTag, 
  deleteTag,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  clearError
} = useAdminTags()

// Create tag
await createTag({
  name: 'PvM',
  color: '#00ff00'
})

// Update tag
await updateTag({
  id: tagId,
  name: 'Updated Tag'
})

// Delete tag
await deleteTag(tagId)
```

### 4. `useScripts` - Script Management (Developer & Admin)
```typescript
import { useScripts } from '@/hooks'

const { 
  createScript, 
  updateScript, 
  deleteScript,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  clearError
} = useScripts()

// Create script
const scriptId = await createScript({
  title: 'My Script',
  description: 'Short description',
  fullDescription: 'Long description...',
  version: '1.0.0',
  categoryId: 'uuid',
  requirements: ['Requirement 1'],
  features: ['Feature 1'],
  screenshots: ['https://...'],
  tagIds: ['tag-uuid-1', 'tag-uuid-2']
})

// Update script
await updateScript({
  id: scriptId,
  title: 'Updated Title'
})

// Delete script
await deleteScript(scriptId)
```

### 5. `useReviews` - Review Management
```typescript
import { useReviews } from '@/hooks'

const { 
  createReview, 
  updateReview, 
  deleteReview,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  clearError
} = useReviews()

// Create review
await createReview({
  scriptId: 'uuid',
  rating: 5,
  comment: 'Great script!'
})

// Update review
await updateReview({
  id: reviewId,
  rating: 4,
  comment: 'Updated comment'
})

// Delete review
await deleteReview(reviewId)
```

### 6. `useFiles` - File Management (Developer & Admin)
```typescript
import { useFiles } from '@/hooks'

const { 
  createFile, 
  updateFile, 
  deleteFile,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  clearError
} = useFiles()

// Create file
await createFile({
  name: 'script.js',
  size: BigInt(1024),
  type: 'application/javascript',
  url: 'https://...',
  scriptId: 'uuid'
})

// Update file
await updateFile({
  id: fileId,
  name: 'updated-script.js',
  url: 'https://...'
})

// Delete file
await deleteFile(fileId)
```

### 7. `useDownloads` - Download Tracking
```typescript
import { useDownloads } from '@/hooks'

const { 
  trackDownload, 
  deleteDownload,
  isTracking,
  isDeleting,
  error,
  clearError
} = useDownloads()

// Track download
await trackDownload(scriptId)

// Delete download record
await deleteDownload(downloadId)
```

### 8. `useSessions` - Session Management
```typescript
import { useSessions } from '@/hooks'

const { 
  revokeSession, 
  extendSession,
  isRevoking,
  isExtending,
  error,
  clearError
} = useSessions()

// Revoke session
await revokeSession(sessionId)

// Extend session
await extendSession(sessionId)
```

## Voorbeeld Component

```typescript
'use client'

import { useAdminUsers } from '@/hooks'
import { Button } from '@/components/ui/button'
import { Role } from '@/generated/prisma/enums'

export function AdminUserManagement({ userId }: { userId: string }) {
  const { updateUserRole, deleteUser, isUpdating, isDeleting, error } = useAdminUsers()

  const handlePromoteToDeveloper = async () => {
    try {
      await updateUserRole(userId, Role.Developer)
      alert('User promoted to Developer!')
    } catch (err) {
      // Error is already handled by the hook
      console.error(err)
    }
  }

  const handleDeleteUser = async () => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId)
        alert('User deleted!')
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500 text-white p-4 rounded">
          {error}
        </div>
      )}
      
      <Button 
        onClick={handlePromoteToDeveloper}
        disabled={isUpdating}
      >
        {isUpdating ? 'Updating...' : 'Promote to Developer'}
      </Button>
      
      <Button 
        onClick={handleDeleteUser}
        disabled={isDeleting}
        variant="destructive"
      >
        {isDeleting ? 'Deleting...' : 'Delete User'}
      </Button>
    </div>
  )
}
```

## Features

- ✅ **Type-safe**: Alle hooks zijn volledig getypeerd met TypeScript
- ✅ **Loading states**: Elke operatie heeft zijn eigen loading state (`isCreating`, `isUpdating`, `isDeleting`)
- ✅ **Error handling**: Centrale error handling met `error` state en `clearError()` functie
- ✅ **Automatic refresh**: Na elke operatie wordt `router.refresh()` aangeroepen
- ✅ **Promise-based**: Alle operaties returnen een Promise voor async/await gebruik
- ✅ **Optimistic updates**: Gebruikt React transitions voor betere UX

## Hoe het werkt

1. Elke hook gebruikt `useTransition()` voor non-blocking updates
2. Bij success wordt `router.refresh()` aangeroepen om de UI te updaten
3. Errors worden centraal afgehandeld en kunnen worden weergegeven in de UI
4. Alle FormData conversies worden automatisch gedaan
5. Server actions worden correct aangeroepen met validatie

