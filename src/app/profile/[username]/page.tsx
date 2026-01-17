import React from "react"
import { Header } from "@/components/header"
import { Star } from "lucide-react"
import { ProfileTabs } from "@/components/profile-tabs"
import { getUserByUsername } from "@/dal/users"
import { getScripts } from "@/dal/scripts"
import { getReviews } from "@/dal/reviews"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const user = await getUserByUsername(resolvedParams.username)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-mehub-text">User not found</p>
        </div>
      </div>
    )
  }

  // Get user's scripts and reviews
  const [userScripts, userReviews] = await Promise.all([
    getScripts({
      authorId: user.id,
      isActive: true,
    }),
    getReviews({
      userId: user.id,
    })
  ])

  // Calculate stats from real data
  const stats = {
    scriptsUploaded: userScripts.length,
    totalDownloads: userScripts.reduce((sum, script) => sum + script._count.scriptDownloads, 0),
    averageRating: userScripts.length > 0
      ? (userScripts.reduce((sum, script) => sum + (script.averageRating || 0), 0) / userScripts.length).toFixed(1)
      : "N/A",
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-mehub-primary/20 to-mehub-secondary/20 border-b border-mehub-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar */}
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-mehub-border"
            />

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-mehub-text mb-2">{user.username}</h1>
              <p className="text-mehub-text-secondary mb-4">{user.bio}</p>
              <p className="text-mehub-text-secondary text-sm mb-4">
                Joined {new Date(user.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-mehub-primary">{stats.scriptsUploaded}</div>
                  <div className="text-mehub-text-secondary text-sm">Scripts Uploaded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-mehub-secondary">{stats.totalDownloads}</div>
                  <div className="text-mehub-text-secondary text-sm">Total Downloads</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-bold text-mehub-success">{stats.averageRating}</span>
                    {stats.averageRating !== "N/A" && <Star size={24} className="text-mehub-success" fill="currentColor" />}
                  </div>
                  <div className="text-mehub-text-secondary text-sm">Avg Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <ProfileTabs scripts={userScripts} reviews={userReviews} />

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}

