import React from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Star, Mail, LinkIcon } from "lucide-react"
import { mockUsers } from "@/lib/mock-data"
import { ProfileTabs } from "@/components/profile-tabs"

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params
  const user = Object.values(mockUsers).find((u) => u.username === resolvedParams.username)

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
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-4xl font-bold text-mehub-text">{user.username}</h1>
                {user.verified && <span className="text-mehub-primary text-2xl">✓</span>}
              </div>
              <p className="text-mehub-text-secondary mb-4">{user.bio}</p>
              <p className="text-mehub-text-secondary text-sm mb-4">
                Joined {new Date(user.joinDate).toLocaleDateString("en-US", { year: "numeric", month: "long" })}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-mehub-primary">{user.stats.scriptsUploaded}</div>
                  <div className="text-mehub-text-secondary text-sm">Scripts Uploaded</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-mehub-secondary">{user.stats.totalDownloads}</div>
                  <div className="text-mehub-text-secondary text-sm">Total Downloads</div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-3xl font-bold text-mehub-success">{user.stats.averageRating}</span>
                    <Star size={24} className="text-mehub-success" fill="currentColor" />
                  </div>
                  <div className="text-mehub-text-secondary text-sm">Avg Rating</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button className="bg-mehub-primary text-mehub-bg hover:bg-mehub-primary/90 flex items-center gap-2">
                  <Mail size={18} />
                  Contact
                </Button>
                <Button
                  variant="outline"
                  className="border-mehub-border text-mehub-text hover:bg-mehub-hover flex items-center gap-2 bg-transparent"
                >
                  <LinkIcon size={18} />
                  Copy Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <ProfileTabs userId={user.id} />

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub. Made for developers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
