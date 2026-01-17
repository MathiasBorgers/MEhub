'use client'

import {useState} from 'react'
import {useAdminUsers} from '@/hooks'
import {Button} from '@/components/ui/button'
import {Role} from '@prisma/client'
import {Loader2} from 'lucide-react'

interface AdminUserActionsProps {
  userId: string
  currentRole: Role
  username: string
}

export function AdminUserActions({userId, currentRole, username}: AdminUserActionsProps) {
  const {updateUserRole, deleteUser, isUpdating, isDeleting, error, clearError} = useAdminUsers()
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  const handleRoleChange = async (newRole: Role) => {
    try {
      clearError()
      await updateUserRole(userId, newRole)
      alert(`User ${username} role updated to ${newRole}`)
    } catch (err) {
      // Error is handled by the hook
      console.error(err)
    }
  }

  const handleDelete = async () => {
    try {
      clearError()
      await deleteUser(userId)
      setShowConfirmDelete(false)
      alert(`User ${username} deleted successfully`)
    } catch (err) {
      // Error is handled by the hook
      console.error(err)
      setShowConfirmDelete(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-lg">
          <p className="font-medium">Error:</p>
          <p>{error}</p>
        </div>
      )}

      <div className="flex gap-2">
        <div className="space-y-2">
          <p className="text-sm font-medium text-mehub-text">Change Role:</p>
          <div className="flex gap-2">
            {[Role.User, Role.Developer, Role.Admin].map(role => (
              <Button
                key={role}
                onClick={() => handleRoleChange(role)}
                disabled={isUpdating || currentRole === role}
                variant={currentRole === role ? 'default' : 'outline'}
                size="sm"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  role
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div>
        {!showConfirmDelete ? (
          <Button onClick={() => setShowConfirmDelete(true)} variant="destructive" size="sm" disabled={isDeleting}>
            Delete User
          </Button>
        ) : (
          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg space-y-2">
            <p className="text-sm font-medium text-red-900 dark:text-red-100">
              Are you sure you want to delete user {username}?
            </p>
            <div className="flex gap-2">
              <Button onClick={handleDelete} variant="destructive" size="sm" disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </Button>
              <Button onClick={() => setShowConfirmDelete(false)} variant="outline" size="sm" disabled={isDeleting}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

