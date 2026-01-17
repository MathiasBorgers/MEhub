import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@prisma/client"
import { getSessions } from "@/dal/users"
import { Shield, CheckCircle, XCircle } from "lucide-react"
import { SessionsList } from "@/components/sessions-list"

export default async function AdminSessionsPage() {
  const profile = await getSessionProfileFromCookie()

  if (!profile || profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  const allSessions = await getSessions({ activeOnly: false, limit: 100 })
  const activeSessions = allSessions.filter(s => new Date(s.activeUntil) > new Date())
  const expiredSessions = allSessions.filter(s => new Date(s.activeUntil) <= new Date())

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Sessions Management</h1>
            <p className="text-mehub-text-secondary mt-1">Manage active user sessions</p>
          </div>
          <Link href="/admin">
            <Button variant="outline" className="border-mehub-border text-mehub-text">
              Back to Admin
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-green-500" size={24} />
              <h3 className="text-mehub-text-secondary text-sm">Active Sessions</h3>
            </div>
            <p className="text-4xl font-bold text-mehub-text">{activeSessions.length}</p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <XCircle className="text-red-500" size={24} />
              <h3 className="text-mehub-text-secondary text-sm">Expired Sessions</h3>
            </div>
            <p className="text-4xl font-bold text-mehub-text">{expiredSessions.length}</p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-blue-500" size={24} />
              <h3 className="text-mehub-text-secondary text-sm">Unique Users</h3>
            </div>
            <p className="text-4xl font-bold text-mehub-text">
              {new Set(allSessions.map(s => s.userId)).size}
            </p>
          </Card>
        </div>

        {/* Active Sessions */}
        <Card className="bg-mehub-card border-mehub-border mb-8">
          <div className="p-6 border-b border-mehub-border">
            <h2 className="text-2xl font-bold text-mehub-text">Active Sessions</h2>
          </div>
          <SessionsList sessions={activeSessions} />
        </Card>
      </div>
    </div>
  )
}

