import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Star, Download, Zap } from "lucide-react"
import { getScripts } from "@/dal/scripts"
import { getCategoriesWithScriptCount } from "@/dal/categories"
import { prismaClient } from "@/dal/prismaClient"

export default async function Home() {
  // Fetch real data from database
  const allScripts = await getScripts({ isActive: true, limit: 3, sortBy: 'downloads', sortOrder: 'desc' })
  const categories = await getCategoriesWithScriptCount()

  // Get total counts
  const totalScripts = await prismaClient.script.count({ where: { isActive: true } })
  const totalUsers = await prismaClient.user.count({ where: { role: { in: ['Developer', 'Admin'] } } })

  // Get top contributors (users with most downloads)
  const topContributors = await prismaClient.user.findMany({
    where: {
      role: { in: ['Developer', 'Admin'] },
      scripts: { some: {} }
    },
    take: 3,
    include: {
      _count: {
        select: { scripts: true }
      },
      scripts: {
        select: {
          _count: {
            select: { scriptDownloads: true }
          }
        }
      }
    }
  })

  const featuredScripts = allScripts

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-5xl sm:text-6xl font-bold text-pretty">
              <span className="text-mehub-primary">Automate</span>
              <span className="text-mehub-text"> RS3 Scripts</span>
            </h1>
            <p className="text-xl text-mehub-text-secondary max-w-2xl mx-auto">
              Discover, share, and download free RuneScape 3 automation scripts built by the community for the community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
                >
                  Browse Scripts <ArrowRight size={20} />
                </Button>
              </Link>
              <Link href="/upload">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
                >
                  Share Your Script
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-20 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-mehub-primary">{totalScripts}</div>
              <div className="text-mehub-text-secondary text-sm mt-1">RS3 Scripts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-mehub-secondary">{categories.length}</div>
              <div className="text-mehub-text-secondary text-sm mt-1">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-mehub-success">{totalUsers}</div>
              <div className="text-mehub-text-secondary text-sm mt-1">Scripters</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Scripts */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-mehub-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-mehub-text">Featured Scripts</h2>
            <Link href="/marketplace">
              <Button
                variant="outline"
                className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
              >
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredScripts.map((script) => (
              <Link key={script.id} href={`/script/${script.id}`}>
                <Card className="bg-mehub-card border-mehub-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all h-full cursor-pointer">
                  <div className="p-6 space-y-4">
                    <img
                      src={script.screenshots[0] || "/placeholder.svg"}
                      alt={script.title}
                      className="w-full h-40 object-cover rounded-lg hover:opacity-90 hover:shadow-md hover:shadow-orange-500/20 transition-all"
                    />
                    <div>
                      <h3 className="font-bold text-mehub-text line-clamp-2">{script.title}</h3>
                      <p className="text-mehub-text-secondary text-sm mt-2 line-clamp-2">{script.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-mehub-border">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-mehub-secondary" fill="currentColor" />
                        <span className="text-mehub-text text-sm font-medium">{script.averageRating?.toFixed(1) || "N/A"}</span>
                        <span className="text-mehub-text-secondary text-xs">({script._count.reviews})</span>
                      </div>
                      <div className="flex items-center gap-1 text-mehub-text-secondary text-sm">
                        <Download size={14} />
                        {script._count.scriptDownloads}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-mehub-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-mehub-text">Script Categories</h2>
            <Link href="/categories">
              <Button
                variant="outline"
                className="border-mehub-border text-mehub-text hover:bg-orange-500/10 hover:border-orange-500 hover:text-orange-500 transition-all bg-transparent"
              >
                All Categories
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/marketplace?category=${encodeURIComponent(category.name)}`}>
                <Card className="bg-mehub-card border-mehub-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer p-6 text-center">
                  <h3 className="font-semibold text-mehub-text mb-2">{category.name}</h3>
                  <p className="text-mehub-text-secondary text-xs">{category.scriptCount} scripts</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Contributors */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-mehub-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-mehub-text mb-12">Top Scripters</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topContributors.map((user) => {
              const totalDownloads = user.scripts.reduce((sum, script) => sum + script._count.scriptDownloads, 0)
              const scriptsCount = user._count.scripts

              return (
                <Link key={user.id} href={`/profile/${user.username}`}>
                  <Card className="bg-mehub-card border-mehub-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={user.avatar || "/placeholder-user.jpg"}
                        alt={user.username}
                        className="w-16 h-16 rounded-full border-2 border-mehub-border hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-mehub-text">{user.username}</h3>
                        <p className="text-mehub-text-secondary text-sm mt-1 line-clamp-2">{user.bio || "RS3 Automation Developer"}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-mehub-border">
                      <div>
                        <div className="text-xl font-bold text-mehub-primary">{scriptsCount}</div>
                        <div className="text-mehub-text-secondary text-xs">Scripts</div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-mehub-secondary">{totalDownloads}</div>
                        <div className="text-mehub-text-secondary text-xs">Downloads</div>
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-mehub-border">
        <div className="max-w-2xl mx-auto text-center space-y-6 bg-mehub-card border border-mehub-border rounded-lg p-8">
          <h2 className="text-3xl font-bold text-mehub-text flex items-center justify-center gap-2">
            <Zap size={32} className="text-mehub-primary" />
            Share Your RS3 Script
          </h2>
          <p className="text-mehub-text-secondary">
            Join the RS3 community and share your automation scripts with thousands of players.
          </p>
          <Link href="/upload">
            <Button
              size="lg"
              className="bg-mehub-primary text-mehub-bg hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Upload Your First Script
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-mehub-border bg-mehub-card/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center text-mehub-text-secondary text-sm">
          <p>&copy; 2025 MEhub - RuneScape 3 Script Community. Made by scripters, for scripters.</p>
        </div>
      </footer>
    </div>
  )
}
