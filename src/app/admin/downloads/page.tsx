import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSessionProfileFromCookie } from "@/lib/sessionUtils"
import { redirect } from "next/navigation"
import { Role } from "@/generated/prisma/enums"
import { prismaClient } from "@/dal/prismaClient"
import { Download, TrendingUp } from "lucide-react"

export default async function AdminDownloadsPage() {
  const profile = await getSessionProfileFromCookie()

  if (!profile || profile.role !== Role.Admin) {
    redirect('/dashboard')
  }

  const downloads = await prismaClient.download.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
        }
      },
      script: {
        select: {
          id: true,
          title: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  })

  // Get total downloads per script
  const downloadsByScript = await prismaClient.script.findMany({
    select: {
      id: true,
      title: true,
      _count: {
        select: { scriptDownloads: true }
      }
    },
    orderBy: {
      scriptDownloads: {
        _count: 'desc'
      }
    },
    take: 10,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Downloads Statistics</h1>
            <p className="text-mehub-text-secondary mt-1">View download logs and statistics</p>
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
              <Download className="text-mehub-primary" size={24} />
              <h3 className="text-mehub-text-secondary text-sm">Total Downloads</h3>
            </div>
            <p className="text-4xl font-bold text-mehub-text">{downloads.length}</p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-500" size={24} />
              <h3 className="text-mehub-text-secondary text-sm">Unique Users</h3>
            </div>
            <p className="text-4xl font-bold text-mehub-text">
              {new Set(downloads.map(d => d.userId)).size}
            </p>
          </Card>
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h3 className="text-mehub-text-secondary text-sm mb-2">Today</h3>
            <p className="text-4xl font-bold text-mehub-text">
              {downloads.filter(d => {
                const today = new Date()
                const downloadDate = new Date(d.createdAt)
                return downloadDate.toDateString() === today.toDateString()
              }).length}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Downloaded Scripts */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h2 className="text-2xl font-bold text-mehub-text mb-6">Top Downloaded Scripts</h2>
            <div className="space-y-4">
              {downloadsByScript.map((script, index) => (
                <div key={script.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-mehub-text-secondary">
                      #{index + 1}
                    </span>
                    <Link
                      href={`/script/${script.id}`}
                      className="text-mehub-text hover:text-mehub-primary"
                    >
                      {script.title}
                    </Link>
                  </div>
                  <span className="text-mehub-text font-semibold">
                    {script._count.scriptDownloads} downloads
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Downloads */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <h2 className="text-2xl font-bold text-mehub-text mb-6">Recent Downloads</h2>
            <div className="space-y-3">
              {downloads.slice(0, 10).map((download) => (
                <div key={download.id} className="flex items-center justify-between text-sm">
                  <div>
                    <Link
                      href={`/script/${download.script.id}`}
                      className="text-mehub-primary hover:underline"
                    >
                      {download.script.title}
                    </Link>
                    <p className="text-mehub-text-secondary">
                      by {download.user.username}
                    </p>
                  </div>
                  <span className="text-mehub-text-secondary">
                    {new Date(download.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

