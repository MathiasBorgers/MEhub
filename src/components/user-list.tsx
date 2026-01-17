'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Shield, User, Crown, Trash2} from 'lucide-react'
import {useAdminUsers} from '@/hooks/useAdminUsers'
import {Role} from '@prisma/client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface UserData {
  id: string
  username: string
  email: string
  role: Role
  joinDate: Date
  _count: {
    scripts: number
    reviews: number
    downloads: number
  }
}

interface UserListProps {
  users: UserData[]
  currentUserId: string
}

export function UserList({users, currentUserId}: UserListProps) {
  const {updateUserRole, deleteUser, isUpdating, isDeleting, error, clearError} = useAdminUsers()
  const router = useRouter()
  const [changingRoleUserId, setChangingRoleUserId] = useState<string | null>(null)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role>(Role.User)

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case Role.Admin:
        return <Crown className="text-yellow-500" size={16} />
      case Role.Developer:
        return <Shield className="text-blue-500" size={16} />
      default:
        return <User className="text-gray-500" size={16} />
    }
  }

  const getRoleBadge = (role: Role) => {
    const colors = {
      [Role.Admin]: 'bg-yellow-500/20 text-yellow-500',
      [Role.Developer]: 'bg-blue-500/20 text-blue-500',
      [Role.User]: 'bg-gray-500/20 text-gray-500',
    }
    return colors[role]
  }

  const handleRoleChange = (userId: string, currentRole: Role) => {
    setChangingRoleUserId(userId)
    setSelectedRole(currentRole)
    clearError()
  }

  const handleUpdateRole = async () => {
    if (!changingRoleUserId) return

    try {
      await updateUserRole(changingRoleUserId, selectedRole)
      setChangingRoleUserId(null)
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId)
      setDeletingUserId(null)
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

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-mehub-border">
            <tr>
              <th className="text-left p-4 text-mehub-text font-semibold">User</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Email</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Role</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Scripts</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Reviews</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Downloads</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Joined</th>
              <th className="text-left p-4 text-mehub-text font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-mehub-border hover:bg-mehub-bg">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className="text-mehub-text font-medium">{user.username}</span>
                  </div>
                </td>
                <td className="p-4 text-mehub-text">{user.email}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleRoleChange(user.id, user.role)}
                    className={`px-2 py-1 rounded text-xs font-medium hover:opacity-80 ${getRoleBadge(user.role)}`}
                    disabled={isUpdating || isDeleting}
                  >
                    {user.role}
                  </button>
                </td>
                <td className="p-4 text-mehub-text">{user._count.scripts}</td>
                <td className="p-4 text-mehub-text">{user._count.reviews}</td>
                <td className="p-4 text-mehub-text">{user._count.downloads}</td>
                <td className="p-4 text-mehub-text-secondary text-sm">
                  {new Date(user.joinDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {user.id !== currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => setDeletingUserId(user.id)}
                      disabled={isUpdating || isDeleting}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Change Role Dialog */}
      <Dialog open={!!changingRoleUserId} onOpenChange={(open: boolean) => !open && setChangingRoleUserId(null)}>
        <DialogContent className="bg-mehub-card border-mehub-border">
          <DialogHeader>
            <DialogTitle className="text-mehub-text">Change User Role</DialogTitle>
            <DialogDescription className="text-mehub-text-secondary">
              Select a new role for this user.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {[Role.User, Role.Developer, Role.Admin].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  selectedRole === role
                    ? 'border-mehub-primary bg-mehub-primary/10'
                    : 'border-mehub-border hover:border-mehub-primary/50'
                }`}
              >
                {getRoleIcon(role)}
                <div className="text-left">
                  <div className="text-mehub-text font-medium">{role}</div>
                  <div className="text-xs text-mehub-text-secondary">
                    {role === Role.Admin && 'Full system access'}
                    {role === Role.Developer && 'Can create and manage scripts'}
                    {role === Role.User && 'Can download and review scripts'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setChangingRoleUserId(null)}
              disabled={isUpdating}
              className="border-mehub-border text-mehub-text"
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateRole} disabled={isUpdating} className="bg-mehub-primary text-white">
              {isUpdating ? 'Updating...' : 'Change Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingUserId} onOpenChange={(open: boolean) => !open && setDeletingUserId(null)}>
        <DialogContent className="bg-mehub-card border-mehub-border">
          <DialogHeader>
            <DialogTitle className="text-mehub-text">Delete User</DialogTitle>
            <DialogDescription className="text-mehub-text-secondary">
              Are you sure you want to delete this user? This will also delete all their scripts, reviews, and
              downloads. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingUserId(null)}
              disabled={isDeleting}
              className="border-mehub-border text-mehub-text"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingUserId && handleDelete(deletingUserId)}
              disabled={isDeleting}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

