import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@/generated/prisma/enums"
import { prismaClient } from "@/dal/prismaClient"
import {UserList} from '@/components/user-list'

export default async function AdminUsersPage() {
  const profile = await getSessionProfileFromCookie()
  
  if (!profile || profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  // Get all users
  const users = await prismaClient.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      joinDate: true,
      _count: {
        select: {
          scripts: true,
          reviews: true,
          downloads: true,
        }
      }
    },
    orderBy: { joinDate: 'desc' }
  })


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Users Management</h1>
            <p className="text-mehub-text-secondary mt-1">Manage all users and their roles</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-mehub-border text-mehub-text">
              Back to Admin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h3 className="text-mehub-text-secondary text-sm mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-mehub-text">{users.length}</p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h3 className="text-mehub-text-secondary text-sm mb-2">Developers</h3>
            <p className="text-4xl font-bold text-mehub-text">
              {users.filter(u => u.role === Role.Developer || u.role === Role.Admin).length}
            </p>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="bg-mehub-card border-mehub-border">
          <UserList users={users} currentUserId={profile.id} />
        </Card>
      </div>
    </div>
  )
}
