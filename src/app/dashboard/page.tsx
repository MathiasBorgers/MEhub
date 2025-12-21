import { Header } from "@/components/header"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Edit2, TrendingUp, Download, Star, Eye } from "lucide-react"
import { mockScripts, mockUsers, type Script } from "@/lib/mock-data"
import { DashboardActions } from "@/components/dashboard-actions"
import { getCurrentUser } from "@/lib/getCurrentUser"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  // Get the actual logged-in user
  const currentUser = await getCurrentUser()
  
  if (!currentUser) {
    redirect('/login')
  }
  
  console.log("Dashboard - Current user from JWT:", currentUser)
  
  // Find the user in mock data by email (since that's what we have in JWT)
  const mockUser = Object.values(mockUsers).find(u => u.email === currentUser.email)
  console.log("Dashboard - Found mock user:", mockUser)
  
  let userScripts: Script[] = []
  let totalStats = { uploads: 0, downloads: 0, avgRating: 0 }
  
  if (!mockUser) {
    console.log("Dashboard - No mock user found, showing empty dashboard")
    // No scripts for unknown users
    userScripts = []
    totalStats = {
      uploads: 0,
      downloads: 0,
      avgRating: 0,
    }
  } else {
    userScripts = mockScripts.filter((s) => s.author.id === mockUser.id)
    console.log("Dashboard - User scripts found:", userScripts.length)
    
    totalStats = {
      uploads: userScripts.length,
      downloads: userScripts.reduce((sum, s) => sum + s.downloads, 0),
      avgRating: Number(mockUser.stats.averageRating.toFixed(1)),
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-mehub-text">Dashboard</h1>
            <p className="text-mehub-text-secondary mt-1">Manage your scripts and track performance</p>
          </div>
          <Link href="/upload">
            <Button className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">Upload New Script</Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Scripts */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-mehub-text-secondary">Total Uploads</h3>
              <TrendingUp size={24} className="text-mehub-primary" />
            </div>
            <div className="text-4xl font-bold text-mehub-text">{totalStats.uploads}</div>
            <p className="text-mehub-text-secondary text-sm mt-2">Scripts published</p>
          </Card>

          {/* Total Downloads */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-mehub-text-secondary">Total Downloads</h3>
              <Download size={24} className="text-mehub-secondary" />
            </div>
            <div className="text-4xl font-bold text-mehub-text">{totalStats.downloads}</div>
            <p className="text-mehub-text-secondary text-sm mt-2">Across all scripts</p>
          </Card>

          {/* Avg Rating */}
          <Card className="bg-mehub-card border-mehub-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-mehub-text-secondary">Avg Rating</h3>
              <Star size={24} className="text-mehub-success" fill="currentColor" />
            </div>
            <div className="text-4xl font-bold text-mehub-text flex items-center gap-2">
              {totalStats.avgRating}
              <span className="text-2xl text-mehub-success">★</span>
            </div>
            <p className="text-mehub-text-secondary text-sm mt-2">From all reviews</p>
          </Card>
        </div>

        {/* Scripts Table */}
        <Card className="bg-mehub-card border-mehub-border">
          <div className="p-6 border-b border-mehub-border">
            <h2 className="text-2xl font-bold text-mehub-text">My Scripts</h2>
          </div>

          {userScripts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-mehub-text-secondary mb-4">No scripts uploaded yet</p>
              <Link href="/upload">
                <Button className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90">
                  Upload Your First Script
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-mehub-border">
                  <tr className="text-mehub-text-secondary text-sm">
                    <th className="text-left p-4">Script Name</th>
                    <th className="text-left p-4">Category</th>
                    <th className="text-right p-4">Downloads</th>
                    <th className="text-right p-4">Rating</th>
                    <th className="text-right p-4">Views</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {userScripts.map((script) => (
                    <tr key={script.id} className="border-b border-mehub-border hover:bg-mehub-bg transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={script.screenshots[0] || "/placeholder.svg"}
                            alt={script.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded object-cover"
                          />
                          <div>
                            <Link
                              href={`/script/${script.id}`}
                              className="text-mehub-primary hover:underline font-medium"
                            >
                              {script.title}
                            </Link>
                            <p className="text-mehub-text-secondary text-sm">v{script.version}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-mehub-text">{script.category}</td>
                      <td className="p-4 text-right text-mehub-text">{script.downloads}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star size={16} className="text-mehub-secondary" fill="currentColor" />
                          <span className="text-mehub-text">{script.rating}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right text-mehub-text flex items-center justify-end gap-1">
                        <Eye size={16} className="text-mehub-text-secondary" />
                        {script.downloads * 2}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-mehub-border text-mehub-text hover:bg-mehub-hover bg-transparent"
                          >
                            <Edit2 size={16} />
                          </Button>
                          <DashboardActions 
                            scriptId={script.id}
                            scriptTitle={script.title}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
